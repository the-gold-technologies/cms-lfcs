import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = {};
    if (category) where.category = category;

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("Fetch testimonials error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const { name, role, text, category, avatarImage, rating, order } = body;

    if (!name || !text || !category) {
      return NextResponse.json(
        { success: false, error: "Name, category, and review text are required" },
        { status: 400 },
      );
    }

    const item = await prisma.testimonial.create({
      data: {
        name,
        role: role || "Parent",
        text,
        category: category.toUpperCase(),
        avatarImage: avatarImage || null,
        rating: rating ? Number(rating) : 5,
        order: order ? Number(order) : 0,
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create testimonial" },
      { status: 500 },
    );
  }
}
