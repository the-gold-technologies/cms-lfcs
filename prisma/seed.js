const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL environment variable is required.");
  process.exit(1);
}

const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding LFCS School CMS database with 100% verified Cloudinary data...");

  // 1. Admin User
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@lfcs.edu.in" },
    update: { password: adminPassword },
    create: {
      email: "admin@lfcs.edu.in",
      name: "LFCS Administrator",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("✓ Admin user created (admin@lfcs.edu.in / Admin@123)");

  // 2. Global Brand Configuration with Cloudinary URLs
  await prisma.globalConfig.upsert({
    where: { id: "global" },
    update: {
      siteTitle: "Little Flower Group of Schools",
      siteDescription: "Rooted in Values. Rising with Excellence.",
      logo: "https://res.cloudinary.com/dpa93copz/image/upload/v1793170044/lfcs-school/logo-header_1793170044344.webp",
      favicon:
        "https://res.cloudinary.com/dpa93copz/image/upload/v1793170045/lfcs-school/logo1_1793170045264.webp",
      phone: "+91 94508 24500",
      email: "info@lfgos.com",
      address: "Nizamuddinpura, Mau, Uttar Pradesh 275101",
      facebookUrl: "https://www.facebook.com/people/LFCS-Schools/61594935059542/",
      instagramUrl: "https://www.instagram.com/lfcs_schools/",
      youtubeUrl: "https://youtube.com/@lfcsschools?si=TCzIAvIrbwgYA2KY",
      robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://lfgos.com/sitemap.xml",
      sitemapEnabled: true,
    },
    create: {
      id: "global",
      siteTitle: "Little Flower Group of Schools",
      siteDescription: "Rooted in Values. Rising with Excellence.",
      logo: "https://res.cloudinary.com/dpa93copz/image/upload/v1793170044/lfcs-school/logo-header_1793170044344.webp",
      favicon:
        "https://res.cloudinary.com/dpa93copz/image/upload/v1793170045/lfcs-school/logo1_1793170045264.webp",
      phone: "+91 94508 24500",
      email: "info@lfgos.com",
      address: "Nizamuddinpura, Mau, Uttar Pradesh 275101",
      facebookUrl: "https://www.facebook.com/people/LFCS-Schools/61594935059542/",
      instagramUrl: "https://www.instagram.com/lfcs_schools/",
      youtubeUrl: "https://youtube.com/@lfcsschools?si=TCzIAvIrbwgYA2KY",
      robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://lfgos.com/sitemap.xml",
      sitemapEnabled: true,
    },
  });
  console.log("✓ Global brand configuration seeded with Cloudinary logos");

  // 3. Campuses from JSON
  const campusesFile = path.resolve(__dirname, "campuses-seed.json");
  if (fs.existsSync(campusesFile)) {
    const campuses = JSON.parse(fs.readFileSync(campusesFile, "utf-8"));
    for (const c of campuses) {
      const existing = await prisma.campus.findFirst({ where: { name: c.name } });
      if (existing) {
        await prisma.campus.update({ where: { id: existing.id }, data: c });
      } else {
        await prisma.campus.create({ data: c });
      }
    }
    console.log(`✓ ${campuses.length} School Campuses seeded with Cloudinary images`);
  }

  // 4. News & Press from JSON
  const newsFile = path.resolve(__dirname, "news-seed.json");
  if (fs.existsSync(newsFile)) {
    const newsItems = JSON.parse(fs.readFileSync(newsFile, "utf-8"));
    for (const n of newsItems) {
      const existing = await prisma.newsItem.findFirst({ where: { title: n.title } });
      if (existing) {
        await prisma.newsItem.update({ where: { id: existing.id }, data: n });
      } else {
        await prisma.newsItem.create({ data: n });
      }
    }
    console.log(`✓ ${newsItems.length} News & press articles seeded with Cloudinary images`);
  }

  // 5. Testimonials from JSON
  const testimonialsFile = path.resolve(__dirname, "testimonials-seed.json");
  if (fs.existsSync(testimonialsFile)) {
    const testimonials = JSON.parse(fs.readFileSync(testimonialsFile, "utf-8"));
    for (const t of testimonials) {
      const existing = await prisma.testimonial.findFirst({
        where: { name: t.name, role: t.role },
      });
      if (existing) {
        await prisma.testimonial.update({ where: { id: existing.id }, data: t });
      } else {
        await prisma.testimonial.create({ data: t });
      }
    }
    console.log(`✓ ${testimonials.length} Testimonials seeded`);
  }

  // 6. Gallery Items from JSON
  const galleryFile = path.resolve(__dirname, "gallery-seed.json");
  if (fs.existsSync(galleryFile)) {
    const galleryItems = JSON.parse(fs.readFileSync(galleryFile, "utf-8"));
    let gOrder = 0;
    for (const g of galleryItems) {
      const existing = await prisma.galleryItem.findFirst({ where: { caption: g.caption } });
      if (existing) {
        await prisma.galleryItem.update({
          where: { id: existing.id },
          data: { ...g, order: gOrder++ },
        });
      } else {
        await prisma.galleryItem.create({ data: { ...g, order: gOrder++ } });
      }
    }
    console.log(`✓ ${galleryItems.length} Photo Gallery items seeded with Cloudinary images`);
  }

  // 7. Academic Results (Toppers) from JSON
  const resultsFile = path.resolve(__dirname, "results-seed.json");
  if (fs.existsSync(resultsFile)) {
    const resultsItems = JSON.parse(fs.readFileSync(resultsFile, "utf-8"));
    for (const r of resultsItems) {
      const existing = await prisma.academicResult.findFirst({
        where: {
          studentName: r.studentName,
          examType: r.examType,
          percentageOrRank: r.percentageOrRank,
        },
      });
      if (existing) {
        await prisma.academicResult.update({ where: { id: existing.id }, data: r });
      } else {
        await prisma.academicResult.create({ data: r });
      }
    }
    console.log(
      `✓ ${resultsItems.length} Academic Results (Toppers) seeded with Cloudinary images`,
    );
  }

  // 8. Seed All Static Pages and Modular Sections
  const staticPagesFile = path.resolve(__dirname, "static-pages-seed.json");
  if (fs.existsSync(staticPagesFile)) {
    const staticPages = JSON.parse(fs.readFileSync(staticPagesFile, "utf-8"));
    const pageTitles = {
      home: "Home",
      about: "About Us",
      academics: "Academics",
      admissions: "Admissions",
      experience: "Student Experience",
      "start-school": "Start an Associate School",
      careers: "Careers",
      contact: "Contact Us",
      gallery: "Photo Gallery",
    };

    for (const [slug, sections] of Object.entries(staticPages)) {
      const title = pageTitles[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
      const page = await prisma.page.upsert({
        where: { slug },
        create: {
          title,
          slug,
          type: "static",
          visibility: "published",
        },
        update: {
          title,
        },
      });

      let order = 0;
      for (const [sectionType, sectionContent] of Object.entries(sections)) {
        await prisma.section.upsert({
          where: {
            pageId_type: {
              pageId: page.id,
              type: sectionType,
            },
          },
          update: {
            content: sectionContent,
            order: order++,
          },
          create: {
            pageId: page.id,
            type: sectionType,
            content: sectionContent,
            order: order++,
          },
        });
      }
      console.log(
        `✓ Static page "${title}" (${slug}) seeded with ${Object.keys(sections).length} sections`,
      );
    }
  }

  // 9. Default Dynamic Categories
  const defaultCategories = [
    { type: "gallery", name: "Campus & Facilities", order: 0 },
    { type: "gallery", name: "Classrooms", order: 1 },
    { type: "gallery", name: "Science Labs", order: 2 },
    { type: "gallery", name: "Early Years", order: 3 },
    { type: "gallery", name: "Sports & Fitness", order: 4 },
    { type: "gallery", name: "Arts & Culture", order: 5 },
    { type: "gallery", name: "Events & Achievements", order: 6 },
    { type: "testimonials", name: "PARENTS", order: 0 },
    { type: "testimonials", name: "TEACHERS", order: 1 },
    { type: "testimonials", name: "STUDENTS", order: 2 },
    { type: "results", name: "CBSE 10th", order: 0 },
    { type: "results", name: "CBSE 12th", order: 1 },
    { type: "results", name: "JEE", order: 2 },
    { type: "results", name: "NEET", order: 3 },
  ];

  for (const cat of defaultCategories) {
    await prisma.dynamicCategory.upsert({
      where: { type_name: { type: cat.type, name: cat.name } },
      update: { order: cat.order },
      create: cat,
    });
  }
  console.log(`✓ ${defaultCategories.length} Default Dynamic Categories verified`);

  console.log("🎉 Complete database seed with Cloudinary CDN URLs finished successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
