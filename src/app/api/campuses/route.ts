import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";

export async function GET() {
  try {
    const campuses = await prisma.campus.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: campuses });
  } catch (error) {
    console.error("Campuses fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campuses" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const {
      name,
      city,
      state,
      address,
      img,
      website,
      instagram,
      facebook,
      youtube,
      phone,
      email,
      principalName,
      facilities,
      isFeatured,
    } = body;

    if (!name || !city || !address) {
      return NextResponse.json(
        { success: false, error: "Name, city, and address are required" },
        { status: 400 },
      );
    }

    const highestOrder = await prisma.campus.aggregate({
      _max: { order: true },
    });
    const order = (highestOrder._max.order ?? -1) + 1;

    const campus = await prisma.campus.create({
      data: {
        name,
        city,
        state: state || "Uttar Pradesh",
        address,
        img: img || "/schools/Nizamuddinpura-Mau.webp",
        website: website || null,
        instagram: instagram || null,
        facebook: facebook || null,
        youtube: youtube || null,
        phone: phone || null,
        email: email || null,
        principalName: principalName || null,
        facilities: facilities || [],
        isFeatured: isFeatured ?? true,
        order,
      },
    });

    revalidateWebsite(WebsiteTag.campuses);
    return NextResponse.json({ success: true, data: campus });
  } catch (error: any) {
    console.error("Create campus error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create campus" },
      { status: 500 },
    );
  }
}
