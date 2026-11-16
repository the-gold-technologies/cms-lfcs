-- Rename the "Start a School" page slug from start-school to school-franchise.
-- Image URLs (Cloudinary .../lfcs-school/start-school/...) are intentionally left unchanged.

UPDATE "Page"
SET "slug" = 'school-franchise',
    "canonicalUrl" = REPLACE("canonicalUrl", 'lfgos.com/start-school', 'lfgos.com/school-franchise'),
    "schema" = REPLACE("schema", 'lfgos.com/start-school', 'lfgos.com/school-franchise')
WHERE "slug" = 'start-school';

UPDATE "NavLink"
SET "url" = REPLACE("url", '/start-school', '/school-franchise')
WHERE "url" LIKE '/start-school%';

-- CTA links inside section content, e.g. "ctaLink": "/start-school"
UPDATE "Section"
SET "content" = REPLACE("content"::text, '"/start-school', '"/school-franchise')::jsonb
WHERE "content"::text LIKE '%"/start-school%';

UPDATE "NavLink"
SET "id" = 'nav-school-franchise'
WHERE "id" = 'nav-start-school';
