# CMS Content Parity, Media & SEO Rules

> Applies to every CMS built for an existing website (`<site>` = the public website repo, `<site>-cms` = the CMS repo).
> Goal: **every piece of content a visitor can see on the website must exist in the CMS, verbatim, and be editable without loss.**
> A CMS task is NOT finished until the parity check in §7 passes with zero gaps.

---

## 1. Build a Complete Content Inventory First (before writing any editor)

Walk the website **page by page, section by section**, in render order (read each `app/**/page.tsx` and every component it renders). For each section, list every one of these that appears:

| Category          | Examples that are easy to miss                                                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Headings          | tagline / eyebrow, headline, **script/accent word**, text **after** the accent word                                                                                                    |
| Body text         | every paragraph (count them), notes, disclaimers, `* Note:` lines, footnotes under buttons                                                                                             |
| Lists             | bullet points, chips, feature labels next to icons, tab/filter labels, FAQ Q&A                                                                                                         |
| Cards / repeaters | every field per card: title, subtitle, description, grades/badges, role, quote, link, image, alt                                                                                       |
| Buttons & links   | label **and** href for every CTA, "Read More / Read Note" links, anchor links (`#section`)                                                                                             |
| Images            | every `src` (hero, background, overlay, card, gallery, thumbnails, decorative-but-content) and its `alt`                                                                               |
| Stats / numbers   | stat values + labels, ribbons/badges ("School Topper"), table/block titles, exam/session lines                                                                                         |
| Data files        | `*Data.ts`, constant arrays at the top of components, **arrays imported from another component** (one array can feed two pages)                                                        |
| Global chrome     | header nav, dropdown item descriptions & thumbnails, action buttons, **footer link columns**, footer contact info, social links, copyright, logo(s), favicon                           |
| Forms & modals    | pop-up/modal forms, form intro text, contact email shown in the form, submit label, **thank-you/success message**, select options that are business data (classes, sessions, campuses) |
| Metadata          | `layout.tsx` / `generateMetadata` titles & descriptions, OG images, per-page metadata                                                                                                  |

Rules:

- Record the inventory in `docs/CONTENT_INVENTORY.md` (page → section → fields). The CMS schema is derived from this, not from guesses.
- Check every component file under `components/` — note components that exist but are **not rendered** anywhere (do not model them, but list them).
- If the same data array is imported by two sections (e.g. stages used by Academics and Admissions), the CMS must store it once or keep both copies identical — record the dependency.

## 2. Copy Content Verbatim — Never Invent, Summarise or "Improve"

