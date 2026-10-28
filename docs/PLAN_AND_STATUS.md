# LFCS School CMS — Roadmap, Plan & Status Tracker

> **Notice for Future AI Agents & Developers:**
> This document tracks the implementation plan, active tasks, and completed deliverables for **Little Flower Group of Schools CMS (`lfcs-school-cms`)**.
>
> This CMS is architected following the exact patterns, component architecture, and data contracts proven in **`kokalachi-cms`**.
> Read this document first to understand current progress, architectural decisions, and next steps before modifying or adding code.

---

## 📌 Project Overview

- **CMS Project Directory**: `/Users/sudeeshkumar/Desktop/TGT COMPANY/lfcs-school-cms`
- **Public Website Directory**: `/Users/sudeeshkumar/Desktop/TGT COMPANY/lfcs-school`
- **Default CMS Port**: `http://localhost:3001`
- **Default Website Port**: `http://localhost:3000`
- **Tech Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Prisma ORM, PostgreSQL, NextAuth.js v5 (Auth.js Beta), Sharp (WebP compression), Cloudinary SDK, React Hot Toast, React Quill New, Nodemailer.
- **Database**: Local PostgreSQL (`postgresql://sudeeshkumar@localhost:5432/lfcs_school_cms`)
- **Cloud Storage**: Cloudinary (Folder: `lfcs-school`, Cloud Name: `dpa93copz`)
- **SMTP Server**: Zoho SMTP (`smtppro.zoho.in:465`)

---

## 🧭 Master Implementation Status

### ✅ Phase 1: Scaffolding, Architecture & Configuration (COMPLETED)

- [x] Initialized Next.js 16 project structure with App Router.
- [x] Configured `package.json` with identical dependencies to `kokalachi-cms` (`next-auth@5.0.0-beta.30`, `@prisma/adapter-pg`, `pg`, `sharp`, `cloudinary`, `react-hot-toast`, `react-quill-new`, `clsx`, `tailwind-merge`).
- [x] Created `tsconfig.json` with `@/*`, `@/components/*`, `@/lib/*`, `@/static-pages/*` path aliases.
- [x] Configured `next.config.ts` (remote image patterns, security headers, 15MB upload limit).
- [x] Configured Tailwind CSS v4 (`postcss.config.mjs`, `@tailwindcss/postcss`, `src/app/globals.css`).
- [x] Configured `.env` with local pgAdmin DB, Cloudinary credentials, Zoho SMTP, and unique `CMS_SHARED_SECRET`.
- [x] Built thorough documentation suite (`docs/PLAN_AND_STATUS.md`, `docs/ARCHITECTURE.md`, `docs/FRONTEND_INTEGRATION.md`, `AGENTS.md`, `.agents/rules/coding-rules.md`).

### ✅ Phase 2: Database Schema & Complete Data Seeding (COMPLETED)

- [x] Created `prisma/schema.prisma` with:
  - `User`: Admin authentication (`email`, `password`, `name`, `role`).
  - `GlobalConfig`: Brand config, Logo, Favicon, Phones, Emails, Socials, GTM, GA4, Robots, Sitemap.
  - `Campus`: 8 LFCS campuses with address, website, social handles, principal, order, facilities.
  - `NewsItem`: Press releases, media coverage, date, source, external link, home feature toggle.
  - `CoverageOutlet`: 20+ news outlets that featured LFCS.
  - `GalleryItem`: 7 categories (`Campus & Facilities`, `Classrooms`, `Science Labs`, `Early Years`, `Sports & Fitness`, `Arts & Culture`, `Events & Achievements`).
  - `Testimonial`: Categorized by `PARENTS`, `TEACHERS`, `STUDENTS` with ratings and roles.
  - `AcademicResult`: Board exam toppers, JEE/NEET ranks, student photo, percentage, year.
  - `JobOpening`: Teaching & Administrative openings with requirements.
  - `Submission`: Unified leads (Admissions, Franchise, Careers with CV url, General enquiries).
  - `Page` & `Section`: Flexible 1-to-1 static section content matching the public site.
  - `NavLink`: Dynamic navigation items for Header and Footer.
- [x] Created separate seed JSON datasets with 100% live website data:
  - `prisma/campuses-seed.json` (All 8 campuses with live Cloudinary URLs).
  - `prisma/news-seed.json` (6 press articles with live Cloudinary URLs).
  - `prisma/gallery-seed.json` (34 photos categorized across all 7 departments).
  - `prisma/testimonials-seed.json` (9 testimonials across Students, Teachers, Parents).
  - `prisma/static-pages-seed.json` (Home and About sections with Cloudinary banners).
- [x] Uploaded 47 local images from `lfcs-school/public` to Cloudinary folder `lfcs-school`.
- [x] Synchronized PostgreSQL database `lfcs_school_cms` via `prisma db push`.
- [x] Executed `node prisma/seed.js` — Database fully seeded and ready.

### ✅ Phase 3: Media Pipeline & File Management (COMPLETED)

