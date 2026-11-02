import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const CV_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_CV_BYTES = 5 * 1024 * 1024;

const TEXT_FIELDS = [
  "formType",
  "fullName",
  "email",
  "phone",
  "preferredCampus",
  "grade",
  "academicSession",
  "city",
  "proposedLocation",
  "landOwnership",
  "landArea",
  "schoolLevel",
  "investmentCapacity",
  "careerArea",
  "roleOfInterest",
  "experience",
  "cvUrl",
  "enquiryType",
  "message",
] as const;

type SubmissionFields = Partial<Record<(typeof TEXT_FIELDS)[number], string>>;

function getSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT) || 465;
  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user, pass },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * The website posts multipart form data (so a CV can be attached); admin tools may post JSON
 */
async function readSubmission(req: Request): Promise<{ fields: SubmissionFields; cv: File | null }> {
  const fields: SubmissionFields = {};
  if ((req.headers.get("content-type") || "").includes("multipart/form-data")) {
    const data = await req.formData();
    for (const key of TEXT_FIELDS) {
      const value = data.get(key);
      if (typeof value === "string") fields[key] = value.trim();
    }
    const cv = data.get("cv");
    return { fields, cv: cv instanceof File && cv.size > 0 ? cv : null };
  }

  const body = await req.json();
  for (const key of TEXT_FIELDS) {
    if (typeof body?.[key] === "string") fields[key] = body[key].trim();
  }
  return { fields, cv: null };
}

/**
 * Stores a CV on Cloudinary (or public/uploads when Cloudinary is not configured) and returns its URL
 */
async function storeCv(cv: File, fullName: string): Promise<string> {
  const ext = path.extname(cv.name).toLowerCase();
  const baseName = `${fullName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60)}_cv_${Date.now()}${ext}`;
  const buffer = Buffer.from(await cv.arrayBuffer());

  const hasCloudinaryCredentials = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
  );

  if (hasCloudinaryCredentials) {
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${process.env.CLOUDINARY_FOLDER || "lfcs-school"}/cvs`,
          resource_type: "raw",
          public_id: baseName,
        },
        (error, result) => (error ? reject(error) : resolve(result)),
      );
      uploadStream.end(buffer);
    });
    return result.secure_url;
  }

  const uploadsDir = path.resolve(process.cwd(), "public", "uploads", "cvs");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, baseName), buffer);
  return `/uploads/cvs/${baseName}`;
}

const EMAIL_FIELDS: { key: keyof SubmissionFields; label: string }[] = [
  { key: "fullName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "enquiryType", label: "Enquiry Type" },
  { key: "preferredCampus", label: "Preferred Campus" },
  { key: "grade", label: "Class / Grade" },
  { key: "academicSession", label: "Academic Session" },
  { key: "city", label: "City / Location" },
  { key: "proposedLocation", label: "Proposed School Location" },
  { key: "landOwnership", label: "Land Ownership / Access" },
  { key: "landArea", label: "Approximate Land Area" },
  { key: "schoolLevel", label: "Proposed School Level" },
  { key: "investmentCapacity", label: "Investment Capacity" },
  { key: "careerArea", label: "Area of Interest" },
  { key: "roleOfInterest", label: "Role of Interest" },
  { key: "experience", label: "Experience" },
];

function renderNotification(fields: SubmissionFields, cvUrl: string | null) {
  const formType = (fields.formType || "").toUpperCase();
  const rows = EMAIL_FIELDS.filter(({ key }) => fields[key])
    .map(({ key, label }) => `<p><strong>${label}:</strong> ${escapeHtml(fields[key]!)}</p>`)
    .join("");
  const cvLink = cvUrl
    ? `<p><strong>CV Document:</strong> <a href="${escapeHtml(cvUrl)}">View / Download CV</a></p>`
    : "";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
      <h2 style="color: #6a2238; margin-top: 0;">New ${escapeHtml(formType)} Submission</h2>
      ${rows}
      ${cvLink}
      <p><strong>Message / Details:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 12px; border-left: 4px solid #6a2238; margin: 0; white-space: pre-wrap;">${escapeHtml(fields.message || "No additional message.")}</blockquote>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 11px; color: #888;">Reply to this email to respond to the sender. Manage this inquiry in your LFCS School CMS portal.</p>
    </div>
  `;
  const text = [
    `New ${formType} Submission`,
    "",
    ...EMAIL_FIELDS.filter(({ key }) => fields[key]).map(({ key, label }) => `${label}: ${fields[key]}`),
    ...(cvUrl ? [`CV: ${cvUrl}`] : []),
    "",
    fields.message || "No additional message.",
  ].join("\n");
  return { html, text };
}

