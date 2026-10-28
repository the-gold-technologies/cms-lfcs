import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        status: body.status !== undefined ? body.status : undefined,
        internalNotes: body.internalNotes !== undefined ? body.internalNotes : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update submission error:", error);
    return NextResponse.json({ success: false, error: "Failed to update submission" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    await prisma.submission.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete submission error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete submission" }, { status: 500 });
  }
}

