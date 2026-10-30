import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string | string[] }> },
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = Array.isArray(rawSlug) ? rawSlug.join("/") : rawSlug;

    const page = await prisma.page.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        targetKeywords: true,
        canonicalUrl: true,
        noIndex: true,
        featuredImage: true,
        ogTitle: true,
        ogDescription: true,
        ogImage: true,
        schema: true,
        headingOptions: true,
      },
    });

    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error: any) {
    console.error("Error fetching page SEO data:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string | string[] }> },
) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const { slug: rawSlug } = await params;
    const slug = Array.isArray(rawSlug) ? rawSlug.join("/") : rawSlug;

    const body = await request.json();
    const { seo } = body;

    if (!seo) {
      return NextResponse.json({ success: false, error: "SEO data is required" }, { status: 400 });
    }

    const updatedPage = await prisma.page.upsert({
      where: { slug },
      update: {
        metaTitle: seo.metaTitle || null,
        metaDescription: seo.metaDescription || null,
        targetKeywords: seo.targetKeywords || null,
        canonicalUrl: seo.canonicalUrl || null,
        noIndex: Boolean(seo.noIndex),
        featuredImage: seo.featuredImage || null,
        ogTitle: seo.ogTitle || null,
        ogDescription: seo.ogDescription || null,
        ogImage: seo.ogImage || null,
        headingOptions: seo.headingOptions || "h1",
        schema: seo.schema || null,
      },
      create: {
        slug,
        title: seo.metaTitle || slug.charAt(0).toUpperCase() + slug.slice(1),
        metaTitle: seo.metaTitle || null,
        metaDescription: seo.metaDescription || null,
        targetKeywords: seo.targetKeywords || null,
        canonicalUrl: seo.canonicalUrl || null,
        noIndex: Boolean(seo.noIndex),
        featuredImage: seo.featuredImage || null,
        ogTitle: seo.ogTitle || null,
        ogDescription: seo.ogDescription || null,
        ogImage: seo.ogImage || null,
        headingOptions: seo.headingOptions || "h1",
        visibility: "published",
        schema: seo.schema || null,
      },
    });

    revalidateWebsite(WebsiteTag.page(slug));
    return NextResponse.json({ success: true, data: updatedPage });
  } catch (error: any) {
    console.error("Error updating page SEO:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
