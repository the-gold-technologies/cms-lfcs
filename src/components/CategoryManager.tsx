"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  Settings2,
  Check,
  Loader2,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

export interface CategoryItem {
  id: string;
  name: string;
  order: number;
}

interface CategoryManagerProps {
  type: string; // e.g. "gallery", "testimonials", "results"
  activeCategory: string;
  onSelectCategory: (name: string) => void;
  allowAll?: boolean;
  onCategoriesChange?: (categories: CategoryItem[]) => void;
}

export function CategoryManager({
  type,
  activeCategory,
  onSelectCategory,
  allowAll = true,
  onCategoriesChange,
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  // Inline editing inside modal
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/categories/${encodeURIComponent(type)}`);
      const json = await res.json();
      if (json.success) {
        setCategories(json.data || []);
        onCategoriesChange?.(json.data || []);
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const openModal = (focusInput = false) => {
    setIsModalOpen(true);
    setEditingId(null);
    setEditingName("");
    if (focusInput) {
      setTimeout(() => addInputRef.current?.focus(), 100);
    }
  };

  const closeModal = () => {
    if (addingCategory || savingEdit) return;
    setIsModalOpen(false);
    setEditingId(null);
    setEditingName("");
    setNewCategoryName("");
  };

  // Add new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      toast.error("Category name cannot be empty");
      return;
    }

    setAddingCategory(true);
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(type)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Category "${trimmed}" added!`);
        setNewCategoryName("");
        await fetchCategories();
        onSelectCategory(json.data.name);
      } else {
        toast.error(json.error || "Failed to add category");
      }
    } catch {
      toast.error("Network error while adding category");
    } finally {
      setAddingCategory(false);
    }
  };

  // Start inline rename
  const handleStartRename = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  // Cancel inline rename
  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName("");
  };

  // Save inline rename
  const handleSaveRename = async (cat: CategoryItem) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      toast.error("Category name cannot be empty");
      return;
    }
    if (trimmed === cat.name) {
      handleCancelRename();
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(type)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cat.id,
          name: trimmed,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Category updated to "${trimmed}"`);
        handleCancelRename();
        await fetchCategories();
        if (activeCategory === cat.name) {
          onSelectCategory(json.data.name);
        }
      } else {
        toast.error(json.error || "Failed to update category");
      }
    } catch {
      toast.error("Network error while updating category");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (cat: CategoryItem) => {
    if (
      !confirm(
        `Are you sure you want to delete the category "${cat.name}"? Items linked to this category will remain, but the category tab will be removed.`
      )
    ) {
      return;
    }

    setDeletingId(cat.id);
    try {
      const res = await fetch(
        `/api/categories/${encodeURIComponent(type)}?id=${cat.id}`,
        {
          method: "DELETE",
        }
      );
      const json = await res.json();
      if (json.success) {
        toast.success(`Category "${cat.name}" removed`);
        await fetchCategories();
        if (activeCategory === cat.name) {
          onSelectCategory(allowAll ? "All" : categories[0]?.name || "");
        }
      } else {
        toast.error(json.error || "Failed to delete category");
      }
    } catch {
      toast.error("Network error while deleting category");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading categories...
      </div>
    );
  }

  return (
    <>
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-1">
        {/* Clean Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {allowAll && (
            <button
              type="button"
              onClick={() => onSelectCategory("All")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === "All"
                  ? "bg-[#842b46] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              All
            </button>
          )}

          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#842b46] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Management Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#842b46] bg-[#842b46]/10 hover:bg-[#842b46]/20 border border-[#842b46]/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>

          <button
            type="button"
            onClick={() => openModal(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200/80 hover:text-gray-900 shadow-2xs transition-all cursor-pointer"
            title="Manage and rename categories"
          >
            <Settings2 className="w-3.5 h-3.5 text-gray-500" />
            <span>Manage</span>
          </button>
        </div>
      </div>

      {/* Manage Categories Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#842b46] flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Manage Categories
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Add, rename, or delete categories. Renaming automatically updates all associated items.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={addingCategory || savingEdit}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Add Bar */}
            <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
              <form onSubmit={handleAddCategory} className="flex items-center gap-2">
                <input
                  ref={addInputRef}
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter new category name..."
                  className="flex-1 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#842b46] focus:ring-1 focus:ring-[#842b46] text-gray-800 placeholder:text-gray-400 transition-all"
                />
                <button
                  type="submit"
                  disabled={addingCategory || !newCategoryName.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#842b46] hover:bg-[#6a2238] text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {addingCategory ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>Add</span>
                </button>
              </form>
            </div>

            {/* Category List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                <span>Existing Categories ({categories.length})</span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 divide-y divide-gray-50">
                {categories.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No categories created yet. Type a name above and click Add.
                  </div>
                ) : (
                  categories.map((cat) => {
                    const isEditing = editingId === cat.id;
                    const isDeleting = deletingId === cat.id;

                    return (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        {isEditing ? (
                          // Inline Editing Form
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="text"
                              autoFocus
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveRename(cat);
                                if (e.key === "Escape") handleCancelRename();
                              }}
                              className="flex-1 px-3 py-1.5 bg-white border border-[#842b46] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#842b46] text-gray-800"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveRename(cat)}
                              disabled={savingEdit || !editingName.trim()}
                              className="p-1.5 rounded-lg bg-[#842b46] text-white hover:bg-[#6a2238] transition-colors cursor-pointer disabled:opacity-50"
                              title="Save"
                            >
                              {savingEdit ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelRename}
                              disabled={savingEdit}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          // Normal Display Row
                          <>
                            <div className="flex items-center gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-[#842b46]/40 shrink-0" />
                              <span className="text-xs font-semibold text-gray-800">
                                {cat.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleStartRename(cat)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-gray-500 hover:text-[#842b46] hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Rename category"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Rename</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat)}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                title="Delete category"
                              >
                                {isDeleting ? (
                                  <Loader2 className="w-3 h-3 animate-spin text-red-500" />
                                ) : (
                                  <Trash2 className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
