"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Edit2, Check, Loader2 } from "lucide-react";
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

  // Adding new category state
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [savingAdd, setSavingAdd] = useState(false);

  // Editing category state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Deleting category state
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSavingAdd(true);
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(type)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Category "${newCategoryName.trim()}" added!`);
        setNewCategoryName("");
        setIsAdding(false);
        fetchCategories();
        onSelectCategory(json.data.name);
      } else {
        toast.error(json.error || "Failed to add category");
      }
    } catch {
      toast.error("Network error adding category");
    } finally {
      setSavingAdd(false);
    }
  };

  const startEdit = (cat: CategoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = async (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(type)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: editName.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Category renamed successfully!");
        setEditingId(null);
        fetchCategories();
        if (activeCategory === json.data.name) {
          onSelectCategory(json.data.name);
        }
      } else {
        toast.error(json.error || "Failed to rename category");
      }
    } catch {
      toast.error("Network error renaming category");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteCategory = async (cat: CategoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete the category "${cat.name}"?`)) {
      return;
    }

    setDeletingId(cat.id);
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(type)}?id=${cat.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Category "${cat.name}" removed`);
        fetchCategories();
        if (activeCategory === cat.name) {
          onSelectCategory(allowAll ? "All" : categories[0]?.name || "");
        }
      } else {
        toast.error(json.error || "Failed to delete category");
      }
    } catch {
      toast.error("Network error deleting category");
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
    <div className="flex flex-wrap items-center gap-2 py-1">
      {/* "All" Filter Pill */}
      {allowAll && (
        <button
          type="button"
          onClick={() => onSelectCategory("All")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === "All"
              ? "bg-[#0E5A60] text-white shadow-xs"
              : "bg-gray-50 text-gray-600 border border-gray-200/60 hover:bg-gray-100"
          }`}
        >
          All
        </button>
      )}

      {/* Dynamic Category Pills */}
      {categories.map((cat) => {
        const isEditing = editingId === cat.id;
        const isActive = activeCategory === cat.name;

        if (isEditing) {
          return (
            <form
              key={cat.id}
              onSubmit={(e) => handleSaveEdit(cat.id, e)}
              className="inline-flex items-center gap-1 bg-white border border-[#0E5A60] rounded-xl px-2 py-1 shadow-xs"
            >
              <input
                type="text"
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-xs font-medium text-gray-800 outline-none w-28 bg-transparent"
              />
              <button
                type="submit"
                disabled={savingEdit}
                className="p-1 text-emerald-600 hover:text-emerald-700"
                title="Save"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Cancel"
              >
                <X className="w-3 h-3" />
              </button>
            </form>
          );
        }

        return (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.name)}
            className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none ${
              isActive
                ? "bg-[#0E5A60] text-white shadow-xs"
                : "bg-gray-50 text-gray-600 border border-gray-200/60 hover:bg-gray-100"
            }`}
          >
            <span>{cat.name}</span>

            {/* Quick Action Buttons on Pill */}
            <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5">
              <button
                type="button"
                onClick={(e) => startEdit(cat, e)}
                className={`p-0.5 rounded hover:bg-black/10 transition-colors ${
                  isActive ? "text-white/80 hover:text-white" : "text-gray-400 hover:text-gray-700"
                }`}
                title="Rename category"
              >
                <Edit2 className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                onClick={(e) => handleDeleteCategory(cat, e)}
                disabled={deletingId === cat.id}
                className={`p-0.5 rounded hover:bg-red-500 hover:text-white transition-colors ${
                  isActive ? "text-white/80" : "text-gray-400"
                }`}
                title="Delete category"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        );
      })}

      {/* Inline "+ Add Category" Pill */}
      {isAdding ? (
        <form
          onSubmit={handleAddCategory}
          className="inline-flex items-center gap-1.5 bg-white border border-[#0E5A60] rounded-xl px-2.5 py-1 shadow-xs"
        >
          <input
            type="text"
            autoFocus
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New Category..."
            className="text-xs font-medium text-gray-800 outline-none w-32 bg-transparent placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={savingAdd || !newCategoryName.trim()}
            className="p-1 text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
            title="Add"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewCategoryName("");
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0E5A60] border border-dashed border-[#0E5A60]/40 hover:border-[#0E5A60] hover:bg-teal-50/50 transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>Add Category</span>
        </button>
      )}
    </div>
  );
}

