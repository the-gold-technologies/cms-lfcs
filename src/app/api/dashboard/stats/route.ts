import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";

export async function GET() {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const [
      campusesCount,
      newsCount,
      galleryCount,
      toppersCount,
      testimonialsCount,
      jobsCount,
      submissionsCount,
      recentSubmissions,
    ] = await Promise.all([
      prisma.campus.count().catch(() => 0),
      prisma.newsItem.count().catch(() => 0),
      prisma.galleryItem.count().catch(() => 0),
      prisma.academicResult.count().catch(() => 0),
      prisma.testimonial.count().catch(() => 0),
      prisma.jobOpening.count().catch(() => 0),
      prisma.submission.count().catch(() => 0),
      prisma.submission
        .findMany({
          take: 6,
          orderBy: { createdAt: "desc" },
        })
        .catch(() => []),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        campusesCount,
        newsCount,
        galleryCount,
        toppersCount,
        testimonialsCount,
        jobsCount,
        submissionsCount,
        recentSubmissions,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
