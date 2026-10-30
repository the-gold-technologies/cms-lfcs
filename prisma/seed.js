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

const FOOTER_COLUMNS = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", url: "/about" },
      { label: "Academics", url: "/academics" },
      { label: "Experience", url: "/experience" },
      { label: "Our Schools", url: "/our-school" },
      { label: "Admissions", url: "/admissions" },
      { label: "News & Events", url: "/news-&-events" },
      { label: "Start a School", url: "/start-school" },
      { label: "Careers", url: "/careers" },
      { label: "Contact Us", url: "/contact" },
    ],
  },
  {
    title: "Admissions",
    links: [
      { label: "Why Choose Us", url: "/about#our-story" },
      { label: "Curriculum", url: "/academics#curriculum" },
      { label: "Teaching Approach", url: "/academics#approach" },
      { label: "Our Faculty", url: "/academics#faculty" },
      { label: "Life at LFCS", url: "/experience#life-at-lfcs" },
      { label: "Our Campuses", url: "/our-school#schools" },
      { label: "Enquire Now", url: "/contact#contact-form" },
    ],
  },
  {
    title: "Start A School",
    links: [
      { label: "Why Partner With Us", url: "/start-school#why-partner" },
      { label: "Our School Model", url: "/start-school#model" },
      { label: "Support & Benefits", url: "/start-school#support" },
      { label: "Requirements", url: "/start-school#requirements" },
      { label: "Setup Process", url: "/start-school#process" },
      { label: "Investment Overview", url: "/start-school#investment" },
      { label: "FAQs", url: "/start-school#faqs" },
    ],
  },
];

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

  const GLOBAL_SCHEMA = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": "https://lfgos.com/#organization",
      name: "Little Flower Group of Schools",
      alternateName: "LFCS",
      url: "https://lfgos.com/",
      logo: "https://res.cloudinary.com/dpa93copz/image/upload/v1793170044/lfcs-school/logo-header_1793170044344.webp",
      description:
        "A network of premier CBSE schools across Uttar Pradesh committed to academic excellence, value-based character building, and holistic student growth.",
      foundingDate: "1993",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Nizamuddinpura",
        addressLocality: "Mau",
        addressRegion: "Uttar Pradesh",
        postalCode: "275101",
        addressCountry: "IN",
      },
      telephone: "+91 83688 38489",
      email: "franchise@lfcsschools.com",
      sameAs: [
        "https://www.facebook.com/people/LFCS-Schools/61594935059542/",
        "https://www.instagram.com/lfcs_schools/",
        "https://youtube.com/@lfcsschools?si=TCzIAvIrbwgYA2KY",
      ],
    },
    null,
    2,
  );

  const ROBOTS_DIRECTIVES = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://lfgos.com/sitemap.xml`;

  // 2. Global Brand Configuration with Cloudinary URLs & SEO Directives
  await prisma.globalConfig.upsert({
    where: { id: "global" },
    update: {
      siteTitle: "Little Flower Group of Schools",
      siteDescription:
        "A network of CBSE schools committed to academic excellence, character building and holistic development.",
      logo: "https://res.cloudinary.com/dpa93copz/image/upload/v1793170044/lfcs-school/logo-header_1793170044344.webp",
      favicon:
        "https://res.cloudinary.com/dpa93copz/image/upload/v1793170045/lfcs-school/logo1_1793170045264.webp",
      phone: "+91 83688 38489",
      email: "franchise@lfcsschools.com",
      address: "Lucknow, Uttar Pradesh",
      facebookUrl: "https://www.facebook.com/people/LFCS-Schools/61594935059542/",
      instagramUrl: "https://www.instagram.com/lfcs_schools/",
      youtubeUrl: "https://youtube.com/@lfcsschools?si=TCzIAvIrbwgYA2KY",
      socialLinks: {
        footerLogo:
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170045/lfcs-school/logo1_1793170045264.webp",
        brandTitle: "Little Flower",
        brandSubtitle: "Group of Schools",
        phone2: "+91 99999 76959",
        operatingHours: "Mon - Sat: 8:00 AM - 5:00 PM",
        copyrightText: "© 2026 Little Flower Group of Schools. All rights reserved.",
        whatsapp: "+91 94508 24500",
        twitter: "",
        footerColumns: FOOTER_COLUMNS,
      },
      robotsTxt: ROBOTS_DIRECTIVES,
      sitemapEnabled: true,
      headingOptions: "h1",
      schema: GLOBAL_SCHEMA,
    },
    create: {
      id: "global",
      siteTitle: "Little Flower Group of Schools",
      siteDescription:
        "A network of CBSE schools committed to academic excellence, character building and holistic development.",
      logo: "https://res.cloudinary.com/dpa93copz/image/upload/v1793170044/lfcs-school/logo-header_1793170044344.webp",
      favicon:
        "https://res.cloudinary.com/dpa93copz/image/upload/v1793170045/lfcs-school/logo1_1793170045264.webp",
      phone: "+91 83688 38489",
      email: "franchise@lfcsschools.com",
      address: "Lucknow, Uttar Pradesh",
      facebookUrl: "https://www.facebook.com/people/LFCS-Schools/61594935059542/",
      instagramUrl: "https://www.instagram.com/lfcs_schools/",
      youtubeUrl: "https://youtube.com/@lfcsschools?si=TCzIAvIrbwgYA2KY",
      socialLinks: {
        footerLogo:
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170045/lfcs-school/logo1_1793170045264.webp",
        brandTitle: "Little Flower",
        brandSubtitle: "Group of Schools",
        phone2: "+91 99999 76959",
        operatingHours: "Mon - Sat: 8:00 AM - 5:00 PM",
        copyrightText: "© 2026 Little Flower Group of Schools. All rights reserved.",
        whatsapp: "+91 94508 24500",
        twitter: "",
        footerColumns: FOOTER_COLUMNS,
      },
      robotsTxt: ROBOTS_DIRECTIVES,
      sitemapEnabled: true,
      headingOptions: "h1",
      schema: GLOBAL_SCHEMA,
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

  // 8. Seed All Static Pages and Modular Sections with Complete SEO & Schema JSON-LD
  const PAGE_SEO_DATA = {
    home: {
      title: "Home",
      type: "Main Page",
      metaTitle: "Little Flower Group of Schools | Rooted in Values. Rising with Excellence.",
      metaDescription:
        "A premier network of CBSE-affiliated schools across Uttar Pradesh committed to academic excellence, value-based character building, and holistic student growth.",
      targetKeywords:
        "Little Flower schools, CBSE schools UP, best schools in Mau, Little Flower Group of Schools, LFCS, top school Uttar Pradesh",
      canonicalUrl: "https://lfgos.com/",
      headingOptions: "h1",
      schema: GLOBAL_SCHEMA,
    },
    about: {
      title: "About Us",
      type: "Main Page",
      metaTitle: "About Us | Little Flower Group of Schools",
      metaDescription:
        "Discover our 35+ year educational heritage, founding vision since 1993, dedicated leadership team, and foundational core values.",
      targetKeywords:
        "about Little Flower, LFCS history, school leadership, CBSE curriculum UP, school values, Vijay Shankar Yadav",
      canonicalUrl: "https://lfgos.com/about",
      headingOptions: "h1",
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Us | Little Flower Group of Schools",
          url: "https://lfgos.com/about",
          description:
            "Discover our 35+ year educational heritage, founding vision since 1993, dedicated leadership team, and foundational core values.",
          publisher: {
            "@type": "EducationalOrganization",
            name: "Little Flower Group of Schools",
            url: "https://lfgos.com",
          },
        },
        null,
        2,
      ),
    },
    academics: {
      title: "Academics",
      type: "Main Page",
      metaTitle: "Academics & CBSE Curriculum | Little Flower Group of Schools",
      metaDescription:
        "At LFCS, academics forms the foundation of every student's journey. Explore our structured CBSE curriculum, experiential pedagogy, and developmental learning stages.",
      targetKeywords:
        "LFCS academics, CBSE curriculum, board exam results, school stages, experiential learning, STEM education UP",
      canonicalUrl: "https://lfgos.com/academics",
      headingOptions: "h1",
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Academics & CBSE Curriculum | Little Flower Group of Schools",
          url: "https://lfgos.com/academics",
          description:
            "At LFCS, academics forms the foundation of every student's journey with a structured CBSE curriculum and experiential pedagogy.",
          publisher: {
            "@type": "EducationalOrganization",
            name: "Little Flower Group of Schools",
            url: "https://lfgos.com",
          },
        },
        null,
        2,
      ),
    },
    admissions: {
      title: "Admissions",
      type: "Main Page",
      metaTitle: "Admissions 2026-2027 | Little Flower Group of Schools",
      metaDescription:
        "Admissions at Little Flower Group of Schools. Explore learning stages, fee guidelines, and submit an online admission enquiry for your preferred campus.",
      targetKeywords:
        "school admission UP, CBSE school admission Mau, LFCS registration, admission enquiry, school admissions 2026-27",
      canonicalUrl: "https://lfgos.com/admissions",
      headingOptions: "h1",
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Admissions 2026-2027 | Little Flower Group of Schools",
          url: "https://lfgos.com/admissions",
          description:
            "Admissions guidelines, learning stages, and enquiry form for Little Flower Group of Schools campuses across Uttar Pradesh.",
          publisher: {
            "@type": "EducationalOrganization",
            name: "Little Flower Group of Schools",
            url: "https://lfgos.com",
          },
        },
        null,
        2,
      ),
    },
    "our-school": {
      title: "Our Schools & Campuses",
      type: "Main Page",
      metaTitle: "Our Schools & Campuses | Little Flower Group of Schools",
      metaDescription:
        "A place to learn, grow, and lead. Explore our network of school campuses and world-class educational facilities across Uttar Pradesh.",
      targetKeywords:
        "LFCS campuses, Little Flower Mau, LFCS Sikatia, LFCS Ballia, LFCS Ghosi, LFCS Ghazipur, CBSE schools eastern UP",
      canonicalUrl: "https://lfgos.com/our-school",
      headingOptions: "h1",
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Our Schools & Campuses | Little Flower Group of Schools",
          url: "https://lfgos.com/our-school",
          description:
            "Explore our network of school campuses and world-class educational facilities across Uttar Pradesh.",
          publisher: {
            "@type": "EducationalOrganization",
            name: "Little Flower Group of Schools",
            url: "https://lfgos.com",
          },
        },
        null,
        2,
      ),
    },
    experience: {
      title: "Student Experience",
      type: "Main Page",
      metaTitle: "Student Experience & Campus Life | Little Flower Group of Schools",
      metaDescription:
        "Life at LFCS is beyond textbooks and classrooms. Explore sports, creative arts, leadership opportunities, and vibrant campus life for our students.",
      targetKeywords:
        "life at LFCS, school sports, extracurricular activities, creative arts, clubs, student leadership",
      canonicalUrl: "https://lfgos.com/experience",
      headingOptions: "h1",
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Student Experience & Campus Life | Little Flower Group of Schools",
          url: "https://lfgos.com/experience",
          description:
            "Life at LFCS is beyond textbooks: sports, creative arts, excursions, leadership houses, and holistic child development.",
          publisher: {
            "@type": "EducationalOrganization",
            name: "Little Flower Group of Schools",
            url: "https://lfgos.com",
          },
        },
        null,
        2,
      ),
    },
    "start-school": {
      title: "Start an Associate School",
      type: "Associate Partner",
      metaTitle: "Start a School | Associate Partnership | LFCS",
      metaDescription:
        "Partner with Little Flower Group of Schools to establish and operate a high-performing CBSE associate school in your community.",
      targetKeywords:
        "school franchise India, start a CBSE school, educational partnership, LFCS associate affiliate, school franchise UP",
      canonicalUrl: "https://lfgos.com/start-school",
      headingOptions: "h1",
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Start a School | Associate Partnership | LFCS",
          url: "https://lfgos.com/start-school",
          description:
            "Partner with Little Flower Group of Schools to establish and operate a high-performing associate school in your community.",
          publisher: {
            "@type": "EducationalOrganization",
            name: "Little Flower Group of Schools",
            url: "https://lfgos.com",
          },
        },
        null,
        2,
      ),
    },
    careers: {
      title: "Careers & Opportunities",
      type: "Main Page",
      metaTitle: "Careers & Faculty Recruitment | Little Flower Group of Schools",
      metaDescription:
        "Build your career with Little Flower Group of Schools. Explore teaching and administrative opportunities and submit your profile today.",
      targetKeywords:
        "teaching jobs UP, school teacher vacancies, LFCS careers, education jobs, faculty recruitment, PGT TGT PRT jobs",
      canonicalUrl: "https://lfgos.com/careers",
      headingOptions: "h1",
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Careers & Faculty Recruitment | Little Flower Group of Schools",
          url: "https://lfgos.com/careers",
          description:
            "Build your career with Little Flower Group of Schools. Explore teaching and administrative opportunities.",
          publisher: {
            "@type": "EducationalOrganization",
            name: "Little Flower Group of Schools",
            url: "https://lfgos.com",
          },
        },
        null,
        2,
      ),
    },
    "news-and-events": {
      title: "News & Events",
      type: "Media & Press",
      metaTitle: "News & Events | Little Flower Group of Schools",
      metaDescription:
        "Latest news, press releases, circulars, and announcements from Little Flower Group of Schools campuses across Uttar Pradesh.",
      targetKeywords:
        "school news, annual day, LFCS announcements, school events, press release, CBSE circulars",
      canonicalUrl: "https://lfgos.com/news-&-events",
      headingOptions: "h1",
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "News & Events | Little Flower Group of Schools",
          url: "https://lfgos.com/news-&-events",
          description:
            "Latest news, press releases, circulars, and announcements from Little Flower Group of Schools campuses across Uttar Pradesh.",
          publisher: {
            "@type": "EducationalOrganization",
            name: "Little Flower Group of Schools",
            url: "https://lfgos.com",
          },
        },
        null,
        2,
      ),
    },
    gallery: {
      title: "Photo Gallery",
      type: "Media & Press",
      metaTitle: "Photo Gallery | Little Flower Group of Schools",
      metaDescription:
        "Photos from Little Flower campuses: classrooms, modern science labs, early childhood playrooms, sports grounds, arts, culture, and school events.",
      targetKeywords:
        "school photos, campus pictures, science exhibition, sports day gallery, Little Flower pictures, LFCS gallery",
      canonicalUrl: "https://lfgos.com/gallery",
      headingOptions: "h1",
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: "Photo Gallery | Little Flower Group of Schools",
          url: "https://lfgos.com/gallery",
          description:
            "Photos from Little Flower campuses: classrooms, modern science labs, early childhood playrooms, sports grounds, arts, culture, and school events.",
          publisher: {
            "@type": "EducationalOrganization",
            name: "Little Flower Group of Schools",
            url: "https://lfgos.com",
          },
        },
        null,
        2,
      ),
    },
    contact: {
      title: "Contact Us",
      type: "Main Page",
      metaTitle: "Contact Us | Little Flower Group of Schools",
      metaDescription:
        "Get in touch with Little Flower Group of Schools for admissions, academic enquiries, associate school partnerships, or general assistance.",
      targetKeywords:
        "contact LFCS, school helpline phone, admission inquiry email, campus addresses, office hours Mau Lucknow",
      canonicalUrl: "https://lfgos.com/contact",
      headingOptions: "h1",
      schema: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Us | Little Flower Group of Schools",
          url: "https://lfgos.com/contact",
          description:
            "Get in touch with Little Flower Group of Schools for admissions, academic enquiries, associate school partnerships, or general assistance.",
          publisher: {
            "@type": "EducationalOrganization",
            name: "Little Flower Group of Schools",
            url: "https://lfgos.com",
          },
        },
        null,
        2,
      ),
    },
  };

  const staticPagesFile = path.resolve(__dirname, "static-pages-seed.json");
  const staticPages = fs.existsSync(staticPagesFile)
    ? JSON.parse(fs.readFileSync(staticPagesFile, "utf-8"))
    : {};

  for (const [slug, pageSeo] of Object.entries(PAGE_SEO_DATA)) {
    const page = await prisma.page.upsert({
      where: { slug },
      create: {
        title: pageSeo.title,
        slug,
        type: pageSeo.type || "static",
        visibility: "published",
        isStatic: true,
        metaTitle: pageSeo.metaTitle,
        metaDescription: pageSeo.metaDescription,
        targetKeywords: pageSeo.targetKeywords,
        canonicalUrl: pageSeo.canonicalUrl,
        headingOptions: pageSeo.headingOptions || "h1",
        schema: pageSeo.schema,
      },
      update: {
        title: pageSeo.title,
        type: pageSeo.type || "static",
        isStatic: true,
        metaTitle: pageSeo.metaTitle,
        metaDescription: pageSeo.metaDescription,
        targetKeywords: pageSeo.targetKeywords,
        canonicalUrl: pageSeo.canonicalUrl,
        headingOptions: pageSeo.headingOptions || "h1",
        schema: pageSeo.schema,
      },
    });

    const sections = staticPages[slug];
    if (sections) {
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
    }

    console.log(
      `✓ Page "${pageSeo.title}" (${slug}) seeded with full SEO, Schema JSON-LD and ${
        sections ? Object.keys(sections).length : 0
      } modular sections`,
    );
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

  // 10. Navigation Menu Links
  const navLinksDefault = [
    {
      id: "nav-about",
      label: "About Us",
      url: "/about",
      type: "Main Link",
      parent: "-",
      order: 1,
    },
    {
      id: "nav-academics",
      label: "Academics",
      url: "/academics",
      type: "Dropdown",
      parent: "-",
      order: 2,
    },
    {
      id: "nav-academics-curriculum",
      label: "Academics",
      url: "/academics",
      type: "Dropdown Item",
      parent: "nav-academics",
      order: 1,
    },
    {
      id: "nav-academics-experience",
      label: "Experience",
      url: "/experience",
      type: "Dropdown Item",
      parent: "nav-academics",
      order: 2,
    },
    {
      id: "nav-academics-news",
      label: "News & Events",
      url: "/news-&-events",
      type: "Dropdown Item",
      parent: "nav-academics",
      order: 3,
    },
    {
      id: "nav-admissions",
      label: "Admissions",
      url: "/admissions",
      type: "Main Link",
      parent: "-",
      order: 3,
    },
    {
      id: "nav-our-schools",
      label: "Our Schools",
      url: "/our-school",
      type: "Dropdown",
      parent: "-",
      order: 4,
    },
    {
      id: "nav-school-mau",
      label: "LFCS, MAU",
      url: "https://lfgos.com/",
      type: "Dropdown Item",
      parent: "nav-our-schools",
      order: 1,
    },
    {
      id: "nav-school-sikatiya",
      label: "LFCS, SIKATIYA",
      url: "https://lfcsmau.co/",
      type: "Dropdown Item",
      parent: "nav-our-schools",
      order: 2,
    },
    {
      id: "nav-school-ghosi",
      label: "LFCS, GHOSI",
      url: "https://www.lfcsghosi.co.in/",
      type: "Dropdown Item",
      parent: "nav-our-schools",
      order: 3,
    },
    {
      id: "nav-school-ballia",
      label: "LFCS, BALLIA",
      url: "https://lfcsballia.co.in/",
      type: "Dropdown Item",
      parent: "nav-our-schools",
      order: 4,
    },
    {
      id: "nav-school-kasimabad",
      label: "LFCS, KASIMABAD GHAZIPUR",
      url: "https://www.lfcskasimabad.in/",
      type: "Dropdown Item",
      parent: "nav-our-schools",
      order: 5,
    },
    {
      id: "nav-school-azamgarh",
      label: "LFCS, AZAMGARH",
      url: "https://lfcsazamgarh.org.in/",
      type: "Dropdown Item",
      parent: "nav-our-schools",
      order: 6,
    },
    {
      id: "nav-school-lfis-mau",
      label: "LFIS, KHALISHPUR MAU",
      url: "https://lfismau.co.in/",
      type: "Dropdown Item",
      parent: "nav-our-schools",
      order: 7,
    },
    {
      id: "nav-school-azadhind",
      label: "AZAD HIND INTER COLLEGE, KHALISHPUR MAU",
      url: "https://www.facebook.com/azadhindcollege/",
      type: "Dropdown Item",
      parent: "nav-our-schools",
      order: 8,
    },
    {
      id: "nav-contact",
      label: "Contact Us",
      url: "/contact",
      type: "Main Link",
      parent: "-",
      order: 5,
    },
    {
      id: "nav-start-school",
      label: "Start a School",
      url: "/start-school",
      type: "Action Button",
      parent: "-",
      order: 6,
    },
  ];

  await prisma.navLink.deleteMany();
  for (const item of navLinksDefault) {
    await prisma.navLink.create({
      data: {
        id: item.id,
        label: item.label,
        url: item.url,
        type: item.type,
        parent: item.parent,
        order: item.order,
      },
    });
  }
  console.log(`✓ ${navLinksDefault.length} Header Navigation Menu Links seeded`);

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