- Seed data must be **copied character-for-character** from the website source: same wording, punctuation, en/em dashes (`–` vs `—`), curly vs straight apostrophes, `&` vs `and`, capitalisation, brackets.
- Decode JSX entities when copying (`&apos;` → `'`, `&amp;` → `&`, `&ldquo;` → `"`).
- **Never write placeholder or "better" copy** into seed data. If the CMS needs a field the website doesn't show, seed it as `""` — never with made-up text.
- **Never truncate.** Long letters/messages/bios must contain every paragraph. Count paragraphs on the website and in the seed; the numbers must match.
- Roles, designations and labels must match what the website displays (e.g. if the site shows "Actor", don't seed "Actor & Supporter").
- URLs must be copied in full, including query strings (don't shorten tracking/search URLs unless the user asks).
- Images: use the exact image the website uses for that slot (uploaded to the CMS media store — see §5), not a "similar" image.

## 3. Model Headings and Rich Text So They Can Round-Trip

- Split headings exactly the way the website renders them:
  - `tagline` (eyebrow), `headline` (text before the accent), `scriptAccent` (styled word), `headlineSuffix` (text after the accent).
  - If the accent comes **first**, document the order in the field helper text and seed accordingly.
  - Plain words between a `<br />` and the accent belong in `headline`.
- Multi-paragraph text: one textarea, paragraphs separated by a blank line (`\n\n`), rendered with `.split(/\n\s*\n/)`.
- Repeaters (cards, stats, FAQs, photos, footer columns) are **arrays of objects**, never flat numbered keys (`stat1Value`, `card2Title`).
- Every repeater item gets every field the website card shows (title, desc, image, link, category, badge...).

## 4. Editors Must Load and Save Every Key (no silent data loss)

CMS editors typically map `initialData` into local state and rebuild `content` in `handleSave`. Any key not handled there is **deleted on the next save**.

For every section editor:

1. Every key present in the seed for that section is read in `useEffect` (`initialData.key ?? ""` / `?? []`).
2. Every such key is written back in `handleSave`'s `content` object.
3. Every array item's mapper copies **all** item fields (including `image`, `link`, `category`).
4. Adding a new field = update **seed + editor load + editor save + editor UI** in the same change.
5. Run the key-coverage check in §7.2 after any editor/seed change.

Global content (header, footer, social, contact) follows the same rule on its settings page — e.g. footer link columns stored in global config must be loaded, edited and saved there.

## 5. Image Upload, Optimisation & Compression

**Pipeline (upload API):**

- Accept only `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/gif`, `image/svg+xml` (+ `application/pdf` for documents). Reject anything else with a clear toast.
- Max upload size 15 MB; reject larger files before processing.
- Process every raster image through `sharp` before storing:
  - `.rotate()` (respect EXIF orientation), then **strip metadata** (sharp drops EXIF by default — don't call `.withMetadata()`).
  - Downscale so neither side exceeds **2000 px** (`fit: "inside", withoutEnlargement: true`).
  - Convert to **WebP, quality 80–82** (`effort: 4`); keep animated GIFs animated (`animated: true`) or leave as-is.
  - **Never** upload the original uncompressed buffer.
- SVGs: pass through unmodified (no rasterising); sanitise or restrict to trusted admins.
- Return original size, compressed size and savings % so the admin sees the effect.
- Store under a per-site folder (`<site-slug>/<page>/<name>_<timestamp>.webp`) with a readable, slugified base name.
- Fallback to `/public/uploads/` only when cloud credentials are missing (dev only).

**Cleanup:**

- When a section/record is saved, diff old vs new content and delete media that is no longer referenced (scan nested objects/arrays for media URLs). Never delete media still referenced elsewhere.

**Seeding images from the website:**

- Upload every image in the website's `public/` that the inventory references, through the same sharp pipeline.
- Keep a mapping file `prisma/uploaded-assets.json` (`"/local/path.webp": "https://cdn/.../file.webp"`) and resolve seed image URLs **from this map** — never hand-type CDN URLs.
- Before finishing, assert that every image path in the inventory has a mapping (missing = upload it).
- Also upload small variants the site uses (e.g. `/thumbs/`) or document that the full image is reused.

**Delivery (website side):**

- Serve via `next/image` (or the CDN's `f_auto,q_auto` transforms) with correct `sizes`; set `width`/`height` or `fill` to avoid layout shift.
- Hero/LCP image: `priority`; everything else lazy.
- Every content image needs a CMS-editable `alt` text field (decorative images: `alt=""`).

## 6. SEO Requirements

**Per page (Page model / SEO editor), seeded from the website's current metadata:**

- `metaTitle` (≈ 50–60 chars), `metaDescription` (≈ 140–160 chars), `targetKeywords`, `canonicalUrl` (absolute), `noIndex`.
- Open Graph: `ogTitle`, `ogDescription`, `ogImage` (1200×630, uploaded via §5); Twitter card falls back to OG.
- `schema` (JSON-LD) per page where relevant: `Organization`/`EducationalOrganization`/`LocalBusiness` on home & contact, `FAQPage` on FAQ sections, `NewsArticle` for news, `BreadcrumbList` for nested pages. Validate it's parseable JSON before saving.
- One `<h1>` per page; the CMS heading option must not allow a second `h1`.
- Every page that exists on the website must have an SEO record — list website routes and assert none are missing.

**Global (GlobalConfig):**

- Site title, default description, logo, favicon (+ apple-touch icon), default OG image.
- Analytics: GA4 ID, GTM ID, Search Console verification; custom head/footer scripts.
- `robots.txt` content and sitemap toggle; sitemap includes every published static page **and** dynamic records (news, campuses, etc.) with `lastModified` from `updatedAt`.
- Organization contact details (phone, email, address) and social profile URLs (used for JSON-LD `sameAs`).

**Website integration:**

- Each page uses `generateMetadata` reading CMS SEO fields, with the current hard-coded metadata as fallback.
- CMS saves revalidate the relevant website cache tags so SEO changes go live without a redeploy.

## 7. Mandatory Verification Before Saying "Done"

### 7.1 Website ↔ CMS parity diff

Write (or reuse) a script that:

1. Parses every rendered website component with the TypeScript compiler API and extracts all JSX text and content-like string literals (skip `className`, `style`, SVG attributes, keys).
2. Dumps all CMS section content from the database (not just the seed file).
3. Compares page by page and prints every website string/image/link **not found** in the CMS for that page, and every CMS value that differs from the website.

Fix until the only remaining items are pure UI chrome (e.g. "Sending...", "Close", aria labels) — and list those explicitly in the report.

### 7.2 Editor key coverage

For each section in the seed, parse the editor's `handleSave` `content` keys and assert every seed key is saved. Any missing key = data loss bug.

### 7.3 Database vs seed

Diff database section content against the seed **by value** (JSON key order differs in Postgres — compare parsed objects, not strings). If the DB has edits the seed doesn't, stop and ask before overwriting.

### 7.4 Build

`npm run build` must pass. Route files (`app/**/route.ts`) may only export HTTP handlers and route config — move shared constants to `src/lib/`.

### 7.5 Report

Finish with a short per-page table: section → fields added/fixed, plus any intentional differences (stored statically, reused images, fields left empty) so the user can review them.

## 8. Seeding & Database Safety

- Seeds are idempotent upserts keyed on stable identifiers (`pageId+type`, slug, name).
- The seed must **not** silently reset credentials. Applying content changes to an existing DB → use a targeted script that only updates content tables; never re-run a seed that resets the admin password without asking.
- Schema changes: additive and nullable (`String?`) where possible; run `prisma db push`/migrate and report what changed. Never drop columns or tables without explicit approval.
- Keep `docs/PLAN_AND_STATUS.md` updated with what was added.

## 9. Quick Checklist (copy into the PR / final message)

- [ ] Inventory covers every page, section, header, footer, modal form and metadata.
- [ ] All copy verbatim; no invented, shortened or paraphrased text; paragraph counts match.
- [ ] Headings split into tagline / headline / scriptAccent / headlineSuffix as rendered.
- [ ] Every image uploaded through sharp (WebP, ≤ 2000 px, metadata stripped) and mapped; alt text editable.
- [ ] Every editor loads and saves every key (§7.2 passes).
- [ ] Per-page + global SEO seeded from the website; JSON-LD valid; sitemap/robots configured.
- [ ] Parity diff (§7.1) shows zero content gaps; DB matches seed (§7.3).
- [ ] `npm run build` passes.
