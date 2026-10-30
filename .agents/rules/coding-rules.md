# Coding Rules for LFCS School CMS

1. **Framework & Language**: Next.js 16 (App Router) + React 19 + TypeScript.
2. **Form Validation**: Always validate user inputs with friendly notifications via `react-hot-toast`.
3. **Icons**: Use only `lucide-react` icons to match the design system.
4. **Rich Text**: Use `react-quill-new` for long descriptions and chapter narratives.
5. **Database**: Use Prisma Client singleton (`@/lib/prisma`).
6. **Revalidation**: On successful PUT/POST mutations, trigger `revalidateWebsite()` to update frontend cache.
7. **Empty Value Fallbacks (`||` / `??` & `<option>`)**: Always supply an empty value (`""`, `[]`, or `{}`) at logical OR (`||`) and nullish coalescing (`??`) fallback options (e.g., `initialData?.field || ""` or `initialData?.field ?? ""`) rather than hardcoded fallback strings. In dropdown select menus, always include an empty value option (`<option value="">Select...</option>`).
8. **Content Parity, Media & SEO**: Follow `.agents/rules/cms-content-parity.md` whenever building or changing CMS content, editors, seeds, image uploads, or SEO.
9. **Folder Structure & UI**: Follow `.agents/rules/cms-ui-and-structure.md` for folder layout, naming, shared components, editor anatomy and visual style in every CMS.
