import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { CampusForm } from "../../components/CampusForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditCampusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campus = await prisma.campus.findUnique({
    where: { id },
  });

  if (!campus) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <Link
        href="/campuses"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campuses</span>
      </Link>

      <PageHeader
        title={`Edit: ${campus.name}`}
        description="Update campus details, contact channels, facilities, and media photos."
      />

      <CampusForm initialData={campus} isEdit />
    </div>
  );
}
