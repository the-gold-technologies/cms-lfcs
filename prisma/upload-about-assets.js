const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const LFCS_PUBLIC = path.resolve(__dirname, "../../lfcs-school/public");
const MAPPING_FILE = path.resolve(__dirname, "uploaded-assets.json");

let assetMap = {};
if (fs.existsSync(MAPPING_FILE)) {
  try {
    assetMap = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf-8"));
  } catch (e) {}
}

const aboutAssets = [
  // 1. Hero
  "/about-hero.webp",

  // 2. Our Story
  "/about/story1.webp",
  "/about/story2.webp",

  // 3. Educational Approach
  "/about/approach1.webp",
  "/about/approach2.webp",
  "/about/approach3.webp",
  "/about/approach4.webp",
  "/decorative_left_top.webp",

  // 4. Core Values
  "/about/values1.webp",
  "/about/values2.webp",
  "/about/values3.webp",
  "/about/values4.webp",
  "/about/values5.webp",
  "/about/values6.webp",
  "/decorative_right.webp",

  // 5. Leadership
  "/about/founder.webp",
  "/about/chairman.webp",
  "/about/sharman-joshi.webp",
  "/about/anand-kumar.webp",
  "/about/manju-rana-full.webp",

  // 6. Growth Milestones
  "/about/founder-portrait.webp",
  "/schools/Khalispur-Balia.webp",
  "/about/journey-lfis-mau.webp",
  "/schools/Ghosi.webp",
  "/schools/Kasimabad.webp",

  // 7. Awards
  "/about/awards/international-recognition-1.webp",
  "/about/awards/national-leadership-award-1.webp",
  "/about/awards/national-leadership-award-2.webp",
  "/about/awards/national-leadership-award-3.webp",
  "/about/awards/media-recognition-1.webp",
  "/about/awards/media-recognition-2.webp",

  // 8. CTA Banner
  "/cta-bg.webp",
];

async function uploadFile(relPath) {
  const localPath = path.join(LFCS_PUBLIC, relPath);
  if (!fs.existsSync(localPath)) {
    console.warn(`⚠️ File not found locally: ${localPath}`);
    return null;
  }

  // Already uploaded?
  if (assetMap[relPath] && assetMap[relPath].includes("res.cloudinary.com")) {
    console.log(`✓ Existing Cloudinary URL for: ${relPath} -> ${assetMap[relPath]}`);
    return assetMap[relPath];
  }

  const baseName = path.basename(relPath, path.extname(relPath));
  const publicId = `${baseName}_${Date.now()}`;

  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: "lfcs-school/about",
      public_id: publicId,
      resource_type: "auto",
      overwrite: false,
    });

    console.log(`🚀 Uploaded: ${relPath} -> ${result.secure_url}`);
    assetMap[relPath] = result.secure_url;
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(assetMap, null, 2), "utf-8");
    return result.secure_url;
  } catch (err) {
    console.error(`❌ Failed to upload ${relPath}:`, err.message);
    return null;
  }
}

async function main() {
  console.log("Starting upload of About page assets to Cloudinary...");
  for (const rel of aboutAssets) {
    await uploadFile(rel);
  }
  console.log("\nAll About page assets processed!");
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(assetMap, null, 2), "utf-8");
}

main().catch(console.error);

