import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const examType = searchParams.get("examType");
    const year = searchParams.get("year");

    const where: any = {};
    if (examType) where.examType = examType;
    if (year) where.year = year;

    const results = await prisma.academicResult.findMany({
      where,
      orderBy: [{ year: "desc" }, { order: "asc" }],
    });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Fetch results error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch results" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const { studentName, examType, year, percentageOrRank, campusName, studentPhoto, stream, order } = body;

    if (!studentName || !examType || !percentageOrRank) {
      return NextResponse.json({ success: false, error: "Missing required topper fields" }, { status: 400 });
    }

    const item = await prisma.academicResult.create({
      data: {
        studentName,
        examType,
        year: year || "2024-2025",
        percentageOrRank,
        campusName: campusName || "LFCS",
        studentPhoto: studentPhoto || null,
        stream: stream || null,
        order: order ? Number(order) : 0,
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("Create result error:", error);
    return NextResponse.json({ success: false, error: "Failed to create result" }, { status: 500 });
  }
}
