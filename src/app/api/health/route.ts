import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Used by the deploy workflow to confirm a new version is serving before it is kept.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "online" });
  } catch (error) {
    console.error("Health check: database connection failed:", error);
    return NextResponse.json(
      { status: "error", message: "Database connection failed" },
      { status: 500 },
    );
  }
}
