import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where = category && category !== "All" ? { category } : {};
    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const { src, caption, category } = body;

    if (!src || !caption || !category) {
      return NextResponse.json(
        { success: false, error: "Image source, caption, and category are required" },
        { status: 400 },
      );
    }

    const highest = await prisma.galleryItem.aggregate({ _max: { order: true } });
    const order = (highest._max.order ?? -1) + 1;

    const item = await prisma.galleryItem.create({
      data: {
        src,
        caption,
        category,
        order,
      },
    });

    revalidateWebsite(WebsiteTag.gallery);
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error("Create gallery item error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create gallery item" },
      { status: 500 },
    );
  }
}

