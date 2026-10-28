const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectionString =
  process.env.DATABASE_URL || "postgresql://sudeeshkumar@localhost:5432/lfcs_school_cms";

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
      favicon: "https://res.cloudinary.com/dpa93copz/image/upload/v1793170045/lfcs-school/logo1_1793170045264.webp",
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
      favicon: "https://res.cloudinary.com/dpa93copz/image/upload/v1793170045/lfcs-school/logo1_1793170045264.webp",
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
      const existing = await prisma.testimonial.findFirst({ where: { name: t.name, role: t.role } });
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
        await prisma.galleryItem.update({ where: { id: existing.id }, data: { ...g, order: gOrder++ } });
      } else {
        await prisma.galleryItem.create({ data: { ...g, order: gOrder++ } });
      }
    }
    console.log(`✓ ${galleryItems.length} Photo Gallery items seeded with Cloudinary images`);
  }

  // 7. Seed Home Page Sections
  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    create: {
      title: "Home",
      slug: "home",
      type: "static",
      visibility: "published",
    },
    update: {},
  });

  const homeSections = [
    {
      type: "HeroSection",
      content: {
        title: "Little Flower Group of Schools",
        tagline: "Rooted in Values. Rising with Excellence.",
        years: "40+",
        campuses: "8",
        students: "15,000+",
        bgImage: "https://res.cloudinary.com/dpa93copz/image/upload/v1793170046/lfcs-school/herobg1_1793170046153.webp",
      },
      order: 0,
    },
    {
      type: "WelcomeSection",
      content: {
        heading: "Welcome to Little Flower Group of Schools",
        description: "For over four decades, Little Flower has been dedicated to providing quality, value-based education across Eastern Uttar Pradesh. We believe that true education nurtures the mind, body, and spirit.",
        quote: "Education is not merely the transmission of knowledge; it is the ignition of character, curiosity, and compassion.",
      },
      order: 1,
    },
    {
      type: "NoteOfSupportSection",
      content: {
        anandKumarQuote: "LFCS's mission of bringing quality, affordable education to every community aligns deeply with the philosophy of Super 30. I am honored to support their School Associate initiative.",
        sharmanJoshiQuote: "Education for all is the foundation of a progressive nation. Little Flower Schools' commitment to holistic child development is truly inspiring.",
      },
      order: 2,
    },
    {
      type: "CTABanners",
      content: {
        admissionsCtaTitle: "Admissions Open for Session 2026-27",
        admissionsCtaSubtitle: "Give your child a nurturing, value-based learning environment across our 8 campuses.",
        partnerCtaTitle: "Start an LFCS Associate School",
        partnerCtaSubtitle: "Partner with our legacy of 40+ years and establish a premier CBSE school in your city.",
      },
      order: 3,
    },
  ];

  for (const s of homeSections) {
    const existing = await prisma.section.findFirst({
      where: { pageId: homePage.id, type: s.type },
    });
    if (existing) {
      await prisma.section.update({ where: { id: existing.id }, data: { content: s.content } });
    } else {
      await prisma.section.create({ data: { pageId: homePage.id, ...s } });
    }
  }
  console.log("✓ Home page sections seeded");

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

