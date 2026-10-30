# CMS Folder Structure & UI Rules

> Every new CMS (`<site>-cms`) must follow the **same folder structure, component kit, page anatomy and visual style** as `lfcs-school-cms` / `kokalachi-cms`.
> When in doubt, open the matching file in `lfcs-school-cms` and copy its structure — do not invent a new layout, component or styling approach.
> Content rules (what goes into the CMS) live in `cms-content-parity.md`; this file covers **how it is organised and how it looks**.

---

## 1. Tech Stack (fixed)

Next.js (App Router) + React + TypeScript · Tailwind CSS v4 (`@tailwindcss/postcss`) · Prisma + PostgreSQL (`@prisma/adapter-pg`) · NextAuth v5 (credentials) · Cloudinary + `sharp` · `react-hot-toast` · `react-quill-new` (rich text) · `lucide-react` (only icon set) · `clsx` + `tailwind-merge` · Prettier.

Prettier config (`.prettierrc.json`) — use exactly:

```json
{ "semi": true, "trailingComma": "all", "singleQuote": false, "printWidth": 100, "tabWidth": 2 }
```

Path aliases (`tsconfig.json`): `@/*` → `src/*`, `@/components/*`, `@/lib/*`, `@/static-pages/*` → `src/app/static-pages/*`.

## 2. Folder Structure

```
<site>-cms/
├── .agents/rules/              # coding-rules.md, cms-content-parity.md, cms-ui-and-structure.md
├── AGENTS.md                   # short rules list for AI assistants (points to docs + rules)
├── docs/
│   ├── PLAN_AND_STATUS.md      # roadmap + checklist (keep updated after every module)
│   ├── ARCHITECTURE.md
│   ├── FRONTEND_INTEGRATION.md # how the website reads from the CMS
│   └── CONTENT_INVENTORY.md    # page → section → fields (see content-parity rule)
├── prisma/
│   ├── schema.prisma
│   ├── seed.js                 # idempotent upserts; reads the JSON files below
│   ├── static-pages-seed.json  # { "<page-slug>": { "<SectionType>": { ...content } } }
│   ├── <collection>-seed.json  # one file per collection (campuses, news, gallery, testimonials...)
│   └── uploaded-assets.json    # "/website/public/path.webp" → CDN URL
├── src/
│   ├── auth.ts · auth.config.ts · middleware.ts
│   ├── styles/quill-custom.css
│   ├── lib/
│   │   ├── prisma.ts               # Prisma singleton
│   │   ├── auth-check.ts           # checkAdminSession()
│   │   ├── page-route-factory.ts   # createPageRouteHandlers(slug, title) → GET/PUT for static pages
│   │   ├── revalidateWebsite.ts    # revalidateWebsite(WebsiteTag.x)
│   │   ├── cloudinaryCleanup.ts    # delete media no longer referenced
│   │   └── utils.ts                # cn() etc.
│   ├── components/             # shared UI kit ONLY (see §4) — no page-specific components here
│   └── app/
│       ├── layout.tsx          # session-aware shell: Sidebar + main, Toaster
│       ├── page.tsx            # dashboard
│       ├── login/page.tsx
│       ├── static-pages/<page-slug>/
│       │   ├── page.tsx                    # page editor: fetch once, render section editors
│       │   └── components/
│       │       ├── <SectionName>.tsx       # one editor per website section, SAME NAME as website component
│       │       └── index.ts                # barrel: export { X } from "./X";
│       ├── <collection>/                   # e.g. campuses, news
│       │   ├── page.tsx                    # list/grid view
│       │   ├── create/page.tsx
│       │   ├── edit/[id]/page.tsx
│       │   └── components/<Entity>Form.tsx # shared by create + edit
│       ├── submissions/<form-type>/page.tsx + submissions/components/SubmissionsTable.tsx
│       ├── navigation/menu-links · navigation/social-media
│       ├── seo/global · seo/pages · seo/pages/[...slug] · seo/sitemap-robots
│       ├── settings/profile
│       └── api/
│           ├── <page-slug>/route.ts        # 2 lines: createPageRouteHandlers("<slug>", "<Title>")
│           ├── <collection>/route.ts       # GET list, POST create
│           ├── <collection>/[id]/route.ts  # GET one, PUT, DELETE
│           ├── upload/route.ts · nav-links · seo/* · submissions/* · dashboard/stats
│           └── auth/[...nextauth]/route.ts
```

