import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { checkAdminSession } from "@/lib/auth-check";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Extracts publicId and resourceType from a Cloudinary URL
 */
function extractCloudinaryAsset(
  url: string,
): { publicId: string; resourceType: "image" | "raw" | "video" } | null {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("cloudinary.com")) return null;

  try {
    const match = url.match(/\/(image|raw|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    if (!match) return null;

    const resourceType = match[1] as "image" | "raw" | "video";
    let publicId = match[2];

    if (
      resourceType === "raw" &&
      url.toLowerCase().endsWith(".pdf") &&
      !publicId.endsWith(".pdf")
    ) {
      publicId = `${publicId}.pdf`;
    }

    return { publicId, resourceType };
  } catch (err) {
    console.error("Error extracting Cloudinary asset:", err);
    return null;
  }
}

/**
 * Deletes previous asset from Cloudinary or local storage securely
 */
async function deletePreviousAsset(urlOrPublicId: string) {
  if (!urlOrPublicId || typeof urlOrPublicId !== "string") return;

  const hasCloudinaryCredentials =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasCloudinaryCredentials) {
    if (urlOrPublicId.startsWith("/uploads/")) {
      try {
        const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
        const cleanRelPath = urlOrPublicId.replace(/^\/+/, "");
        const localPath = path.resolve(process.cwd(), "public", cleanRelPath);
        if (localPath.startsWith(uploadsDir)) {
          await fs.unlink(localPath);
        }
      } catch (e) {
        // ignore if already deleted
      }
    }
    return;
  }

  const asset = extractCloudinaryAsset(urlOrPublicId);
  const publicId = asset ? asset.publicId : urlOrPublicId;
  const resourceType = asset ? asset.resourceType : "image";

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return res;
  } catch (err) {
    console.warn(`[Cloudinary] Could not delete previous asset ${publicId}:`, err);
  }
}

/**
 * Compresses raster images using sharp before uploading
 */
async function compressImageBuffer(
  inputBuffer: Buffer,
  mimeType: string,
  fileName: string,
): Promise<{ buffer: Buffer; format: string; extension: string }> {
  const isSvg = mimeType === "image/svg+xml" || fileName.toLowerCase().endsWith(".svg");
  const isIco = mimeType === "image/x-icon" || fileName.toLowerCase().endsWith(".ico");
  const isPdf = mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");

  if (isSvg || isIco || isPdf) {
    return {
      buffer: inputBuffer,
      format: isPdf ? "pdf" : isSvg ? "svg" : "ico",
      extension: isPdf ? ".pdf" : isSvg ? ".svg" : ".ico",
    };
  }

  try {
    const sharpInstance = sharp(inputBuffer, { animated: false });
    const metadata = await sharpInstance.metadata();

    let pipeline = sharpInstance;
    if ((metadata.width && metadata.width > 2000) || (metadata.height && metadata.height > 2000)) {
      pipeline = pipeline.resize({
        width: 2000,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const compressedBuffer = await pipeline
      .webp({
        quality: 82,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer();

    return {
      buffer: compressedBuffer,
      format: "webp",
      extension: ".webp",
    };
  } catch (err) {
    console.warn(`[Image Compression] Sharp compression failed for ${fileName}:`, err);
    return {
      buffer: inputBuffer,
      format: mimeType.split("/")[1] || "jpeg",
      extension: `.${mimeType.split("/")[1] || "jpg"}`,
    };
  }
}

export async function POST(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const data = await request.formData();
    const file: File | null = (data.get("file") || data.get("files")) as unknown as File;
    const folder = (data.get("folder") as string) || process.env.CLOUDINARY_FOLDER || "lfcs-school";
    const previousUrl = (data.get("previousUrl") || data.get("oldImageUrl")) as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const MAX_FILE_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds maximum size limit of 15MB" },
        { status: 400 },
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf", ".ico"];
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Please upload images or PDFs." },
        { status: 400 },
      );
    }

    if (previousUrl) {
      await deletePreviousAsset(previousUrl);
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    const isSvg = file.type === "image/svg+xml" || ext === ".svg";
    if (isSvg) {
      const svgText = rawBuffer.toString("utf-8");
      if (
        /<script[\s>]/i.test(svgText) ||
        /javascript:/i.test(svgText) ||
        /onload\s*=/i.test(svgText) ||
        /onerror\s*=/i.test(svgText)
      ) {
        return NextResponse.json(
          { success: false, error: "Malicious script detected in SVG file." },
          { status: 400 },
        );
      }
    }

    const compressed = await compressImageBuffer(rawBuffer, file.type, file.name);

    const isPdf = file.type === "application/pdf" || ext === ".pdf";
    const cleanBaseName = file.name
      .replace(/\.[a-zA-Z0-9]+$/i, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 80);

    const hasCloudinaryCredentials = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
    );

    if (hasCloudinaryCredentials) {
      const publicId = isPdf
        ? `${cleanBaseName}_${Date.now()}.pdf`
        : `${cleanBaseName}_${Date.now()}`;

      const result = await new Promise<any>((resolve, reject) => {
        const uploadOptions: any = {
          folder,
          resource_type: isPdf ? "raw" : "image",
          public_id: publicId,
          overwrite: true,
        };

        if (!isPdf) {
          uploadOptions.format = "webp";
          uploadOptions.transformation = [{ quality: "auto:good", fetch_format: "webp" }];
        }

        const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });

        uploadStream.end(compressed.buffer);
      });

      const originalSizeKb = Math.round(rawBuffer.length / 1024);
      const finalSizeKb = Math.round(compressed.buffer.length / 1024);
      const savedPercent =
        originalSizeKb > 0
          ? `${Math.max(0, Math.round(((originalSizeKb - finalSizeKb) / originalSizeKb) * 100))}%`
          : "0%";

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        sizeKb: finalSizeKb,
        originalSizeKb,
        compressionRatio: savedPercent,
      });
    }

    // Local fallback
    const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const localFileName = `${cleanBaseName}_${Date.now()}${compressed.extension}`;
    const localFilePath = path.join(uploadsDir, localFileName);
    await fs.writeFile(localFilePath, compressed.buffer);

    const originalSizeKb = Math.round(rawBuffer.length / 1024);
    const finalSizeKb = Math.round(compressed.buffer.length / 1024);
    const savedPercent =
      originalSizeKb > 0
        ? `${Math.max(0, Math.round(((originalSizeKb - finalSizeKb) / originalSizeKb) * 100))}%`
        : "0%";

    return NextResponse.json({
      success: true,
      url: `/uploads/${localFileName}`,
      sizeKb: finalSizeKb,
      originalSizeKb,
      compressionRatio: savedPercent,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "File upload failed" },
      { status: 500 },
    );
  }
}
