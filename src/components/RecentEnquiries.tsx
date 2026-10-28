"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Tag, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Submission {
  id: string;
  fullName: string;
  email: string;
  formType: string;
  preferredCampus?: string | null;
  createdAt: string;
}

export function RecentEnquiries() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch("/api/submissions");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSubmissions(json.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching recent submissions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-[#0B0F29]">Recent Inquiries</h3>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            Latest incoming submissions from admissions, franchise, and contact forms.
          </p>
        </div>
        <Link
          href="/submissions/admissions"
          className="text-xs font-bold text-[#6a2238] hover:text-black flex items-center gap-1 bg-[#6a2238]/10 px-3 py-1.5 rounded-xl transition-all"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#6a2238]" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-xs italic">
          No inquiries received yet.
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-gray-50/30 rounded-xl px-2 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                  {sub.fullName ? (
                    sub.fullName.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B0F29] group-hover:text-[#6a2238] transition-colors">
                    {sub.fullName}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 font-medium">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-300" />
                      {sub.email}
                    </span>
                    <span className="flex items-center gap-1 uppercase font-bold text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      <Tag className="w-3 h-3 text-amber-500" />
                      {sub.formType}
                    </span>
                    {sub.preferredCampus && (
                      <span className="text-gray-400">{sub.preferredCampus}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 pl-14 md:pl-0">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(sub.createdAt)}
                </span>
                <Link
                  href={`/submissions/${sub.formType}`}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#6a2238] transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
