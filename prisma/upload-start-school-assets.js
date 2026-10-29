const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dpa93copz",
  api_key: process.env.CLOUDINARY_API_KEY || "895423851535284",
  api_secret: process.env.CLOUDINARY_API_SECRET || "1V9Lq48QjVnC2Q9oRj9vE2_J4b0",
});

const uploadedAssetsPath = path.resolve(__dirname, "uploaded-assets.json");
let uploadedAssets = {};
if (fs.existsSync(uploadedAssetsPath)) {
  uploadedAssets = JSON.parse(fs.readFileSync(uploadedAssetsPath, "utf-8"));
}

const assetsToUpload = [
  {
    localPath: "/Users/sudeeshkumar/Desktop/TGT COMPANY/lfcs-school/public/start-school/start-school-hero.webp",
    key: "/start-school/start-school-hero.webp",
    folder: "lfcs-school/start-school",
  },
  {
    localPath: "/Users/sudeeshkumar/Desktop/TGT COMPANY/lfcs-school/public/start-school/lfis-mau-crop.webp",
    key: "/start-school/lfis-mau-crop.webp",
    folder: "lfcs-school/start-school",
  },
  {
    localPath: "/Users/sudeeshkumar/Desktop/TGT COMPANY/lfcs-school/public/start-school/investment1.webp",
    key: "/start-school/investment1.webp",
    folder: "lfcs-school/start-school",
  },
  {
    localPath: "/Users/sudeeshkumar/Desktop/TGT COMPANY/lfcs-school/public/start-school/investment2.webp",
    key: "/start-school/investment2.webp",
    folder: "lfcs-school/start-school",
  },
  {
    localPath: "/Users/sudeeshkumar/Desktop/TGT COMPANY/lfcs-school/public/start-school/investment3.webp",
    key: "/start-school/investment3.webp",
    folder: "lfcs-school/start-school",
  },
  {
    localPath: "/Users/sudeeshkumar/Desktop/TGT COMPANY/lfcs-school/public/start-school/investment4.webp",
    key: "/start-school/investment4.webp",
    folder: "lfcs-school/start-school",
  },
  {
    localPath: "/Users/sudeeshkumar/Desktop/TGT COMPANY/lfcs-school/public/start-school/investment5.webp",
    key: "/start-school/investment5.webp",
    folder: "lfcs-school/start-school",
  },
  {
    localPath: "/Users/sudeeshkumar/Desktop/TGT COMPANY/lfcs-school/public/start-school/investment6.webp",
    key: "/start-school/investment6.webp",
    folder: "lfcs-school/start-school",
  },
];

async function uploadFile(item) {
  if (uploadedAssets[item.key]) {
    console.log(`✓ Already uploaded: ${item.key} -> ${uploadedAssets[item.key]}`);
    return;
  }

  if (!fs.existsSync(item.localPath)) {
    console.error(`✗ Local file not found: ${item.localPath}`);
    return;
  }

  const baseName = path.basename(item.localPath, path.extname(item.localPath));
  const publicId = `${baseName}_${Date.now()}`;

  try {
    const result = await cloudinary.uploader.upload(item.localPath, {
      folder: item.folder,
      public_id: publicId,
      resource_type: "auto",
      overwrite: true,
    });
    uploadedAssets[item.key] = result.secure_url;
    console.log(`✓ Uploaded ${item.key} -> ${result.secure_url}`);
  } catch (err) {
    console.error(`✗ Failed to upload ${item.key}:`, err.message);
  }
}

async function main() {
  console.log("Starting upload of Start School assets to Cloudinary...");
  for (const item of assetsToUpload) {
    await uploadFile(item);
  }
  fs.writeFileSync(uploadedAssetsPath, JSON.stringify(uploadedAssets, null, 2), "utf-8");
  console.log("All Start School assets uploaded and saved to uploaded-assets.json!");
}

main();

