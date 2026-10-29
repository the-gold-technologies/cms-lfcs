# LFCS School CMS

A high-performance, resilient administrative Content Management System (CMS) and headless content API powering the **Little Flower Group of Schools** web ecosystem. Built with Next.js 16 (App Router), React 19, TypeScript, PostgreSQL, and Prisma ORM.

---

## 🌟 Key Features

### 1. Modular Static Page Editors (1-to-1 Component Parity)

Manage copy, narratives, media, and structural blocks across all 9 public institutional pages:

- **Home**: Hero banner, Welcome section, How We Educate pillars, Life Skills & Approach, Campus Showcase, Experience highlights, Testimonials preview, News carousel, and CTA banners.
- **About Us**: Founding story & 30-year legacy, Vision & Mission, Educational Approach, Core Values, Leadership & Founder profiles, Growth timeline, and Honours & Awards.
- **Academics**: Academic Journey & stages, CBSE Curriculum overview, Modern Teaching Methodologies, Facilities, Faculty highlights, and Academic Results summary.
- **Admissions**: Admission guidelines, multi-stage Selection Pillars, Class eligibility table, Fee structure notes, and Enquiry CTA.
- **Experience**: Life at LFCS, Sports & Athletics, Clubs & Co-curricular activities, Arts & Culture galleries, and Annual events.
- **Photo Gallery**: Dynamic campus photo album manager with dynamic category filtering and high-resolution Cloudinary previews.
- **News & Events**: Press releases, newspaper features, circulars, and event announcements with home-feature toggling.
- **Our Schools**: Group campus directory, branch listings, facilities checklist, and regional map information.
- **Start a School**: School affiliation model, Partnership advantages, Turnkey support systems, Infrastructure requirements, Investment framework, Setup roadmap, and FAQs.

### 2. Dynamic Categories & Records Management

- **Category Manager**: Filter, add, rename, and delete custom categories for Gallery photos, Board Results, and Testimonials via a dedicated modal manager without disrupting active filters.
- **Board Results & Toppers**: Record Class 10th and 12th board toppers, competitive entrance ranks (JEE, NEET), percentages, campus affiliations, and student photos.
- **Campus Directory**: Manage school branches with addresses, principal profiles, contact numbers, official emails, social media handles, and campus facilities.
- **Testimonials & Community Reviews**: Verify and publish feedback from parents, students, alumni, and faculty members.

### 3. Admissions & Lead Inquiries

- Centralized inbox for incoming admission inquiries, franchise / start-a-school proposals, career applications, and general contact forms.
- Real-time status management (`New`, `In Review`, `Contacted`, `Closed`) with internal administrative notes.

### 4. Automated Image Optimization & Cloud Storage

- Seamless drag-and-drop file upload powered by **Sharp** image processing.
- Automatic conversion to WebP format, auto-rotation correction, and smart downscaling (max 2000px width/height).
- Cloudinary cloud storage integration with automatic rollback and local `/public/uploads` fallback.

### 5. On-Demand Cache Revalidation

- Immediate cache updates on the public website via secure revalidation webhooks (`revalidateWebsite()`) upon any CMS mutation.

---

## 🛠️ Technology Stack

| Layer              | Technology                     | Details                                         |
| :----------------- | :----------------------------- | :---------------------------------------------- |
| **Framework**      | Next.js 16.1.6 (App Router)    | High-performance server/client architecture     |
| **Language**       | TypeScript 5                   | End-to-end type safety                          |
| **Styling**        | Tailwind CSS v4                | Utility-first responsive design                 |
| **Database**       | PostgreSQL                     | Robust relational storage                       |
| **ORM**            | Prisma 6.19                    | Schema management with `@prisma/adapter-pg`     |
| **Authentication** | NextAuth.js v5 (Beta)          | Session management & bcryptjs password security |
| **Media Engine**   | Sharp 0.35 + Cloudinary        | WebP compression & cloud asset streaming        |
| **Rich Text**      | React Quill New                | Visual narrative formatting                     |
| **UI Components**  | Lucide React + React Hot Toast | Modern icons & toast notifications              |

---

## 📁 Project Directory Structure

