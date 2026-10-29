"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, X, Image as ImageIcon } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { ImagePickerField } from "@/components/ImagePickerField";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { CategoryManager, CategoryItem } from "@/components/CategoryManager";

export function GalleryCurateSection() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Photo Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newSrc, setNewSrc] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Deletion Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const url =
        activeCategory === "All"
          ? "/api/gallery"
          : `/api/gallery?category=${encodeURIComponent(activeCategory)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setImages(json.data || []);
      }
    } catch {
      toast.error("Failed to load gallery photos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [activeCategory]);

  useEffect(() => {
    if (categories.length > 0 && !newCategory) {
      setNewCategory(categories[0].name);
    }
  }, [categories, newCategory]);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrc || !newCaption || !newCategory) {
      toast.error("Please provide an image, caption, and select a category.");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: newSrc,
          caption: newCaption,
          category: newCategory,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Photo added to gallery successfully!");
        setModalOpen(false);
        setNewSrc("");
        setNewCaption("");
        fetchImages();
      } else {
        toast.error(json.error || "Failed to add photo");
      }
    } catch {
      toast.error("Network error while adding photo");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/gallery/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Photo removed from gallery");
        setImages((prev) => prev.filter((img) => img.id !== deleteId));
        setDeleteId(null);
      } else {
        toast.error(json.error || "Failed to delete photo");
      }
    } catch {
      toast.error("Network error while deleting photo");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title="2. Photo Gallery Collection & Dynamic Albums"
        description="Live campus photo collection with dynamic category management. Add, edit, or delete categories, and upload or manage photos."
        badge={`${images.length} Photos`}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          {/* Header Bar with Action Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0E5A60] text-white flex items-center justify-center shadow-xs shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Live Campus Photos</h4>
                <p className="text-xs text-gray-500">
                  {activeCategory === "All"
                    ? `Showing all ${images.length} gallery images`
                    : `Showing ${images.length} photos in "${activeCategory}"`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E5A60] hover:bg-[#0A4347] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Photo</span>
            </button>
          </div>

          {/* Dynamic Category Manager (Pills, Add, Edit, Delete) */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Department Categories (Hover to edit / delete)
            </p>
            <CategoryManager
              type="gallery"
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onCategoriesChange={setCategories}
            />
          </div>

          {/* Photo Grid */}
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-xs">Loading gallery photos...</div>
          ) : images.length === 0 ? (
            <div className="py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-8">
              <p className="text-gray-500 text-xs">No photos found in this category.</p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 mt-3 bg-[#0E5A60] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Upload Photo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col"
                >
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150' fill='%23f1f5f9'><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8'>No Image</text></svg>";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-600 hover:text-white rounded-lg text-gray-600 transition-all opacity-0 group-hover:opacity-100 shadow-xs cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-center">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Photo Modal */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-base font-bold text-gray-900">Upload Photo to Gallery</h3>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddImage} className="space-y-4">
                  <ImagePickerField
                    label="Photo File *"
                    value={newSrc}
                    onChange={setNewSrc}
                    folder="lfcs-school/gallery"
                  />

                  <InputField
                    label="Photo Caption / Description *"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="e.g. Physics practical session in senior lab"
                    required
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 tracking-wide">
                      Gallery Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0E5A60] text-gray-800"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 w-full">
                    <SaveButton loading={uploading} label="Add to Gallery" />
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={!!deleteId}
            title="Remove Photo"
            message="Are you sure you want to delete this photo from the gallery? Obsolete storage assets will be cleaned up."
            loading={deleting}
            onConfirm={handleDelete}
            onCancel={() => setDeleteId(null)}
          />
        </div>
      )}
    </div>
  );
}
