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

export async function PUT(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();

    const updated = await prisma.globalConfig.upsert({
      where: { id: "global" },
      create: {
        id: "global",
        ...body,
      },
      update: body,
    });

    revalidateWebsite(WebsiteTag.site);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Save global SEO error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save SEO config" },
      { status: 500 },
    );
  }
}
