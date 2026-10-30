"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Globe,
  CheckCircle,
  AlertCircle,
  FileText,
  Edit2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

interface PageSEOItem {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  type: string;
  visibility: string;
  parent?: string;
  order?: number;
  noIndex?: boolean;
}

export default function PageSEODashboard() {
  const [pages, setPages] = useState<PageSEOItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadPages() {
      try {
        const res = await fetch("/api/seo/pages");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPages(json.data.filter((p: PageSEOItem) => p.slug !== "home" && p.slug !== "/"));
        }
      } catch (err) {
        console.error("Error loading SEO pages:", err);
        toast.error("Failed to load page directory");
      } finally {
        setIsLoading(false);
      }
    }
    loadPages();
  }, []);

  const toggleParent = (id: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPages = pages.filter((page) => {
    const q = searchQuery.toLowerCase();
    return (
      (page.title || "").toLowerCase().includes(q) ||
      (page.slug || "").toLowerCase().includes(q) ||
      (page.metaTitle || "").toLowerCase().includes(q)
    );
  });

  const rootLinks = filteredPages
    .filter((p) => p.parent === "-" || !p.parent)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const totalPages = pages.length;
  const configuredTitleCount = pages.filter(
    (p) => p.metaTitle && p.metaTitle.trim().length > 0,
  ).length;
  const configuredDescCount = pages.filter(
    (p) => p.metaDescription && p.metaDescription.trim().length > 0,
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            SEO Page Manager
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-normal">
            Configure metadata, open graph cards, and indexing targets across all site pages.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-[#842b46] rounded-2xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{totalPages}</div>
            <div className="text-xs text-gray-500 font-medium">Total Site Routes</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{configuredTitleCount}</div>
            <div className="text-xs text-gray-500 font-medium">Meta Titles Active</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-[#dfae19] rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{configuredDescCount}</div>
            <div className="text-xs text-gray-500 font-medium">Meta Descriptions Active</div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Table Search Bar */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, route, or meta keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#842b46] focus:bg-white transition-all"
            />
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Showing {filteredPages.length} of {totalPages} items
          </div>
        </div>

        {/* Routes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/40">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Page / Section</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Route Path</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#842b46] mx-auto"></div>
                  </td>
                </tr>
              ) : rootLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                    No pages found matching your search.
                  </td>
                </tr>
              ) : (
                rootLinks.map((root, rootIndex) => {
                  const children = filteredPages
                    .filter((c) => c.parent === root.id)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                  const hasChildren = children.length > 0;
                  const isExpanded = !!expandedParents[root.id];

                  const hasTitle = Boolean(root.metaTitle && root.metaTitle.trim().length > 0);
                  const hasDesc = Boolean(
                    root.metaDescription && root.metaDescription.trim().length > 0,
                  );

                  return (
                    <React.Fragment key={root.id}>
                      <tr className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-6 py-5 text-sm font-semibold text-gray-500 whitespace-nowrap">
                          {rootIndex + 1}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {hasChildren ? (
                              <button
                                type="button"
                                onClick={() => toggleParent(root.id)}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 cursor-pointer"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-[#842b46]" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            ) : (
                              <div className="p-2 bg-gray-50 text-gray-400 rounded-xl">
                                <FileText className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-bold text-gray-900 group-hover:text-[#842b46] transition-colors">
                                {root.title || root.slug}
                              </div>
                              <div className="text-xs text-gray-400 font-mono">
                                /{root.slug === "home" ? "" : root.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {hasTitle && hasDesc ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Optimized
                            </span>
                          ) : hasTitle || hasDesc ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Partial
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Missing Meta
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                            {root.type || "Page"}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <code className="text-xs font-mono text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                            /{root.slug === "home" ? "" : root.slug}
                          </code>
                        </td>
                        <td className="px-6 py-5 text-right whitespace-nowrap">
                          <Link
                            href={`/seo/pages/${root.slug}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-[#842b46] text-gray-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-2xs group/btn cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-white transition-colors" />
                            Edit SEO
                          </Link>
                        </td>
                      </tr>

                      {/* Render Children (if grouped) */}
                      {isExpanded &&
                        children.map((child, childIndex) => {
                          const childHasTitle = Boolean(
                            child.metaTitle && child.metaTitle.trim().length > 0,
                          );
                          const childHasDesc = Boolean(
                            child.metaDescription && child.metaDescription.trim().length > 0,
                          );
                          return (
                            <tr
                              key={child.id}
                              className="bg-[#fcfdff]/70 hover:bg-[#f5f8ff] transition-colors"
                            >
                              <td className="px-6 py-4 text-xs font-medium text-gray-400 pl-12 whitespace-nowrap">
                                {rootIndex + 1}.{childIndex + 1}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5 pl-6 border-l-2 border-gray-100/60 min-w-0">
                                  <span className="text-gray-300 text-sm shrink-0">↳</span>
                                  <div>
                                    <span className="font-semibold text-xs text-gray-800 line-clamp-1 block">
                                      {child.title}
                                    </span>
                                    <span className="text-[11px] font-mono text-gray-400 line-clamp-1 block">
                                      /{child.slug}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {childHasTitle && childHasDesc ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Optimized
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    Partial
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                  {child.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <code className="text-xs font-mono text-gray-400">
                                  /{child.slug}
                                </code>
                              </td>
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                <Link
                                  href={`/seo/pages/${child.slug}`}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-[#842b46] text-gray-500 hover:text-white border border-gray-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  Edit
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
