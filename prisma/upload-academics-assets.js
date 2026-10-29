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

const academicsAssets = [
  // 1. Hero
  "/academics-hero.webp",

  // 2. Curriculum
  "/academics/curriculum.webp",
  "/decorative_right.webp",

  // 3. Journey Cards
  "/JourneyCard1.webp",
  "/JourneyCard2.webp",
  "/JourneyCard3.webp",
  "/JourneyCard4.webp",
  "/JourneyCard5.webp",

  // 4. Teaching and Learning
  "/academics/classroom.webp",
  "/academics/activity.webp",
  "/academics/practical.webp",
  "/academics/technology.webp",
  "/academics/collabrative.webp",
  "/academics/independent.webp",

  // 5. Faculty / Principals
  "/decorative_left_top.webp",
  "/academics/principals/sarita-kedia.webp",
  "/academics/principals/pl-jaishi.webp",
  "/academics/principals/sanjay-rai.webp",
  "/academics/principals/deepa-pal.webp",
  "/academics/principals/ekta-singh.webp",
  "/academics/principals/zeeta-lepcha.webp",
  "/academics/principals/mahendra-yadav.webp",

  // 6. Facilities
  "/academics/facility/digital-classroom.webp",
  "/academics/facility/science-lab.webp",
  "/academics/facility/computer-lab.webp",
  "/academics/facility/library.webp",

  // 7. CTA
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
      folder: "lfcs-school/academics",
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
  console.log("Starting upload of Academics page assets to Cloudinary...");
  for (const rel of academicsAssets) {
    await uploadFile(rel);
  }
  console.log("\nAll Academics page assets processed!");
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(assetMap, null, 2), "utf-8");
}

main().catch(console.error);
