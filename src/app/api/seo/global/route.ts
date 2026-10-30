import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";

export async function GET() {
  try {
    const config = await prisma.globalConfig.findUnique({
      where: { id: "global" },
    });
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch SEO config" },
      { status: 500 },
    );
  }
}

const VALID_GLOBAL_CONFIG_KEYS = new Set([
  "siteTitle",
  "siteDescription",
  "favicon",
  "logo",
  "phone",
  "email",
  "address",
  "facebookUrl",
  "instagramUrl",
  "youtubeUrl",
  "linkedinUrl",
  "googleAnalyticsId",
  "gtmId",
  "searchConsoleId",
  "customHeaderScripts",
  "customFooterScripts",
  "socialLinks",
  "robotsTxt",
  "sitemapEnabled",
  "sitemapCustomContent",
  "schema",
  "headingOptions",
]);

function filterConfigPayload(body: Record<string, any>) {
  const filtered: Record<string, any> = {};
  for (const [key, value] of Object.entries(body)) {
    if (VALID_GLOBAL_CONFIG_KEYS.has(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
}

export async function PUT(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const rawBody = await req.json();
    const cleanData = filterConfigPayload(rawBody);

    const updated = await prisma.globalConfig.upsert({
      where: { id: "global" },
      create: {
        id: "global",
        siteTitle: cleanData.siteTitle || "Little Flower Group of Schools",
        siteDescription: cleanData.siteDescription || "Rooted in Values. Rising with Excellence.",
        ...cleanData,
      },
      update: cleanData,
    });

    revalidateWebsite(WebsiteTag.site);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Save global SEO error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save SEO config" },
      { status: 500 },
    );
  }
}
