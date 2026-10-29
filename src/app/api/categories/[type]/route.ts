import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";

// GET /api/categories/[type] (e.g. /api/categories/gallery)
export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params;

    const categories = await prisma.dynamicCategory.findMany({
      where: { type },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("GET categories error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/categories/[type] (Add category for this type)
export async function POST(req: Request, { params }: { params: Promise<{ type: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { type } = await params;
    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();

    const existing = await prisma.dynamicCategory.findUnique({
      where: { type_name: { type, name: trimmedName } },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Category already exists" },
        { status: 400 },
      );
    }

    const maxOrder = await prisma.dynamicCategory.aggregate({
      where: { type },
      _max: { order: true },
    });
    const order = (maxOrder._max.order ?? -1) + 1;

    const created = await prisma.dynamicCategory.create({
      data: {
        type,
        name: trimmedName,
        order,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("POST category error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/categories/[type] (Rename / reorder category)
export async function PUT(req: Request, { params }: { params: Promise<{ type: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { type } = await params;
    const body = await req.json();
    const { id, name, order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const current = await prisma.dynamicCategory.findUnique({
      where: { id },
    });

    if (!current || current.type !== type) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    const oldName = current.name;
    const newName = name?.trim() || oldName;

    const updated = await prisma.dynamicCategory.update({
      where: { id },
      data: {
        name: newName,
        order: typeof order === "number" ? order : current.order,
      },
    });

    // Cascade update associated items when a category is renamed
    if (newName !== oldName) {
      if (type === "gallery") {
        await prisma.galleryItem.updateMany({
          where: { category: oldName },
          data: { category: newName },
        });
      } else if (type === "testimonials") {
        await prisma.testimonial.updateMany({
          where: { category: oldName },
          data: { category: newName },
        });
      } else if (type === "results") {
        await prisma.academicResult.updateMany({
          where: { examType: oldName },
          data: { examType: newName },
        });
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT category error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/categories/[type]?id=...&reassignTo=...
export async function DELETE(req: Request, { params }: { params: Promise<{ type: string }> }) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { type } = await params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const reassignTo = searchParams.get("reassignTo");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const current = await prisma.dynamicCategory.findUnique({
      where: { id },
    });

    if (!current || current.type !== type) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    // Cascade or reassign items belonging to the deleted category
    if (type === "gallery") {
      if (reassignTo) {
        await prisma.galleryItem.updateMany({
          where: { category: current.name },
          data: { category: reassignTo },
        });
      } else {
        await prisma.galleryItem.deleteMany({
          where: { category: current.name },
        });
      }
    } else if (type === "testimonials") {
      if (reassignTo) {
        await prisma.testimonial.updateMany({
          where: { category: current.name },
          data: { category: reassignTo },
        });
      } else {
        await prisma.testimonial.deleteMany({
          where: { category: current.name },
        });
      }
    } else if (type === "results") {
      if (reassignTo) {
        await prisma.academicResult.updateMany({
          where: { examType: current.name },
          data: { examType: reassignTo },
        });
      } else {
        await prisma.academicResult.deleteMany({
          where: { examType: current.name },
        });
      }
    }

    await prisma.dynamicCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("DELETE category error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