- [x] Implemented `src/app/api/upload/route.ts`:
  - `sharp` converts images into WebP format with 82% quality and auto-rotation.
  - Auto-downscales large images exceeding 2000px width/height.
  - Streams directly to Cloudinary folder `lfcs-school`; falls back to `/public/uploads/` if credentials are unset.
  - Calculates and returns KB savings and compression ratio.
- [x] Implemented obsolete asset cleanup in `src/lib/cloudinaryCleanup.ts` (`cleanupObsoleteCloudinaryAssets`).
- [x] Implemented reusable `ImagePickerField.tsx` with drag-and-drop file upload, WebP compression, preview, and URL input.

### ✅ Phase 4: Core UI & Dashboard Components (COMPLETED)

- [x] Reusable component kit:
  - `src/components/InputField.tsx`: Floating labels, password toggle, tooltips.
  - `src/components/TextAreaField.tsx`: Multi-line inputs with helper text.
  - `src/components/SectionHeader.tsx`: Collapsible accordion headers.
  - `src/components/PageHeader.tsx`: Titles, descriptions, and action buttons.
  - `src/components/SaveButton.tsx`: Animated saving, saved, and loading states.
  - `src/components/StringListEditor.tsx`: Tag/list manager for arrays of strings.
  - `src/components/DeleteConfirmModal.tsx`: Accessible dialog for destructive actions.
  - `src/components/Sidebar.tsx`: Accordion-style navigation menu matching Kokalachi CMS.
  - `src/components/AdminHeader.tsx`: Welcome banner with external link to live site.
- [x] NextAuth v5 credentials authentication:
  - `src/auth.config.ts`, `src/auth.ts`, `src/middleware.ts`.
  - Login page at `src/app/login/page.tsx`.
- [x] Dashboard Home at `src/app/page.tsx` with live metric cards and recent leads feed.
- [x] Dashboard Stats API at `src/app/api/dashboard/stats/route.ts`.

### ✅ Phase 5: Domain Modules & Static Page Editors (COMPLETED)

- [x] **Campuses Module**:
  - `src/app/api/campuses/route.ts` & `src/app/api/campuses/[id]/route.ts`.
  - `src/app/campuses/page.tsx` (Grid view with address, website, and actions).
  - `src/app/campuses/create/page.tsx` & `src/app/campuses/edit/[id]/page.tsx`.
  - `src/app/campuses/components/CampusForm.tsx` (Clean descriptive placeholders).
- [x] **News & Press Module**:
  - `src/app/api/news/route.ts` & `src/app/api/news/[id]/route.ts`.
  - `src/app/news/page.tsx` (Card grid with date, source, and home featured badge).
  - `src/app/news/create/page.tsx` & `src/app/news/edit/[id]/page.tsx`.
  - `src/app/news/components/NewsForm.tsx` (Clean descriptive placeholders).
- [x] **Photo Gallery Module**:
  - `src/app/api/gallery/route.ts` & `src/app/api/gallery/[id]/route.ts`.
  - `src/app/gallery/page.tsx` (Filter tabs for all 7 categories + upload modal).
- [x] **Submissions Inbox & Lead Ingestion**:
  - `src/app/api/submissions/route.ts` & `src/app/api/submissions/[id]/route.ts`.
  - Submissions Table: `src/app/submissions/components/SubmissionsTable.tsx`.
  - `/submissions/admissions`: Parent inquiries.
  - `/submissions/start-school`: Franchise/Partner proposals.
  - `/submissions/careers`: Job candidate profiles with CV download.
  - `/submissions/contact`: General inquiries.
  - Asynchronous SMTP alerts dispatched via Nodemailer.
- [x] **Static Pages (1-to-1 Component Parity Across All 9 Pages)**:
  - Route handlers & factory: `src/lib/page-route-factory.ts` with Cloudinary asset cleanup and tag revalidation.
  - Dedicated API endpoints: `/api/home`, `/api/about`, `/api/academics`, `/api/admissions`, `/api/experience`, `/api/start-school`, `/api/careers`, `/api/contact`, `/api/gallery-page`.
  - All 9 modular component editors built under `src/app/static-pages/[page]/components/`:
    1. **Home** (8 sections: Hero, Welcome, Note of Support, How We Educate, Our Approach, Experience, Our Schools, CTA Banners).
    2. **About Us** (9 sections: About Hero, Founding Story, Vision & Mission, Educational Approach, Core Values, Leadership, Growth, Awards, About CTA).
    3. **Academics** (8 sections: Hero, Curriculum, Journey, Teaching & Learning, Faculty, Results, Facilities, CTA).
    4. **Admissions** (3 sections: Hero, Overview, Classes & Entry Points).
    5. **Student Experience** (7 sections: Hero, Life at LFCS, Sports & Fitness, Arts & Culture, Clubs, Gallery Preview, CTA).
    6. **Start a School** (9 sections: Hero, Why Partner, School Model, Support Provided, Partner Requirements, Setup Process, Investment, FAQs, Final CTA).
    7. **Careers** (5 sections: Hero, Why Work With Us, Work Culture, Opportunities, Final CTA).
    8. **Contact Us** (3 sections: Hero, Contact Form Info, Campus Directory).
  - All 9 pages and their modular sections fully seeded into PostgreSQL (`prisma/static-pages-seed.json` & `prisma/seed.js`).
  - Added "Photo Gallery" under `Pages` in `Sidebar.tsx` and in `PageStructure.tsx`.

