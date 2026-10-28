import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { deleteCloudinaryAsset } from "@/lib/cloudinaryCleanup";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await prisma.newsItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ success: false, error: "News item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch news item" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.newsItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "News item not found" }, { status: 404 });
    }

    if (body.img && existing.img && body.img !== existing.img) {
      deleteCloudinaryAsset(existing.img).catch(console.error);
    }

    const updated = await prisma.newsItem.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        excerpt: body.excerpt ?? existing.excerpt,
        date: body.date ?? existing.date,
        img: body.img ?? existing.img,
        source: body.source ?? existing.source,
        url: body.url ?? existing.url,
        content: body.content !== undefined ? body.content : existing.content,
        isFeaturedHome:
          body.isFeaturedHome !== undefined ? body.isFeaturedHome : existing.isFeaturedHome,
        order: body.order !== undefined ? body.order : existing.order,
      },
    });

    revalidateWebsite(WebsiteTag.news, WebsiteTag.page("home"));
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Update news error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update news item" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const existing = await prisma.newsItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "News item not found" }, { status: 404 });
    }

    if (existing.img) {
      deleteCloudinaryAsset(existing.img).catch(console.error);
    }

    await prisma.newsItem.delete({ where: { id } });

    revalidateWebsite(WebsiteTag.news, WebsiteTag.page("home"));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete news error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete news item" },
      { status: 500 },
    );
  }
}
