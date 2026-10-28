import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prismaInstance: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  // Graceful fallback for build-time generation
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/lfcs_school_cms";
}

const resolvedConnStr = process.env.DATABASE_URL!;
const isLocal = resolvedConnStr.includes("localhost") || resolvedConnStr.includes("127.0.0.1");

const pool = new Pool({
  connectionString: resolvedConnStr,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

export const prisma = global.prismaInstance ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.prismaInstance = prisma;
}