### ✅ Phase 5: UI & Structural Polish (COMPLETED)

- [x] **Full-width `ImagePickerField`**:
  - In single image mode: when an image exists, displays ONLY the preview card with a prominent **`Replace`** CTA button (and clear `X`). Does NOT render the dashed dropzone simultaneously.
  - When no image exists, displays the dashed drag-and-drop dropzone (or direct URL input if toggled).
  - Both dropzone and image list display simultaneously ONLY when `multiple={true}`.
  - Takes 100% full width (`w-full`) across all forms.
- [x] **Vertical 3-Row Card Architecture**:
  - All cards with Title, Description, and Image are structured vertically across full-width rows:
    - **Row 1**: Title
    - **Row 2**: Description
    - **Row 3**: Image (full-width via `ImagePickerField`)
  - No side-by-side cramped 2-column layouts inside cards.
- [x] **Full-width 1-Column Card Stacks Across All Modules**:
  - Replaced all 2-column card layouts (`grid grid-cols-2` or `sm:grid-cols-2`) with clean full-width vertical stacks (`space-y-4`), matching `kokalachi-cms`.
  - Every card/pillar has: Row 1: Title & Grades/Designation, Row 2: Description/Quote, Row 3: Image (full width with single-state Replace CTA).
  - Cleaned up `EducationalApproachSection` (Approach Pillars), `AdmissionClassesSection`, `WhyWorkWithUsSection`, `NoteOfSupportSection`, `CTABanners`, and `ExperienceSection`.
- [x] **Elimination of Duplicate Flat Seed Data & Clean Array Schema**:
  - Cleaned up `prisma/static-pages-seed.json` across all sections, removing duplicate flat numbered keys (`stat1Value`, `stat1Label`, `pillar1Title`, `feature1Title`, `m1Year`, etc.) and storing strictly clean dynamic arrays (`stats: [...]`, `pillars: [...]`, `cards: [...]`, `milestones: [...]`, etc.).
  - Updated component `handleSave` routines across all static-page editors to save only clean array objects without re-injecting flat duplicate keys.
  - Added `@@unique([pageId, type])` to `model Section` in `prisma/schema.prisma` preventing duplicate section creation.
  - Fixed duplicate `main()` invocation in `prisma/seed.js` and cleaned PostgreSQL database to exactly 53 unique sections.
- [x] **Single Narrative Textarea with White Line Breaks**:
  - Replaced separate "Part 1" and "Part 2" textareas in narrative sections (`OurStorySection`, `AdmissionOverviewSection`) with a single textarea where paragraphs are separated by hitting Enter twice (`\n\n`), rendered via `.split(/\n\s*\n/)` to mirror Kokalachi website architecture.
- [x] **Single Photo Gallery Navigation**:
  - Removed duplicate top-level Photo Gallery link in `Sidebar.tsx`; `Photo Gallery` is cleanly organized under the **Pages** dropdown (`/static-pages/gallery`).
- [x] **Full-Width Save Buttons**:
  - All `SaveButton` wrappers throughout the CMS use `w-full` inside `<div className="pt-4 border-t border-gray-100 w-full">`, removing restrictive `sm:w-64` / `max-w-xs` containers.
- [x] **Build Verification**:
  - `npm run build` passes with **0 errors** across all **46 App Router routes**.
  - Clean descriptive placeholders used across all inputs (never identical to values).
  - Core components styled to 100% Kokalachi parity (`PageHeader`, `SectionHeader`, `InputField`, `TextAreaField`, `SaveButton`, `OverviewStats`, `PageStructure`).

---

## 🔄 Next Steps / Remaining Roadmap

### Phase 6: Frontend Integration (`lfcs-school`) _(Paused per user request - to be connected later)_

1. Create `src/lib/cms.ts` and `src/lib/content.ts` in `lfcs-school` (ready for when connection is enabled).
2. Add `/api/revalidate/route.ts` to `lfcs-school` using the dedicated `CMS_SHARED_SECRET`.
3. Connect form server actions in `src/app/actions/enquiries.ts` to forward submissions to `POST /api/submissions` in the CMS.
4. Connect frontend sections (campuses, news, gallery, testimonials, static pages) to read from CMS data with fallback to existing local files.

---

## 🛠️ How to Run & Verify the CMS

```bash
cd "/Users/sudeeshkumar/Desktop/TGT COMPANY/lfcs-school-cms"
npm run seed     # Seeds database with admin + website data
npm run dev      # Runs CMS on http://localhost:3001
```

- **Default Admin Credentials**:
  - **Email**: `admin@lfcs.edu.in`
  - **Password**: `Admin@123`
