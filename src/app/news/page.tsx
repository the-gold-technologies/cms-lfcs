"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { Plus, Edit2, Trash2, Calendar, ExternalLink, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/news");
      const json = await res.json();
      if (json.success) {
        setNews(json.data || []);
      }
    } catch {
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/news/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("News item deleted successfully");
        setNews((prev) => prev.filter((n) => n.id !== deleteId));
        setDeleteId(null);
      } else {
        toast.error(json.error || "Failed to delete news item");
      }
    } catch {
      toast.error("Delete operation failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <PageHeader
        title="News & Press Publications"
        description="Manage media features, inauguration coverage, and public announcements."
        actions={
          <Link
            href="/news/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6a2238] text-white rounded-xl text-xs font-bold hover:bg-[#521729] transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Article</span>
          </Link>
        }
      />

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading articles...</div>
      ) : news.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-gray-500 text-sm">No articles or press releases published yet.</p>
          <Link
            href="/news/create"
            className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-[#6a2238] text-white rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> Publish First Article
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full bg-gray-100 relative overflow-hidden">
                  <img
                    src={item.img || "/news-&-events/school-associate-launch.webp"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200' fill='%23f1f5f9'><rect width='400' height='200'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8'>No Image</text></svg>";
                    }}
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-gray-800 shadow-xs">
                    {item.source}
                  </div>
                  {item.isFeaturedHome && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#6a2238] text-white flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" /> Home Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-semibold mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#6a2238] font-semibold flex items-center gap-1 mt-4 hover:underline"
                  >
                    <span>Read on {item.source}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50/50">
                <Link
                  href={`/news/edit/${item.id}`}
                  className="p-2 text-gray-500 hover:text-[#6a2238] hover:bg-white rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete News Article"
        message="Are you sure you want to delete this press article? This action is permanent."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
