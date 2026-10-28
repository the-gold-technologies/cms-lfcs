import { after } from "next/server";

/**
 * Cache tags shared with the LFCS website. The website caches CMS responses under
 * one of these tags and only refetches when we ping it here, so updates appear instantly.
 */
export const WebsiteTag = {
  campuses: "campuses",
  news: "news",
  gallery: "gallery",
  testimonials: "testimonials",
  results: "results",
  careers: "careers",
  site: "site", // global config & navigation
  page: (slug: string) => `page:${slug}`,
};

/**
 * Tells the website to refetch the given tags. Runs after the response is sent,
 * so a slow or offline website never slows down or fails a CMS save.
 */
export function revalidateWebsite(...tags: string[]) {
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const secret = process.env.CMS_SHARED_SECRET;
  if (!websiteUrl || !secret) {
    console.warn("[revalidate] NEXT_PUBLIC_WEBSITE_URL or CMS_SHARED_SECRET is not set; skipping");
    return;
  }

  after(async () => {
    try {
      const res = await fetch(`${websiteUrl.replace(/\/$/, "")}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-cms-secret": secret },
        body: JSON.stringify({ tags }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) console.error(`[revalidate] Website responded ${res.status} for`, tags);
    } catch (error) {
      console.error("[revalidate] Could not reach website for", tags, error);
    }
  });
}

/** True when the request comes from the website's server with the shared secret. */
export function isWebsiteRequest(request: Request): boolean {
  const secret = process.env.CMS_SHARED_SECRET;
  return !!secret && request.headers.get("x-cms-secret") === secret;
}
