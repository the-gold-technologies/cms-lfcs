import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await prisma.globalConfig.findFirst({ where: { id: "global" } });
  if (config && config.sitemapEnabled === false) {
    return new Response("", { status: 404 });
  }

  const pages = await prisma.page.findMany({
    where: {
      noIndex: false,
      visibility: "published",
    },
  });

  const baseUrl = "https://lfgos.com";
  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Always include Root / Home
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  for (const page of pages) {
    if (page.slug === "home") continue;
    const pathSlug = page.slug === "news-and-events" ? "news-&-events" : page.slug;
    const loc = (page.canonicalUrl || `${baseUrl}/${pathSlug}`).replace(/&/g, "&amp;");
    const priority = page.slug === "admissions" || page.slug === "our-school" ? "0.9" : "0.8";
    const changefreq = page.slug === "news-and-events" ? "weekly" : "monthly";

    xml += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
