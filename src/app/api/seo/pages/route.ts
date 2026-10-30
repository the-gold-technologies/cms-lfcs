import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const LFCS_CORE_PAGES = [
  {
    slug: "about",
    title: "About Us",
    type: "Main Page",
    metaTitle: "About Us | Little Flower Group of Schools",
    metaDescription:
      "Discover our educational approach, 35+ year heritage, leadership team and foundational values since 1988.",
    targetKeywords:
      "about Little Flower, LFCS history, school leadership, CBSE curriculum UP, school values",
    canonicalUrl: "https://lfgos.com/about",
  },
  {
    slug: "academics",
    title: "Academics",
    type: "Main Page",
    metaTitle: "Academics | Little Flower Group of Schools",
    metaDescription:
      "At LFCS, Academics forms the base of a student's journey. Discover our well-structured curriculum and developmental learning approach.",
    targetKeywords:
      "LFCS academics, CBSE curriculum, board exam results, school stages, holistic learning",
    canonicalUrl: "https://lfgos.com/academics",
  },
  {
    slug: "admissions",
    title: "Admissions",
    type: "Main Page",
    metaTitle: "Admissions | Little Flower Group of Schools",
    metaDescription:
      "Admissions at Little Flower Group of Schools. Explore the learning stages we offer and submit an admission enquiry for your preferred campus.",
    targetKeywords:
      "school admission UP, CBSE school admission Mau, LFCS registration, admission enquiry",
    canonicalUrl: "https://lfgos.com/admissions",
  },
  {
    slug: "our-school",
    title: "Our Schools & Campuses",
    type: "Main Page",
    metaTitle: "Our Schools & Campuses | Little Flower Group of Schools",
    metaDescription:
      "A Place to Learn, Grow & Lead. Explore our network of school campuses and world-class facilities across Uttar Pradesh.",
    targetKeywords:
      "LFCS campuses, Little Flower Mau, LFCS Sikatia, LFCS Ballia, LFCS Ghosi, LFCS Ghazipur",
    canonicalUrl: "https://lfgos.com/our-school",
  },
  {
    slug: "experience",
    title: "Student Experience",
    type: "Main Page",
    metaTitle: "Experience | Life at LFCS",
    metaDescription:
      "Life at LFCS is beyond textbooks and classrooms. Explore sports, creative activities, trips, and more opportunities for students.",
    targetKeywords: "life at LFCS, school sports, extracurricular activities, creative arts, clubs",
    canonicalUrl: "https://lfgos.com/experience",
  },
  {
    slug: "start-school",
    title: "Start an Associate School",
    type: "Associate Partner",
    metaTitle: "Start a School | Associate Partnership | LFCS",
    metaDescription:
      "Partner with Little Flower Group of Schools to establish and operate a high-performing associate school in your community.",
    targetKeywords:
      "school franchise India, start a CBSE school, educational partnership, LFCS associate affiliate",
    canonicalUrl: "https://lfgos.com/start-school",
  },
  {
    slug: "careers",
    title: "Careers & Opportunities",
    type: "Main Page",
    metaTitle: "Careers | Little Flower Group of Schools",
    metaDescription:
      "Build your career with Little Flower Group of Schools. Explore teaching and administrative opportunities and submit your profile.",
    targetKeywords:
      "teaching jobs UP, school teacher vacancies, LFCS careers, education jobs, faculty recruitment",
    canonicalUrl: "https://lfgos.com/careers",
  },
  {
    slug: "news-and-events",
    title: "News & Events",
    type: "Media & Press",
    metaTitle: "News & Events | Little Flower Group of Schools",
    metaDescription: "Latest news, announcements and press coverage from Little Flower schools.",
    targetKeywords: "school news, annual day, LFCS announcements, school events, press release",
    canonicalUrl: "https://lfgos.com/news-&-events",
  },
  {
    slug: "gallery",
    title: "Photo Gallery",
    type: "Media & Press",
    metaTitle: "Photo Gallery | Little Flower Group of Schools",
    metaDescription:
      "Photos from Little Flower campuses: classrooms, science labs, early years, sports, arts and culture, and school events.",
    targetKeywords:
      "school photos, campus pictures, science exhibition, sports day gallery, Little Flower pictures",
    canonicalUrl: "https://lfgos.com/gallery",
  },
  {
    slug: "contact",
    title: "Contact Us",
    type: "Main Page",
    metaTitle: "Contact Us | Little Flower Group of Schools",
    metaDescription:
      "Get in touch with Little Flower Group of Schools for admissions, academics, partnerships, or general enquiries.",
    targetKeywords:
      "contact LFCS, school helpline phone, admission inquiry email, campus addresses, office hours",
    canonicalUrl: "https://lfgos.com/contact",
  },
];

export async function GET() {
  try {
    // Upsert the core pages with complete metadata if missing
    for (const core of LFCS_CORE_PAGES) {
      const existing = await prisma.page.findUnique({
        where: { slug: core.slug },
      });

      if (!existing) {
        await prisma.page.create({
          data: {
            slug: core.slug,
            title: core.title,
            type: core.type,
            metaTitle: core.metaTitle,
            metaDescription: core.metaDescription,
            targetKeywords: core.targetKeywords,
            canonicalUrl: core.canonicalUrl,
            visibility: "published",
          },
        });
      } else {
        await prisma.page.update({
          where: { slug: core.slug },
          data: {
            title: existing.title || core.title,
            type: existing.type || core.type,
            metaTitle: existing.metaTitle || core.metaTitle,
            metaDescription: existing.metaDescription || core.metaDescription,
            targetKeywords: existing.targetKeywords || core.targetKeywords,
            canonicalUrl: existing.canonicalUrl || core.canonicalUrl,
          },
        });
      }
    }

    const pages = await prisma.page.findMany({
      where: {
        slug: {
          not: "home",
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
        targetKeywords: true,
        canonicalUrl: true,
        type: true,
        visibility: true,
        noIndex: true,
      },
    });

    const orderMap: Record<string, number> = {};
    LFCS_CORE_PAGES.forEach((item, index) => {
      orderMap[item.slug] = index + 1;
    });

    const orderedPages = pages
      .map((p) => ({
        ...p,
        order: orderMap[p.slug] || 99,
        parent: "-",
      }))
      .sort((a, b) => a.order - b.order);

    return NextResponse.json({ success: true, data: orderedPages });
  } catch (error: any) {
    console.error("Error fetching SEO pages:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
