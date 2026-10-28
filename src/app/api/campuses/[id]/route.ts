import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { deleteCloudinaryAsset } from "@/lib/cloudinaryCleanup";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const campus = await prisma.campus.findUnique({
      where: { id },
    });
    if (!campus) {
      return NextResponse.json({ success: false, error: "Campus not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: campus });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch campus" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.campus.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Campus not found" }, { status: 404 });
    }

    // Clean up replaced image
    if (body.img && existing.img && body.img !== existing.img) {
      deleteCloudinaryAsset(existing.img).catch(console.error);
    }

    const updated = await prisma.campus.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        city: body.city ?? existing.city,
        state: body.state ?? existing.state,
        address: body.address ?? existing.address,
        img: body.img ?? existing.img,
        website: body.website !== undefined ? body.website : existing.website,
        instagram: body.instagram !== undefined ? body.instagram : existing.instagram,
        facebook: body.facebook !== undefined ? body.facebook : existing.facebook,
        youtube: body.youtube !== undefined ? body.youtube : existing.youtube,
        phone: body.phone !== undefined ? body.phone : existing.phone,
        email: body.email !== undefined ? body.email : existing.email,
        principalName:
          body.principalName !== undefined ? body.principalName : existing.principalName,
        facilities: body.facilities !== undefined ? body.facilities : existing.facilities,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : existing.isFeatured,
        order: body.order !== undefined ? body.order : existing.order,
      },
    });

    revalidateWebsite(WebsiteTag.campuses);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Update campus error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update campus" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const existing = await prisma.campus.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Campus not found" }, { status: 404 });
    }

    if (existing.img) {
      deleteCloudinaryAsset(existing.img).catch(console.error);
    }

    await prisma.campus.delete({ where: { id } });

    revalidateWebsite(WebsiteTag.campuses);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete campus error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete campus" }, { status: 500 });
  }
}
