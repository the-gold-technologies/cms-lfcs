import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Extracts all Cloudinary and local upload URLs from any string, array, or deeply nested object
 */
export function extractMediaUrls(data: any, collected: Set<string> = new Set()): Set<string> {
  if (!data) return collected;

  if (typeof data === "string") {
    if (data.includes("res.cloudinary.com")) {
      const cloudMatches = data.match(/https?:\/\/[^\s"'<>]*(?:res\.cloudinary\.com)[^\s"'<>]*/gi);
      if (cloudMatches) {
        for (const m of cloudMatches) {
          const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "lfcs-school";
          if (m.includes("/lfcs-school/") || m.includes(`/${cloudName}/`)) {
            collected.add(m);
          }
        }
      }
    } else {
      const localMatches = data.match(/(?:^|["'\s])(\/uploads\/[^\s"'<>]+\.[a-zA-Z0-9]+)/g);
      if (localMatches) {
        for (const m of localMatches) {
          collected.add(m.trim().replace(/^["']/, ""));
        }
      }
    }
  } else if (Array.isArray(data)) {
    for (const item of data) {
      extractMediaUrls(item, collected);
    }
  } else if (typeof data === "object") {
    for (const val of Object.values(data)) {
      extractMediaUrls(val, collected);
    }
  }

  return collected;
}

export const extractCloudinaryUrls = extractMediaUrls;

/**
 * Permanently deletes a single asset by URL (Cloudinary or local /uploads/)
 */
export async function deleteCloudinaryAsset(url: string | null | undefined): Promise<boolean> {
  if (!url || typeof url !== "string") return false;

  if (url.startsWith("/uploads/")) {
    try {
      const localPath = path.join(process.cwd(), "public", url);
      await fs.unlink(localPath);
      console.log(`[Media Cleanup on Save] Deleted obsolete local file: ${localPath}`);
      return true;
    } catch {
      return false;
    }
  }

  if (!url.includes("res.cloudinary.com")) return false;

  const hasCredentials =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasCredentials) return false;

  try {
    const match = url.match(/\/(image|raw|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    if (!match) return false;

    const resourceType = match[1] as "image" | "raw" | "video";
    let publicId = match[2];

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return result.result === "ok";
  } catch (err) {
    console.warn(`[Cloudinary Cleanup] Failed to delete:`, err);
    return false;
  }
}

/**
 * Compares old content with new content and deletes any image assets that were removed
 */
export async function cleanupObsoleteCloudinaryAssets(oldContent: any, newContent: any) {
  try {
    const oldUrls = extractMediaUrls(oldContent);
    const newUrls = extractMediaUrls(newContent);

    for (const oldUrl of oldUrls) {
      if (!newUrls.has(oldUrl)) {
        await deleteCloudinaryAsset(oldUrl);
      }
    }
  } catch (err) {
    console.error("[Media Cleanup] Error during garbage collection:", err);
  }
}

