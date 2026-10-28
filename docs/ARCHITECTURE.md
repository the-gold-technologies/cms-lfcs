# LFCS School CMS — Architecture & Technical Specifications

This document describes the architectural decisions, patterns, and contracts powering **`lfcs-school-cms`**, engineered to mirror the **`kokalachi-cms`** system.

---

## 1. Architectural Principles

1. **Separation of Concerns**:
   - `lfcs-school` is the public-facing high-performance Next.js website.
   - `lfcs-school-cms` is the secure internal editorial dashboard and headless content provider.
2. **Zero-Downtime Resilience**:
   - The public website caches all CMS responses in the Next.js Data Cache using unique tags.
   - If the CMS or PostgreSQL database is ever offline, the website gracefully falls back to local data.
3. **1-to-1 Component Parity**:
   - Every CMS editor under `/static-pages/[page]` directly mirrors the props of its corresponding visual component on the live website. Non-developers can edit copy, banners, and lists with instant feedback.
4. **Automated Asset Optimization**:
   - All uploaded images are automatically compressed into modern WebP format via `sharp` before reaching Cloudinary or local storage.
   - When an image is replaced or removed, obsolete assets are cleaned up to prevent orphaned files.

---

## 2. Technology Stack & Key Libraries

| Role                  | Technology                  | Notes                                                           |
| :-------------------- | :-------------------------- | :-------------------------------------------------------------- |
| **Framework**         | Next.js 16.1.6 (App Router) | Running with `--webpack` for compatibility with binary packages |
| **Language**          | TypeScript 5                | Strict typing across models and API contracts                   |
| **Styling**           | Tailwind CSS v4             | Lightweight styling with modern theme inline tokens             |
| **Database & ORM**    | PostgreSQL + Prisma 6.19    | Uses `@prisma/adapter-pg` and `pg` pool                         |
| **Authentication**    | NextAuth.js v5 (Beta)       | Credentials provider + `bcryptjs` password hashing              |
| **Image Compression** | Sharp 0.35                  | Max 2000px, 82% WebP conversion, auto-rotation                  |
| **Cloud Storage**     | Cloudinary SDK v2           | Direct stream upload with `/public/uploads/` fallback           |
| **Rich Text Editor**  | React Quill New             | Clean formatting for descriptions and policies                  |
| **Notifications**     | React Hot Toast             | User feedback for CRUD and upload actions                       |
| **Icons**             | Lucide React                | Consistent administrative icon library                          |

---

## 3. Database Schema Blueprint (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String
  role          String    @default("admin")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model GlobalConfig {
  id                  String   @id @default("global")
  siteTitle           String   @default("Little Flower Group of Schools")
  siteDescription     String   @default("Rooted in Values. Rising with Excellence.")
  favicon             String?
  logo                String?
  phone               String?  @default("+91 94508 24500")
  email               String?  @default("info@lfgos.com")
  address             String?  @default("Nizamuddinpura, Mau, Uttar Pradesh 275101")
  facebookUrl         String?
  instagramUrl        String?
  youtubeUrl          String?
  linkedinUrl         String?
  googleAnalyticsId   String?
  gtmId               String?
  searchConsoleId     String?
  customHeaderScripts String?
  customFooterScripts String?
  socialLinks         Json?
  robotsTxt           String?  @default("User-agent: *\nAllow: /\n\nSitemap: https://lfgos.com/sitemap.xml")
  sitemapEnabled      Boolean  @default(true)
  schema              String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model Campus {
  id            String   @id @default(cuid())
  name          String
  city          String
  state         String   @default("Uttar Pradesh")
  address       String
  img           String
  website       String?
  instagram     String?
  facebook      String?
  youtube       String?
  phone         String?
  email         String?
  principalName String?
  facilities    Json?    @default("[]")
  isFeatured    Boolean  @default(true)
  order         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model NewsItem {
  id              String   @id @default(cuid())
  title           String
  slug            String?  @unique
  excerpt         String
  date            String   // "DD Mon YYYY"
  img             String
  source          String
  url             String
  content         String?  // Optional rich text body
  isFeaturedHome  Boolean  @default(false)
  order           Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model GalleryItem {
  id        String   @id @default(cuid())
  src       String
  caption   String
  category  String   // "Campus & Facilities", "Classrooms", "Science Labs", "Early Years", "Sports & Fitness", "Arts & Culture", "Events & Achievements"
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Testimonial {
  id          String   @id @default(cuid())
  name        String
  role        String
  text        String
  category    String   // "PARENTS", "TEACHERS", "STUDENTS"
  avatarImage String?
  rating      Int      @default(5)
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AcademicResult {
  id               String   @id @default(cuid())
  year             String   // e.g., "2025-2026"
  examType         String   // "CBSE 10th", "CBSE 12th", "JEE", "NEET"
  studentName      String
  percentageOrRank String   // e.g., "98.4%" or "AIR 412"
  campusName       String
  studentPhoto     String?
  stream           String?  // "Science", "Commerce", "Humanities"
  order            Int      @default(0)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model JobOpening {
  id             String   @id @default(cuid())
  title          String
  category       String   // "Teaching", "Administrative"
  campusLocation String?  // e.g., "Mau", "Ballia", "All Campuses"
  requirements   Json?    @default("[]")
  description    String?
  status         String   @default("Active") // "Active", "Closed"
  order          Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Submission {
  id                 String   @id @default(cuid())
  formType           String   // "admissions", "start-school", "careers", "contact"
  fullName           String
  email              String
  phone              String
  preferredCampus    String?
  grade              String?
  academicSession    String?
  city               String?
  proposedLocation   String?
  landOwnership      String?
  landArea           String?
  schoolLevel        String?
  investmentCapacity String?
  careerArea         String?
  roleOfInterest     String?
  experience         String?
  cvUrl              String?
  enquiryType        String?
  message            String
  status             String   @default("New") // "New", "In Review", "Contacted", "Closed"
  internalNotes      String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Page {
  id              String    @id @default(cuid())
  title           String?
  slug            String    @unique
  type            String    @default("static")
  visibility      String    @default("published")
  metaTitle       String?
  metaDescription String?
  targetKeywords  String?
  canonicalUrl    String?
  noIndex         Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  sections        Section[]
}

model Section {
  id        String   @id @default(cuid())
  pageId    String
  type      String
  content   Json     @default("{}")
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  page      Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
}

model NavLink {
  id          String   @id @default(cuid())
  label       String
  url         String
  type        String   @default("Header") // "Header", "Footer"
  parent      String   @default("-")
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