Naming rules:

- Page slugs in the CMS use kebab-case (`news-and-events`) even if the website route has symbols (`news-&-events`).
- Section editor file name, exported function name, and the DB `Section.type` are **identical** to the website component name (`HeroSection`, `AdmissionClassesSection`). One website section = one editor file = one DB section.
- Named exports for components (`export function HeroSection`), default export only for `page.tsx`.
- Route files (`route.ts`) export **only** HTTP handlers and route config (`dynamic`, etc.). Shared constants go in `src/lib/` — exporting anything else breaks `next build`.
- New shared UI pieces go in `src/components/`; anything used by one page stays in that page's `components/` folder.

## 3. App Shell & Navigation

- `layout.tsx`: if logged in → `<div className="flex h-screen overflow-hidden font-sans p-[5px]">` with `<AdminSidebar />` and `<main className="flex-1 overflow-y-auto custom-scrollbar"><div className="px-10 py-8">`; if not → bare children (login). Body `bg-[#f8f9fa]`. `Toaster` top-right, 4 s, 13 px, 12 px radius, green success / red error styles.
- Fonts via `next/font/google`: Inter (`--font-inter`, UI) + the website's display serif (`--font-playfair` or equivalent).
- Sidebar (`components/Sidebar.tsx`): 280 px, navy background (`bg-[#0a192f]`), `rounded-l-[2.5rem]`, accordion groups defined in a `sidebarLinks` array (`title`, `icon`, `href` or `sublinks`). Active sublink = brand primary background. Groups in this order:
  1. Dashboard · 2. Navigation & Links (Menu Links, Social Media & Footer) · 3. collections (Campuses/Products/...) · 4. **Pages** (one link per website page, in website nav order) · 5. other collections (News, Results...) · 6. Submissions (one per form type) · 7. SEO Management (Global, Page Settings, Sitemap & Robots) · 8. Settings.
- Every website page must have a Sidebar link under **Pages** and an entry in `PageStructure.tsx`.

## 4. Shared UI Kit (always reuse — never hand-roll an equivalent)

| Component                                                          | Use for                                                                                                                               |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `PageHeader`                                                       | Top of every screen: `title`, `description`, `badge`, optional `action` / `deleteAction`                                              |
| `SectionHeader`                                                    | Collapsible header of each section editor: `title` ("N. Name (purpose)"), `description`, `badge="Live Section"`, `isOpen`, `onToggle` |
| `InputField`                                                       | Single-line text, links, numbers, passwords (`label`, `placeholder`, `helperText`, `tooltip`)                                         |
| `TextAreaField`                                                    | Multi-line text; paragraphs separated by a blank line                                                                                 |
| Rich text (`react-quill-new`)                                      | Long articles/narratives only                                                                                                         |
| `ImagePickerField`                                                 | Every image field (upload → sharp/WebP → CDN, or URL); `multiple` for galleries; full width                                           |
| `StringListEditor`                                                 | Simple string lists (tags, chips, filter tabs, highlight labels)                                                                      |
| `CollapsibleCard`                                                  | Each item in a repeater (numbered badge, thumbnail, title, subtitle, delete, expand)                                                  |
| `SaveButton`                                                       | One per section, full width, `loading` / `saved` states                                                                               |
| `DeleteConfirmModal`                                               | Any destructive action                                                                                                                |
| `PageStructure`, `OverviewStats`, `RecentEnquiries`, `AdminHeader` | Dashboard                                                                                                                             |
| `FormIntroSection`                                                 | Intro/thank-you copy for website enquiry forms & pop-ups                                                                              |
| `CategoryManager`                                                  | Dynamic categories for collections                                                                                                    |

