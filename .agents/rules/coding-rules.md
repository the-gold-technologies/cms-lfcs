# Coding Rules for LFCS School CMS

1. **Framework & Language**: Next.js 16 (App Router) + React 19 + TypeScript.
2. **Form Validation**: Always validate user inputs with friendly notifications via `react-hot-toast`.
3. **Icons**: Use only `lucide-react` icons to match the design system.
4. **Rich Text**: Use `react-quill-new` for long descriptions and chapter narratives.
5. **Database**: Use Prisma Client singleton (`@/lib/prisma`).
6. **Revalidation**: On successful PUT/POST mutations, trigger `revalidateWebsite()` to update frontend cache.

