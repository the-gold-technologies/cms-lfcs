import { PageHeader } from "@/components/PageHeader";
import { CampusForm } from "../components/CampusForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateCampusPage() {
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
        title="Add New School Campus"
        description="Register a new Little Flower school branch with official address, images, and contact links."
      />

      <CampusForm />
    </div>
  );
}