If a needed control doesn't exist, add it to `src/components/` in the same visual style and list it here.

## 5. Page Editor Anatomy (`static-pages/<slug>/page.tsx`)

```tsx
"use client";
export default function HomePageEditor() {
  const [pageData, setPageData] = useState<any>(null);
  useEffect(() => {
    /* fetch("/api/<slug>") → setPageData(json.data) */
  }, []);
  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="<Page> Page Sections"
        description="Manage the N live sections ..."
        badge="<Page type>"
      />
      <HeroSection initialData={pageData?.HeroSection} />
      {/* ...every section, in the SAME ORDER as the website page */}
    </section>
  );
}
```

- Fetch once per page; pass `initialData={pageData?.<SectionType>}` to each editor.
- Section order and numbering ("1.", "2.", ...) must match the website's render order.
- The PageHeader description states the live section count — keep it accurate.

## 6. Section Editor Anatomy (`static-pages/<slug>/components/<SectionName>.tsx`)

Follow this skeleton exactly:

```tsx
"use client";
// imports: React, toast, lucide icons, SectionHeader, InputField, TextAreaField, ImagePickerField,
//          CollapsibleCard, StringListEditor, SaveButton (only what is used)

interface CardItem {
  title: string;
  desc: string;
  image: string;
} // one interface per repeater

export function XSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState(""); // one useState per field, "" / [] defaults
  const [cards, setCards] = useState<CardItem[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    // load EVERY key, `?? ""` / `?? []`
    if (initialData) {
      setTagline(initialData.tagline ?? ""); /* map arrays field-by-field */
    }
  }, [initialData]);

  // handleAdd / handleRemove (also fix openIndices) / handleUpdate(index, field, value)

  const handleSave = async () => {
    // save EVERY key
    setLoading(true);
    try {
      const res = await fetch("/api/<slug>", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "XSection", content: { tagline, cards } }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("X section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else toast.error(json.error || "Failed to save section");
    } catch (err: any) {
      toast.error(err?.message || "Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title="N. X Section (purpose)"
        description="..."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="space-y-6 pt-2">
          {/* 1. heading row  2. text  3. buttons  4. repeaters  5. save */}
          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
```

Field layout order inside a section (top → bottom):

1. **Heading row** — `grid grid-cols-1 sm:grid-cols-3 gap-4`: Tagline / Headline / Script Accent (add Headline Suffix below if the site has one).
2. **Narrative** — `TextAreaField` (subtitle / description).
3. **Buttons** — `grid grid-cols-1 md:grid-cols-2 gap-4`: CTA Label / CTA Link.
4. **Main image(s)** — full-width `ImagePickerField`.
5. **Repeaters** — `border-t border-gray-100 pt-5 space-y-4` block with:
   - header row: uppercase `text-xs font-bold tracking-wider text-gray-700` title with `(count)`, gray helper line, **Collapse All / Expand All** text button, and burgundy pill **Add** button (`text-[#842b46] bg-[#842b46]/10 hover:bg-[#842b46]/20 px-3.5 py-1.5 rounded-xl`, `Plus` icon);
   - dashed empty state (`border-dashed bg-gray-50/70`, click to add);
   - items as `CollapsibleCard` in a `space-y-3` stack.
6. **Save** — full-width `SaveButton` under a top border.

Card / item layout rules:

- **Full-width vertical stacks.** No 2-column card grids. Inside a card: Row 1 Title (+ short paired field like Grades/Role in a 2-col grid), Row 2 Description, Row 3 Link, Row 4 Image (full width).
- `ImagePickerField` is always full width; when an image exists it shows the preview with **Replace** + clear, not the dropzone (except `multiple`).
- Data managed elsewhere (campuses, toppers, gallery, submissions) gets an info banner with a link button instead of duplicate fields: `p-4 bg-rose-50/50 border border-rose-100 rounded-2xl` + icon tile + "Manage X →" button.
- Select menus: `w-full text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:border-[#842b46] focus:ring-1 focus:ring-[#842b46]`, label `text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide`, always with an empty `<option value="">Select...</option>`.
- Placeholders start with `e.g.` and are **descriptive, never identical to the seeded value**.
- Toasts on every save/delete/error; no `alert()`.

