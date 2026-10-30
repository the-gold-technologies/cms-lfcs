import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "pages") {
      const pages = await prisma.page.findMany({
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json({ success: true, data: pages });
    }

    const config = await prisma.globalConfig.findFirst({ where: { id: "global" } });
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    console.error("Error fetching SEO config:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const body = await request.json();

    if (type === "pages") {
      const { slug, ...seoData } = body;
      if (!slug) {
        return NextResponse.json({ success: false, error: "slug is required" }, { status: 400 });
      }
      const updated = await prisma.page.upsert({
        where: { slug },
        create: {
          slug,
          title:
            seoData.title ||
            slug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
          ...seoData,
        },
        update: seoData,
      });
      revalidateWebsite(WebsiteTag.page(slug));
      return NextResponse.json({ success: true, data: updated });
    }

    const updatedConfig = await prisma.globalConfig.upsert({
      where: { id: "global" },
      create: {
        id: "global",
        siteTitle: body.siteTitle || "Little Flower Group of Schools",
        siteDescription: body.siteDescription || "Rooted in Values. Rising with Excellence.",
        ...body,
      },
      update: body,
    });

    // Also sync home page headingOptions and metaTitle/metaDescription if passed
    if (body.headingOptions || body.siteTitle || body.siteDescription) {
      await prisma.page.upsert({
        where: { slug: "home" },
        update: {
          metaTitle: body.siteTitle || undefined,
          metaDescription: body.siteDescription || undefined,
          headingOptions: body.headingOptions || undefined,
        },
        create: {
          slug: "home",
          title: "Home",
          metaTitle: body.siteTitle || "Little Flower Group of Schools",
          metaDescription: body.siteDescription || "Rooted in Values. Rising with Excellence.",
          headingOptions: body.headingOptions || "h1",
          visibility: "published",
        },
      });
    }

    revalidateWebsite(WebsiteTag.site, WebsiteTag.page("home"));
    return NextResponse.json({ success: true, data: updatedConfig });
  } catch (error: any) {
    console.error("Error saving global SEO:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
