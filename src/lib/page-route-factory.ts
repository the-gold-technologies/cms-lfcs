import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { cleanupObsoleteCloudinaryAssets } from "@/lib/cloudinaryCleanup";

export function createPageRouteHandlers(slug: string, defaultTitle: string) {
  return {
    async GET() {
      try {
        const page = await prisma.page.findUnique({
          where: { slug },
          include: {
            sections: { orderBy: { order: "asc" } },
          },
        });

        if (!page) {
          return NextResponse.json({ success: true, data: {}, seo: null });
        }

        const sectionsMap: Record<string, any> = {};
        for (const section of page.sections) {
          sectionsMap[section.type] = section.content;
        }

        return NextResponse.json({
          success: true,
          data: sectionsMap,
          seo: {
            metaTitle: page.metaTitle,
            metaDescription: page.metaDescription,
            targetKeywords: page.targetKeywords,
            canonicalUrl: page.canonicalUrl,
            noIndex: page.noIndex,
          },
        });
      } catch (error) {
        console.error(`Page ${slug} content fetch error:`, error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
      }
    },

    async PUT(req: Request) {
      try {
        const authCheck = await checkAdminSession();
        if (!authCheck.authorized) return authCheck.response;

        const body = await req.json();
        const sectionName = body.section || body.sectionType;
        const content = body.content !== undefined ? body.content : body;

        if (!sectionName || typeof sectionName !== "string") {
          return NextResponse.json(
            { success: false, error: "'section' (string) is required" },
            { status: 400 },
          );
        }

        const page = await prisma.page.upsert({
          where: { slug },
          create: {
            title: defaultTitle,
            slug,
            type: "static",
            visibility: "published",
          },
          update: {},
        });

        const existing = await prisma.section.findFirst({
          where: {
            pageId: page.id,
            type: sectionName,
          },
        });

        if (existing) {
          await prisma.section.update({
            where: { id: existing.id },
            data: { content },
          });
          cleanupObsoleteCloudinaryAssets(existing.content, content).catch(console.error);
        } else {
          const highest = await prisma.section.aggregate({
            where: { pageId: page.id },
            _max: { order: true },
          });
          const order = (highest._max.order ?? -1) + 1;

          await prisma.section.create({
            data: {
              pageId: page.id,
              type: sectionName,
              content,
              order,
            },
          });
        }

        revalidateWebsite(WebsiteTag.page(slug));
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error(`Page ${slug} section save error:`, error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
      }
    },
  };
}
