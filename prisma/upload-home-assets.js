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

const homeAssets = [
  // Hero
  "/hersection_bg.webp",
  "/herobg1.webp",

  // Welcome Section
  "/home-page/academics.webp",
  "/home-page/holistic.webp",
  "/home-page/future.webp",

  // Notes of Support
  "/about/sharman-joshi.webp",
  "/about/anand-kumar.webp",

  // How We Educate
  "/home-page/how-we-educate.webp",
  "/decorative_right.webp",

  // Our Approach Skills
  "/home-page/skills1.webp",
  "/home-page/skills2.webp",
  "/home-page/skills3.webp",
  "/home-page/skills4.webp",
  "/home-page/skills5.webp",
  "/home-page/skills6.webp",

  // Campus Experience Carousel
  "/home-page/Experience1.webp",
  "/home-page/Experience2.webp",
  "/home-page/Experience3.webp",
  "/home-page/Experience4.webp",
  "/home-page/Experience5.webp",
  "/home-page/Experience6.webp",
  "/home-page/Experience7.webp",
  "/home-page/Experience8.webp",
  "/home-page/Experience9.webp",

  // News (used on Home)
  "/news-&-events/school-associate-launch.webp",
  "/news-&-events/anand-kumar-toi-profile.webp",
  "/news-&-events/anand-kumar-felicitation.webp",
  "/news-&-events/logo-unveiling.webp",
];

async function uploadFile(relPath) {
  if (assetMap[relPath]) {
    console.log(`[Already Uploaded] ${relPath} -> ${assetMap[relPath]}`);
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
  const folder = "lfcs-school/home";

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
  console.log("Starting upload of Home Page assets to Cloudinary...");
  for (const relPath of homeAssets) {
    await uploadFile(relPath);
  }
  console.log("Finished uploading Home Page assets!");
}

main().catch(console.error);
