# Frontend Integration Guide for LFCS School (`lfcs-school`)

This document explains how the main website (`lfcs-school`) connects to `lfcs-school-cms`.

---

## 1. Environment Variables in `lfcs-school/.env.local`

```env
NEXT_PUBLIC_CMS_URL="http://localhost:3001"
CMS_SHARED_SECRET="lfcs-school-secret-key-replace-in-production"
```

---

## 2. Server-Side Client (`src/lib/cms.ts`)

```typescript
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;
export const REVALIDATE_SECONDS = 3600;

export const CmsTag = {
  campuses: "campuses",
  news: "news",
  gallery: "gallery",
  testimonials: "testimonials",
  results: "results",
  careers: "careers",
  site: "site",
  page: (slug: string) => `page:${slug}`,
};

export type CmsResponse<T, S = undefined> = { success: true; data: T; seo: S };

export async function cmsGet<T, S = undefined>(
  path: string,
  tags: string[],
): Promise<CmsResponse<T, S>> {
  if (!CMS_URL) throw new Error("NEXT_PUBLIC_CMS_URL is not set");

  const res = await fetch(`${CMS_URL.replace(/\/$/, "")}/api${path}`, {
    next: { tags, revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`[cms] GET ${path} responded ${res.status}`);

  const json = await res.json();
  if (!json.success) throw new Error(`[cms] GET ${path} failed: ${json.error}`);
  return json;
}

export async function cmsPost<T>(path: string, body: unknown): Promise<T> {
  const secret = process.env.CMS_SHARED_SECRET;
  if (!CMS_URL || !secret) throw new Error("NEXT_PUBLIC_CMS_URL or CMS_SHARED_SECRET is not set");

  const res = await fetch(`${CMS_URL.replace(/\/$/, "")}/api${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cms-secret": secret,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(
      `[cms] POST ${path} responded ${res.status}: ${json?.error ?? "unknown error"}`,
    );
  }
  return json.data;
}
```

---

## 3. On-Demand Cache Invalidation Endpoint (`src/app/api/revalidate/route.ts`)

```typescript
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const secret = req.headers.get("x-cms-secret");
  if (secret !== process.env.CMS_SHARED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tags } = await req.json();
  if (Array.isArray(tags)) {
    for (const tag of tags) {
      revalidateTag(tag);
      console.log(`[revalidate] Purged cache tag: ${tag}`);
    }
  }

  return NextResponse.json({ revalidated: true });
}
```

---

## 4. Submitting Leads to the CMS Database

In `src/app/actions/enquiries.ts`, form actions will forward submissions to the CMS:

```typescript
await cmsPost("/submissions", {
  formType: "admissions",
  fullName: parentName,
  email,
  preferredCampus: campus,
  grade,
  academicSession: session,
  message,
});
```

This stores the submission into the PostgreSQL database for admin management, and dispatches administrative SMTP email notifications.
