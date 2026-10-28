import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.academicResult.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update result error:", error);
    return NextResponse.json({ success: false, error: "Failed to update result" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    await prisma.academicResult.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete result error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete result" }, { status: 500 });
  }
}
