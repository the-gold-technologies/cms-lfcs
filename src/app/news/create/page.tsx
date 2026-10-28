import { PageHeader } from "@/components/PageHeader";
import { NewsForm } from "../components/NewsForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateNewsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to News</span>
      </Link>

      <PageHeader
        title="Publish News / Press Story"
        description="Add a new media release or press feature with link and thumbnail."
      />

      <NewsForm />
    </div>
  );
}