export async function GET(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { searchParams } = new URL(req.url);
    const formType = searchParams.get("formType");
    const status = searchParams.get("status");

    const where: any = {};
    if (formType && formType !== "all") where.formType = formType;
    if (status && status !== "all") where.status = status;

    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error("Submissions fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-cms-secret");
    const sharedSecret = process.env.CMS_SHARED_SECRET;

    // Verify request is from website or admin
    if (!sharedSecret || secret !== sharedSecret) {
      const authCheck = await checkAdminSession();
      if (!authCheck.authorized) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    const { fields, cv } = await readSubmission(req);
    const { formType, fullName, email } = fields;

    if (!formType || !fullName || !email) {
      return NextResponse.json(
        { success: false, error: "Form type, full name, and email are required" },
        { status: 400 },
      );
    }

    if (cv) {
      if (!CV_EXTENSIONS.includes(path.extname(cv.name).toLowerCase())) {
        return NextResponse.json(
          { success: false, error: "CV must be a PDF or Word document" },
          { status: 400 },
        );
      }
      if (cv.size > MAX_CV_BYTES) {
        return NextResponse.json(
          { success: false, error: "CV must be 5 MB or smaller" },
          { status: 400 },
        );
      }
    }

    // A failed CV upload shouldn't lose the enquiry itself
    let cvUrl = fields.cvUrl || null;
    if (cv) {
      try {
        cvUrl = await storeCv(cv, fullName);
      } catch (err) {
        console.error("[CV Upload] Could not store CV:", err);
      }
    }

    const submission = await prisma.submission.create({
      data: {
        formType,
        fullName,
        email,
        phone: fields.phone || "",
        preferredCampus: fields.preferredCampus || null,
        grade: fields.grade || null,
        academicSession: fields.academicSession || null,
        city: fields.city || null,
        proposedLocation: fields.proposedLocation || null,
        landOwnership: fields.landOwnership || null,
        landArea: fields.landArea || null,
        schoolLevel: fields.schoolLevel || null,
        investmentCapacity: fields.investmentCapacity || null,
        careerArea: fields.careerArea || null,
        roleOfInterest: fields.roleOfInterest || null,
        experience: fields.experience || null,
        cvUrl,
        enquiryType: fields.enquiryType || null,
        message: fields.message || "",
        status: "New",
      },
    });

    // Send the admin notification after the response so the website isn't kept waiting
    const transporter = getSmtpTransporter();
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
    if (transporter && adminEmail) {
      const absoluteCvUrl =
        cvUrl && cvUrl.startsWith("/")
          ? `${(process.env.NEXTAUTH_URL || "").replace(/\/$/, "")}${cvUrl}`
          : cvUrl;
      const { html, text } = renderNotification(fields, absoluteCvUrl);
      after(async () => {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || `"LFCS School Leads" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            replyTo: email,
            subject: `[New Lead: ${formType.toUpperCase()}] from ${fullName}`,
            html,
            text,
          });
        } catch (err) {
          console.error("[SMTP Alert] Could not send lead notification:", err);
        }
      });
    } else {
      console.warn("[SMTP Alert] SMTP_HOST/SMTP_USER/SMTP_PASS not set; lead notification not sent");
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    console.error("Submission intake error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to record submission" },
      { status: 500 },
    );
  }
}
