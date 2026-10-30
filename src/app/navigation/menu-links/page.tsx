"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Compass, Loader2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface NavLinkItem {
  id: string;
  label: string;
  url: string;
  type: string;
  parent?: string;
  order?: number;
  title?: string;
  icon?: string;
  image?: string;
  description?: string;
  isStatic?: boolean;
}

export default function MenuLinksPage() {
  const [links, setLinks] = useState<NavLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadNavLinks() {
      try {
        setLoading(true);
        const res = await fetch("/api/nav-links");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setLinks(json.data);
          setExpandedParents({});
        } else {
          toast.error(json.error || "Failed to load navigation links");
        }
      } catch (err) {
        console.error("Failed to load navigation links:", err);
        toast.error("Failed to load navigation links");
      } finally {
        setLoading(false);
      }
    }
    loadNavLinks();
  }, []);

  const toggleParent = (id: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const rootLinks = links
    .filter((l) => l.parent === "-" || !l.parent)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const getTypeBadge = (type: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("dropdown item") || t === "item") {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap bg-rose-50 text-[#842b46] border border-rose-100">
          DROPDOWN ITEM
        </span>
      );
    }
    if (t.includes("dropdown")) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap bg-purple-50 text-purple-700 border border-purple-100">
          DROPDOWN
        </span>
      );
    }
    if (t.includes("action")) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap bg-amber-50 text-[#dfae19] border border-amber-200">
          ACTION BUTTON
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap bg-blue-50 text-[#0a192f] border border-blue-100">
        MAIN LINK
      </span>
    );
  };

  return (
    <section className="flex flex-col gap-6 pb-20 w-full max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#842b46] flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Navigation Links
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium pl-13">
          Manage and view the hierarchical link structure that appears in the main website
          navigation bar.
        </p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-3 sm:p-6 lg:p-8">
        {loading ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 text-[#842b46] animate-spin" />
            <p className="text-xs font-semibold text-gray-400">Loading navigation structure...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-24 whitespace-nowrap">
                    ORDER
                  </th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    LABEL / TITLE
                  </th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center w-40 whitespace-nowrap">
                    TYPE
                  </th>
                  <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-64 whitespace-nowrap">
                    URL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rootLinks.map((root, rootIndex) => {
                  const children = links
                    .filter((c) => c.parent === root.id)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                  const hasChildren = children.length > 0;
                  const isExpanded = !!expandedParents[root.id];

                  return (
                    <React.Fragment key={root.id}>
                      {/* Root Item Row */}
                      <tr className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-5 px-6 text-sm font-semibold text-gray-600 whitespace-nowrap">
                          {rootIndex + 1}
                        </td>

                        {/* Label / Title Column */}
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {hasChildren ? (
                              <button
                                type="button"
                                onClick={() => toggleParent(root.id)}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 cursor-pointer shrink-0"
                                aria-label="Toggle children"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-[#842b46] stroke-[2.5]" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-400 stroke-[2.5]" />
                                )}
                              </button>
                            ) : (
                              <div className="w-6 shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <span
                                className="text-sm sm:text-[15px] font-bold text-gray-900 tracking-tight line-clamp-1 block cursor-pointer select-none"
                                onClick={() => hasChildren && toggleParent(root.id)}
                                title={root.label}
                              >
                                {root.label}
                              </span>
                              {root.description && (
                                <span className="text-[11px] text-gray-400 line-clamp-1 block mt-0.5">
                                  {root.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Type Badge Column */}
                        <td className="py-5 px-6 text-center whitespace-nowrap">
                          {getTypeBadge(root.type)}
                        </td>

                        {/* URL Column */}
                        <td
                          className="py-5 px-6 font-mono text-sm text-gray-500 font-normal max-w-[280px] truncate"
                          title={root.url}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="truncate">{root.url}</span>
                            {root.url.startsWith("http") && (
                              <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            )}
                          </span>
                        </td>
                      </tr>

                      {/* Render Children (Level 1: Dropdown Items) */}
                      {isExpanded &&
                        children.map((child, childIndex) => {
                          const subChildren = links
                            .filter((sc) => sc.parent === child.id)
                            .sort((a, b) => (a.order || 0) - (b.order || 0));
                          const hasSubChildren = subChildren.length > 0;
                          const isSubExpanded = !!expandedParents[child.id];

                          return (
                            <React.Fragment key={child.id}>
                              <tr className="bg-[#fcfdff]/70 hover:bg-[#f5f8ff] transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-gray-400 pl-12 whitespace-nowrap">
                                  {rootIndex + 1}.{childIndex + 1}
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-start sm:items-center gap-2.5 pl-6 border-l-2 border-gray-100/60 min-w-0">
                                    {hasSubChildren ? (
                                      <button
                                        type="button"
                                        onClick={() => toggleParent(child.id)}
                                        className="p-1 hover:bg-gray-200/60 rounded-md transition-colors text-gray-400 cursor-pointer shrink-0 mt-0.5 sm:mt-0"
                                        aria-label="Toggle sub-children"
                                      >
                                        {isSubExpanded ? (
                                          <ChevronDown className="w-3.5 h-3.5 text-[#842b46] stroke-[2.5]" />
                                        ) : (
                                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 stroke-[2.5]" />
                                        )}
                                      </button>
                                    ) : (
                                      <span className="text-gray-300 text-sm shrink-0">↳</span>
                                    )}
                                    {child.image && (
                                      <img
                                        src={child.image}
                                        alt=""
                                        className="w-8 h-8 rounded-lg object-cover shrink-0 ring-1 ring-gray-100"
                                      />
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <span
                                        className="font-semibold text-xs sm:text-sm text-gray-800 line-clamp-2 leading-snug block"
                                        title={child.label}
                                      >
                                        {child.label}
                                      </span>
                                      {child.description && (
                                        <span className="text-[11px] text-gray-400 line-clamp-1 block mt-0.5">
                                          {child.description}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-center whitespace-nowrap">
                                  {getTypeBadge(child.type)}
                                </td>
                                <td
                                  className="py-4 px-6 font-mono text-xs text-gray-400 max-w-[280px] truncate"
                                  title={child.url}
                                >
                                  <span className="flex items-center gap-1.5 truncate">
                                    <span className="truncate">{child.url}</span>
                                    {child.url.startsWith("http") && (
                                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    )}
                                  </span>
                                </td>
                              </tr>

                              {/* Render Sub-Children (Level 2 if any) */}
                              {isSubExpanded &&
                                subChildren.map((sub, subIndex) => (
                                  <tr
                                    key={sub.id}
                                    className="bg-[#f8faff]/80 hover:bg-[#eff4fe] transition-colors"
                                  >
                                    <td className="py-3 px-6 text-xs font-medium text-gray-300 pl-16 whitespace-nowrap">
                                      {rootIndex + 1}.{childIndex + 1}.{subIndex + 1}
                                    </td>
                                    <td className="py-3 px-6">
                                      <div className="flex items-center gap-2 pl-12 border-l-2 border-rose-100/50 min-w-0">
                                        <span className="text-gray-300 text-xs shrink-0">↳</span>
                                        <div className="min-w-0 flex-1">
                                          <span
                                            className="font-medium text-xs text-gray-600 line-clamp-2 leading-snug block"
                                            title={sub.label}
                                          >
                                            {sub.label}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-3 px-6 text-center whitespace-nowrap">
                                      {getTypeBadge(sub.type)}
                                    </td>
                                    <td
                                      className="py-3 px-6 font-mono text-[11px] text-gray-400 max-w-[280px] truncate"
                                      title={sub.url}
                                    >
                                      {sub.url}
                                    </td>
                                  </tr>
                                ))}
                            </React.Fragment>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
