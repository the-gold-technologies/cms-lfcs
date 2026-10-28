import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import nodemailer from "nodemailer";

function getSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true" || true,
    auth: { user, pass },
  });
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
    if (secret !== sharedSecret) {
      const authCheck = await checkAdminSession();
      if (!authCheck.authorized) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();
    const {
      formType,
      fullName,
      email,
      phone,
      preferredCampus,
      grade,
      academicSession,
      city,
      proposedLocation,
      landOwnership,
      landArea,
      schoolLevel,
      investmentCapacity,
      careerArea,
      roleOfInterest,
      experience,
      cvUrl,
      enquiryType,
      message,
    } = body;

    if (!formType || !fullName || !email) {
      return NextResponse.json(
        { success: false, error: "Form type, full name, and email are required" },
        { status: 400 },
      );
    }

    const submission = await prisma.submission.create({
      data: {
        formType,
        fullName,
        email,
        phone: phone || "",
        preferredCampus: preferredCampus || null,
        grade: grade || null,
        academicSession: academicSession || null,
        city: city || null,
        proposedLocation: proposedLocation || null,
        landOwnership: landOwnership || null,
        landArea: landArea || null,
        schoolLevel: schoolLevel || null,
        investmentCapacity: investmentCapacity || null,
        careerArea: careerArea || null,
        roleOfInterest: roleOfInterest || null,
        experience: experience || null,
        cvUrl: cvUrl || null,
        enquiryType: enquiryType || null,
        message: message || "",
        status: "New",
      },
    });

    // Send admin notification email asynchronously if configured
    const transporter = getSmtpTransporter();
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
    if (transporter && adminEmail) {
      const mailOptions = {
        from: process.env.SMTP_FROM || `"LFCS School Leads" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `[New Lead: ${formType.toUpperCase()}] from ${fullName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #6a2238; margin-top: 0;">New ${formType.toUpperCase()} Submission</h2>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "N/A"}</p>
            ${preferredCampus ? `<p><strong>Preferred Campus:</strong> ${preferredCampus}</p>` : ""}
            ${grade ? `<p><strong>Class / Grade:</strong> ${grade}</p>` : ""}
            ${city ? `<p><strong>City / Location:</strong> ${city}</p>` : ""}
            ${investmentCapacity ? `<p><strong>Investment Capacity:</strong> ${investmentCapacity}</p>` : ""}
            ${roleOfInterest ? `<p><strong>Role Applied:</strong> ${roleOfInterest} (${careerArea || ""})</p>` : ""}
            ${cvUrl ? `<p><strong>CV Document:</strong> <a href="${cvUrl}">View / Download CV</a></p>` : ""}
            <p><strong>Message / Details:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 12px; border-left: 4px solid #6a2238; margin: 0;">${message || "No additional message."}</blockquote>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 11px; color: #888;">Manage this inquiry in your LFCS School CMS portal.</p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions).catch((err) => {
        console.error("[SMTP Alert] Could not send lead notification:", err);
      });
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

