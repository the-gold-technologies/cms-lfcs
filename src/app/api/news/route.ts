import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";

export async function GET() {
  try {
    const news = await prisma.newsItem.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const { title, excerpt, date, img, source, url, content, isFeaturedHome } = body;

    if (!title || !excerpt || !date || !source || !url) {
      return NextResponse.json(
        { success: false, error: "Title, excerpt, date, source, and URL are required" },
        { status: 400 },
      );
    }

    const highestOrder = await prisma.newsItem.aggregate({
      _max: { order: true },
    });
    const order = (highestOrder._max.order ?? -1) + 1;

    const item = await prisma.newsItem.create({
      data: {
        title,
        excerpt,
        date,
        img: img || "/news-&-events/school-associate-launch.webp",
        source,
        url,
        content: content || null,
        isFeaturedHome: isFeaturedHome ?? false,
        order,
      },
    });

    revalidateWebsite(WebsiteTag.news, WebsiteTag.page("home"));
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error("Create news error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create news item" },
      { status: 500 },
    );
  }
}

