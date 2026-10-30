import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await prisma.globalConfig.findFirst({ where: { id: "global" } });
  let body = (
    config?.robotsTxt ||
    `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://lfgos.com/sitemap.xml`
  ).trim();

  return new Response(body + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
