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

// Load existing mapping if available to avoid re-uploading
let assetMap = {};
if (fs.existsSync(MAPPING_FILE)) {
  try {
    assetMap = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf-8"));
  } catch (e) {}
}

async function uploadFile(relPath) {
  if (assetMap[relPath]) {
    return assetMap[relPath];
  }

  const fullPath = path.join(LFCS_PUBLIC, relPath.replace(/^\//, ""));
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return relPath;
  }

  const cleanBaseName = path
    .basename(relPath, path.extname(relPath))
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const folder = "lfcs-school";

  console.log(`Uploading ${relPath} to Cloudinary...`);
  try {
    const result = await cloudinary.uploader.upload(fullPath, {
      folder,
      public_id: `${cleanBaseName}_${Date.now()}`,
      resource_type: "image",
      overwrite: false,
    });
    assetMap[relPath] = result.secure_url;
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(assetMap, null, 2));
    console.log(`✓ ${relPath} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`Upload error for ${relPath}:`, err.message);
    return relPath;
  }
}

async function main() {
  console.log("🚀 Starting Cloudinary upload pipeline for LFCS School assets...");

  // 1. Campuses Images
  const campusImages = [
    "/schools/Nizamuddinpura-Mau.webp",
    "/schools/Sikatia-Mau.webp",
    "/schools/Ghosi.webp",
    "/schools/Khalispur-Balia.webp",
    "/schools/Kasimabad.webp",
    "/schools/lfcs-azamgarh.webp",
    "/schools/lfis-mau.webp",
    "/schools/azad-hind-inter-college.webp",
  ];

  // 2. News Images
  const newsImages = [
    "/news-&-events/school-associate-launch.webp",
    "/news-&-events/anand-kumar-toi-profile.webp",
    "/news-&-events/anand-kumar-felicitation.webp",
    "/about/anand-kumar.webp",
    "/about/sharman-joshi.webp",
    "/news-&-events/logo-unveiling.webp",
  ];

  // 3. Gallery Images
  const galleryImages = [
    "/schools/Nizamuddinpura-Mau.webp",
    "/about/journey-lfis-mau.webp",
    "/schools/Ghosi.webp",
    "/schools/Kasimabad.webp",
    "/schools/Khalispur-Balia.webp",
    "/schools/Sikatia-Mau.webp",
    "/academics/facility/library.webp",
    "/academics/facility/computer-lab.webp",
    "/experience/sports1.webp",
    "/home-page/skills1.webp",
    "/academics/facility/digital-classroom.webp",
    "/home-page/Experience6.webp",
    "/home-page/skills6.webp",
    "/academics/collabrative.webp",
    "/home-page/Experience2.webp",
    "/home-page/Experience3.webp",
    "/home-page/Experience5.webp",
    "/academics/practical.webp",
    "/home-page/skills2.webp",
    "/home-page/skills5.webp",
    "/academics/independent.webp",
    "/home-page/Experience1.webp",
    "/home-page/Experience4.webp",
    "/home-page/Experience7.webp",
    "/academics/activity.webp",
    "/experience/art1.webp",
    "/home-page/skills3.webp",
    "/experience/sports2.webp",
    "/home-page/skills4.webp",
    "/experience/art2.webp",
    "/experience/life1.webp",
    "/experience/life2.webp",
    "/home-page/Experience8.webp",
    "/home-page/Experience9.webp",
  ];

  // 4. Brand & Layout Images
  const brandImages = ["/logo-header.webp", "/logo1.webp", "/icon.png", "/herobg1.webp"];

  const allImages = [
    ...new Set([...campusImages, ...newsImages, ...galleryImages, ...brandImages]),
  ];
  console.log(`Found ${allImages.length} distinct assets to process.`);

  for (const imgPath of allImages) {
    await uploadFile(imgPath);
  }

  console.log("🎉 Cloudinary upload complete! Assets saved to prisma/uploaded-assets.json");
}

main().catch(console.error);
