import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";

export const dynamic = "force-dynamic";

const LFCS_NAV_DEFAULT = [
  // 1. About Us
  {
    id: "nav-about",
    label: "About Us",
    url: "/about",
    type: "Main Link",
    parent: "-",
    order: 1,
  },

  // 2. Academics (Dropdown)
  {
    id: "nav-academics",
    label: "Academics",
    url: "/academics",
    type: "Dropdown",
    parent: "-",
    order: 2,
  },
  {
    id: "nav-academics-curriculum",
    label: "Academics",
    url: "/academics",
    type: "Dropdown Item",
    parent: "nav-academics",
    description: "Curriculum, learning stages and results",
    order: 1,
  },
  {
    id: "nav-academics-experience",
    label: "Experience",
    url: "/experience",
    type: "Dropdown Item",
    parent: "nav-academics",
    description: "Sports, arts, clubs and student life",
    order: 2,
  },
  {
    id: "nav-academics-news",
    label: "News & Events",
    url: "/news-&-events",
    type: "Dropdown Item",
    parent: "nav-academics",
    description: "Announcements and press coverage",
    order: 3,
  },

  // 3. Admissions
  {
    id: "nav-admissions",
    label: "Admissions",
    url: "/admissions",
    type: "Main Link",
    parent: "-",
    order: 3,
  },

  // 4. Our Schools (Dropdown)
  {
    id: "nav-our-schools",
    label: "Our Schools",
    url: "/our-school",
    type: "Dropdown",
    parent: "-",
    order: 4,
  },
  {
    id: "nav-school-mau",
    label: "LFCS, MAU",
    url: "https://lfgos.com/",
    type: "Dropdown Item",
    parent: "nav-our-schools",
    image:
      "https://res.cloudinary.com/dpa93copz/image/upload/v1793170001/lfcs-school/Nizamuddinpura-Mau_1793169999785.webp",
    order: 1,
  },
  {
    id: "nav-school-sikatiya",
    label: "LFCS, SIKATIYA",
    url: "https://lfcsmau.co/",
    type: "Dropdown Item",
    parent: "nav-our-schools",
    image:
      "https://res.cloudinary.com/dpa93copz/image/upload/v1793170002/lfcs-school/Sikatia-Mau_1793170001648.webp",
    order: 2,
  },
  {
    id: "nav-school-ghosi",
    label: "LFCS, GHOSI",
    url: "https://www.lfcsghosi.co.in/",
    type: "Dropdown Item",
    parent: "nav-our-schools",
    image:
      "https://res.cloudinary.com/dpa93copz/image/upload/v1793170003/lfcs-school/Ghosi_1793170002814.webp",
    order: 3,
  },
  {
    id: "nav-school-ballia",
    label: "LFCS, BALLIA",
    url: "https://lfcsballia.co.in/",
    type: "Dropdown Item",
    parent: "nav-our-schools",
    image:
      "https://res.cloudinary.com/dpa93copz/image/upload/v1793170004/lfcs-school/Khalispur-Balia_1793170003677.webp",
    order: 4,
  },
  {
    id: "nav-school-kasimabad",
    label: "LFCS, KASIMABAD GHAZIPUR",
    url: "https://www.lfcskasimabad.in/",
    type: "Dropdown Item",
    parent: "nav-our-schools",
    image:
      "https://res.cloudinary.com/dpa93copz/image/upload/v1793170004/lfcs-school/Kasimabad_1793170004532.webp",
    order: 5,
  },
  {
    id: "nav-school-azamgarh",
    label: "LFCS, AZAMGARH",
    url: "https://lfcsazamgarh.org.in/",
    type: "Dropdown Item",
    parent: "nav-our-schools",
    image:
      "https://res.cloudinary.com/dpa93copz/image/upload/v1793170005/lfcs-school/lfcs-azamgarh_1793170005461.webp",
    order: 6,
  },
  {
    id: "nav-school-lfis-mau",
    label: "LFIS, KHALISHPUR MAU",
    url: "https://lfismau.co.in/",
    type: "Dropdown Item",
    parent: "nav-our-schools",
    image:
      "https://res.cloudinary.com/dpa93copz/image/upload/v1793170006/lfcs-school/lfis-mau_1793170006474.webp",
    order: 7,
  },
  {
    id: "nav-school-azadhind",
    label: "AZAD HIND INTER COLLEGE, KHALISHPUR MAU",
    url: "https://www.facebook.com/azadhindcollege/",
    type: "Dropdown Item",
    parent: "nav-our-schools",
    image:
      "https://res.cloudinary.com/dpa93copz/image/upload/v1793170007/lfcs-school/azad-hind-inter-college_1793170007381.webp",
    order: 8,
  },

  // 5. Contact Us
  {
    id: "nav-contact",
    label: "Contact Us",
    url: "/contact",
    type: "Main Link",
    parent: "-",
    order: 5,
  },

  // 6. Action Button: Start a School
  {
    id: "nav-start-school",
    label: "Start a School",
    url: "/start-school",
    type: "Action Button",
    parent: "-",
    order: 6,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sync = searchParams.get("sync");

    let links = await prisma.navLink.findMany({
      orderBy: { order: "asc" },
    });

    const hasDropdownItems = links.some((l) => l.parent !== "-" && l.parent !== "");
    if (sync === "true" || links.length === 0 || !hasDropdownItems) {
      await prisma.navLink.deleteMany();
      for (const item of LFCS_NAV_DEFAULT) {
        await prisma.navLink.create({
          data: {
            id: item.id,
            label: item.label,
            url: item.url,
            type: item.type,
            parent: item.parent,
            description: item.description ?? null,
            image: item.image ?? null,
            order: item.order,
          },
        });
      }
      links = await prisma.navLink.findMany({ orderBy: { order: "asc" } });
    }

    return NextResponse.json({ success: true, data: links });
  } catch (error: any) {
    console.error("Error fetching nav links:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch nav links" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const body = await request.json();
    const { label, url, type, parent, description, image, order } = body;

    if (!label || !url) {
      return NextResponse.json(
        { success: false, error: "Label and URL are required" },
        { status: 400 },
      );
    }

    const created = await prisma.navLink.create({
      data: {
        label,
        url,
        type: type || (parent && parent !== "-" ? "Dropdown Item" : "Main Link"),
        parent: parent || "-",
        description: description || null,
        image: image || null,
        order: typeof order === "number" ? order : 0,
      },
    });

    revalidateWebsite(WebsiteTag.site);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error creating nav link:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create link" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const body = await request.json();

    // Check if sync default action requested
    if (body.action === "sync_default") {
      await prisma.navLink.deleteMany();
      for (const item of LFCS_NAV_DEFAULT) {
        await prisma.navLink.create({
          data: {
            id: item.id,
            label: item.label,
            url: item.url,
            type: item.type,
            parent: item.parent,
            description: item.description ?? null,
            image: item.image ?? null,
            order: item.order,
          },
        });
      }
      const links = await prisma.navLink.findMany({ orderBy: { order: "asc" } });
      revalidateWebsite(WebsiteTag.site);
      return NextResponse.json({ success: true, data: links });
    }

    // Single link update
    if (body.id) {
      const { id, label, url, type, parent, description, image, order } = body;
      const updated = await prisma.navLink.update({
        where: { id },
        data: {
          label: label !== undefined ? label : undefined,
          url: url !== undefined ? url : undefined,
          type: type !== undefined ? type : undefined,
          parent: parent !== undefined ? parent : undefined,
          description: description !== undefined ? description : undefined,
          image: image !== undefined ? image : undefined,
          order: order !== undefined ? order : undefined,
        },
      });
      revalidateWebsite(WebsiteTag.site);
      return NextResponse.json({ success: true, data: updated });
    }

    // Bulk links array update
    if (Array.isArray(body.links)) {
      for (const item of body.links) {
        if (!item.id) continue;
        await prisma.navLink.update({
          where: { id: item.id },
          data: {
            label: item.label,
            url: item.url,
            type: item.type,
            parent: item.parent,
            description: item.description,
            image: item.image,
            order: item.order,
          },
        });
      }
      const all = await prisma.navLink.findMany({ orderBy: { order: "asc" } });
      revalidateWebsite(WebsiteTag.site);
      return NextResponse.json({ success: true, data: all });
    }

    return NextResponse.json({ success: false, error: "Invalid update payload" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating nav links:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update link" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id parameter is required" },
        { status: 400 },
      );
    }

    // Delete child links if any
    await prisma.navLink.deleteMany({ where: { parent: id } });
    await prisma.navLink.delete({ where: { id } });

    revalidateWebsite(WebsiteTag.site);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting nav link:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete link" },
      { status: 500 },
    );
  }
}