```text
lfcs-school-cms/
├── prisma/
│   ├── schema.prisma           # Prisma database schema definition
│   ├── seed.js                 # Database seeding script (53 unique sections + defaults)
│   ├── static-pages-seed.json  # Clean modular section payloads for all pages
│   ├── campuses-seed.json      # Initial campus branches
│   ├── results-seed.json       # Initial academic toppers
│   └── testimonials-seed.json  # Initial testimonials
├── public/
│   └── uploads/                # Local asset fallback storage
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & authentication routes
│   │   ├── api/                # REST endpoints (categories, news, campuses, upload, etc.)
│   │   ├── campuses/           # Campus branch management
│   │   ├── gallery/            # Standalone photo gallery management
│   │   ├── navigation/         # Social media & global links
│   │   ├── news/               # Press releases & news articles
│   │   ├── results/            # Board toppers & competitive exam ranks
│   │   ├── seo/                # Global SEO and metadata manager
│   │   ├── static-pages/       # Modular editors for all 9 public website pages
│   │   ├── submissions/        # Admissions, contact, and franchise lead tables
│   │   ├── testimonials/       # Reviews & testimonials manager
│   │   ├── layout.tsx          # Main admin shell & navigation
│   │   └── page.tsx            # Analytics dashboard
│   ├── components/             # Reusable UI components (CategoryManager, ImagePickerField, etc.)
│   ├── lib/                    # Shared utilities (prisma client, auth check, image compression)
│   └── styles/                 # Custom component stylesheets
├── docs/                       # Architectural documentation & plans
├── .env.example                # Sanitized environment variable template
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+)
- **Database**: PostgreSQL (v14+) database instance (local or hosted via Supabase, Neon, AWS RDS, etc.)

---

### Step 1: Clone & Install Dependencies

```bash
git clone https://github.com/your-organization/lfcs-school-cms.git
cd lfcs-school-cms
npm install
```

---

### Step 2: Environment Configuration

Create a local `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure your environment variables in `.env` using your preferred database and service credentials:

```env
# -------------------------------------------------------------
# Database Configuration (PostgreSQL)
# -------------------------------------------------------------
DATABASE_URL="postgresql://username:password@localhost:5432/lfcs_cms?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/lfcs_cms?schema=public"

# -------------------------------------------------------------
# NextAuth / Session Security
# -------------------------------------------------------------
AUTH_SECRET="generate-a-secure-32-byte-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ALLOWED_ORIGIN="http://localhost:3000"

# -------------------------------------------------------------
# Public School Website Integration
# -------------------------------------------------------------
NEXT_PUBLIC_WEBSITE_URL="http://localhost:3001"
CMS_SHARED_SECRET="generate-a-secure-random-revalidation-secret"

# -------------------------------------------------------------
# Cloudinary Image Storage (Optional - falls back to local /public/uploads)
# -------------------------------------------------------------
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
CLOUDINARY_FOLDER="lfcs-school"

# -------------------------------------------------------------
# SMTP Email Notifications (Optional for lead alerts)
# -------------------------------------------------------------
SMTP_HOST="smtp.mailprovider.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="notifications@yourdomain.com"
SMTP_PASS="your_email_password"
SMTP_FROM="Little Flower Group of Schools <notifications@yourdomain.com>"
ADMIN_NOTIFICATION_EMAIL="admissions@yourdomain.com"
```

> **Note**: Never commit `.env` or any production secrets to source control.

---

### Step 3: Database Setup & Seeding

1. **Push Prisma Schema to Database**:

   ```bash
   npx prisma db push
   ```

2. **Generate Prisma Client**:

   ```bash
   npx prisma generate
   ```

3. **Seed Initial Database Content**:
   ```bash
   npm run seed
   ```
   _The seed script populates default administrator credentials, default campus branches, academic toppers, sample testimonials, and all 53 unique modular page sections._

---

### Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Default Admin Account**:
  - Email: `admin@lfcscms.com`
  - Password: Set during initial seed execution (can be updated under **Settings > Profile**).

---

## 📜 Available NPM Scripts

| Script          | Purpose                                                               |
| :-------------- | :-------------------------------------------------------------------- |
| `npm run dev`   | Starts the Next.js development server with Webpack                    |
| `npm run build` | Generates the Prisma client and creates an optimized production build |
| `npm run start` | Boots the Next.js production server                                   |
| `npm run seed`  | Seeds the database with default records and static section templates  |
| `npm run lint`  | Runs Next.js ESLint checks                                            |

---

## 🔒 Security & Best Practices

1. **Password Encryption**: All administrator passwords are salted and hashed with `bcryptjs` before storage.
2. **Session Guards**: Administrative routes and mutation APIs are guarded via `checkAdminSession()` middleware.
3. **Resilient Static Fallback**: The public school website maintains zero-downtime static fallbacks; if the CMS database is unreachable, the public website continues serving cached or local static content.
4. **Cloudinary Stream Cleanup**: Image uploads are piped through Sharp compression in-memory before upload, preventing uncompressed buffers or bloated payloads.

---

## 📄 License

This software is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited. All rights reserved by **Little Flower Group of Schools**.