## 7. Collection Modules (list / create / edit)

- `<collection>/page.tsx`: `flex flex-col gap-6 max-w-7xl mx-auto`, `PageHeader` with Add button, loading text, empty state card (`bg-white rounded-3xl border border-gray-100`) with "Add First X", then a card grid with thumbnail, key info, Edit/Delete (Delete → `DeleteConfirmModal`).
- `create/page.tsx` and `edit/[id]/page.tsx`: "← Back to X" link (`ArrowLeft`, `text-xs font-semibold text-gray-500`), `PageHeader`, then the shared `<Entity>Form` (edit passes the loaded record).
- API: `GET`/`POST` on the collection route, `GET`/`PUT`/`DELETE` on `[id]`; every mutation calls `checkAdminSession()` first, then `revalidateWebsite(WebsiteTag.<collection>)`, and cleans up removed media.

## 8. Visual Language

Define brand tokens in `globals.css` `@theme inline` (values come from the website's palette):

```css
--color-primary: <brand primary>; /* LFCS: #842b46 burgundy */
--color-primary-hover: <darker>; /* LFCS: #6a2238 */
--color-gold: <accent>; /* LFCS: #dfae19 */
--color-navy: <dark>; /* LFCS: #0a192f (sidebar) */
--font-sans: var(--font-inter);
--font-serif: var(--font-<display-font>);
```

| Element                    | Style                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Page background            | `#f8f9fa`                                                                                                                        |
| Section card               | `bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100`                                                                        |
| Inner card / repeater item | `rounded-2xl border border-gray-200` (`CollapsibleCard`)                                                                         |
| Badges                     | `rounded-full bg-rose-50 text-[primary] text-[11px] font-bold`                                                                   |
| Primary action (header)    | dark pill `bg-[#0B0F29] rounded-full` with primary glow on hover                                                                 |
| Save button                | full width, `bg-[primary] rounded-xl py-3.5`, green when saved                                                                   |
| Inputs                     | `rounded-2xl border-gray-200 py-3.5`, primary focus ring; labels `text-[11px] font-bold uppercase tracking-widest text-gray-400` |
| Section spacing            | page `gap-8`, section body `space-y-6`, field grids `gap-4`, repeater stack `space-y-3`                                          |
| Icons                      | `lucide-react` only, `w-3.5 h-3.5` in small buttons, `w-5 h-5` in tiles                                                          |

Do not introduce other UI libraries, CSS modules, inline style objects for layout, or new colour schemes.

## 9. Docs & Agent Files

- `AGENTS.md`: short numbered rules for assistants (read docs first, keep status updated, sharp optimisation, component parity, empty fallbacks) + pointer to `.agents/rules/`.
- `docs/PLAN_AND_STATUS.md`: phased checklist; tick items when a module/section is done.
- `docs/FRONTEND_INTEGRATION.md`: env vars, `cmsGet`/`cmsPost` client, revalidation endpoint, submission forwarding.
- Update these whenever pages, sections, collections or schema change.

## 10. New CMS Checklist (structure & UI)

- [ ] Folder tree matches §2; aliases and Prettier config copied.
- [ ] Shell, Sidebar group order and toaster match §3; every website page linked under **Pages**.
- [ ] Shared kit from `src/components/` reused; no ad-hoc inputs, cards or buttons.
- [ ] One editor per website section, same name as the website component, same order and numbering.
- [ ] Each editor follows the §6 skeleton and field order; repeaters use `CollapsibleCard` + Expand/Collapse All + Add pill + dashed empty state.
- [ ] Collections follow list / create / edit + shared Form (§7).
- [ ] Brand tokens set from the website palette; visual styles per §8.
- [ ] `route.ts` files export only handlers; `npm run build` passes.
- [ ] Docs and `AGENTS.md` updated.
