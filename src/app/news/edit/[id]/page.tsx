import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { NewsForm } from "../../components/NewsForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.newsItem.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to News</span>
      </Link>

      <PageHeader
        title="Edit News Article"
        description="Update headline, summary, links, and featured thumbnail."
      />

      <NewsForm initialData={item} isEdit />
    </div>
  );
}
