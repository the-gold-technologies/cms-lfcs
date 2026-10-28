import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { deleteCloudinaryAsset } from "@/lib/cloudinaryCleanup";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    if (existing.src) {
      deleteCloudinaryAsset(existing.src).catch(console.error);
    }

    await prisma.galleryItem.delete({ where: { id } });

    revalidateWebsite(WebsiteTag.gallery);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete gallery error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete image" }, { status: 500 });
  }
}

