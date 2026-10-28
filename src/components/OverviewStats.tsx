"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, MessageSquare, Building, Newspaper } from "lucide-react";

interface OverviewStatsProps {
  stats?: {
    enquiries?: number;
    pages?: number;
    campuses?: number;
    news?: number;
  };
  loading?: boolean;
}

export function OverviewStats({ stats: propStats, loading: propLoading }: OverviewStatsProps) {
  const [stats, setStats] = useState({
    enquiries: 0,
    pages: 8,
    campuses: 8,
    news: 6,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propStats) {
      setStats((prev) => ({ ...prev, ...propStats }));
      setLoading(propLoading !== undefined ? propLoading : false);
      return;
    }

    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const json = await res.json();
        if (json.success) {
          setStats({
            enquiries: json.data.submissionsCount ?? 0,
            pages: 8,
            campuses: json.data.campusesCount ?? 8,
            news: json.data.newsCount ?? 6,
          });
        }
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [propStats, propLoading]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#0B0F29]">Overview Stats</h2>
        <Link
          href="/submissions/admissions"
          className="text-sm font-semibold text-gray-500 hover:text-[#0B0F29] underline decoration-gray-300 underline-offset-4 transition-colors"
        >
          View All Leads
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Stat Card 1: Active Pages */}
        <div className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-gray-50 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-[#f0f9ff] text-[#0ea5e9] flex items-center justify-center">
              <BookOpen className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-[#0B0F29] text-[15px]">Active Pages</h3>
              <p className="text-[13px] font-medium text-gray-400 mt-0.5">
                {loading ? "..." : `${stats.pages} Published Pages`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Status
              </p>
              <p className="text-[13px] font-bold text-[#0b0f29]">Online</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                CMS Access
              </p>
              <p className="text-[13px] font-bold text-[#0B0F29]">Editable</p>
            </div>
          </div>
        </div>

        {/* Stat Card 2: Enquiries */}
        <div className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-gray-50 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-[#d1fadf] text-[#12b76a] flex items-center justify-center">
              <MessageSquare className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-[#0B0F29] text-[15px]">Total Inquiries</h3>
              <p className="text-[13px] font-medium text-gray-400 mt-0.5">
                {loading ? "..." : `${stats.enquiries} Leads Recorded`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Forms
              </p>
              <p className="text-[13px] font-bold text-[#0b0f29]">4 Ingestion Types</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Email Alert
              </p>
              <p className="text-[13px] font-bold text-[#12b76a]">SMTP Active</p>
            </div>
          </div>
        </div>

        {/* Stat Card 3: Campuses */}
        <div className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-gray-50 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-[#fef3f2] text-[#f04438] flex items-center justify-center">
              <Building className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-[#0B0F29] text-[15px]">School Campuses</h3>
              <p className="text-[13px] font-medium text-gray-400 mt-0.5">
                {loading ? "..." : `${stats.campuses} Active Campuses`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Districts
              </p>
              <p className="text-[13px] font-bold text-[#0b0f29]">Mau, Ballia, Ghazipur</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Media
              </p>
              <p className="text-[13px] font-bold text-[#0B0F29]">Cloudinary CDN</p>
            </div>
          </div>
        </div>

        {/* Stat Card 4: News Articles */}
        <div className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-gray-50 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-[#fdf2fa] text-[#c11574] flex items-center justify-center">
              <Newspaper className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-[#0B0F29] text-[15px]">News & Press</h3>
              <p className="text-[13px] font-medium text-gray-400 mt-0.5">
                {loading ? "..." : `${stats.news} Publications`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Press Outlets
              </p>
              <p className="text-[13px] font-bold text-[#0b0f29]">20+ Media Outlets</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Revalidation
              </p>
              <p className="text-[13px] font-bold text-[#12b76a]">Instant ISR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
