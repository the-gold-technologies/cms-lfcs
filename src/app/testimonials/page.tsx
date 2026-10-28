"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MessageSquare, Plus, Trash2, Edit, Star, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Parent of Class VIII Student");
  const [category, setCategory] = useState("PARENTS");
  const [text, setText] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  const [rating, setRating] = useState(5);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/testimonials");
      const json = await res.json();
      if (json.success) setTestimonials(json.data);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditId(null);
    setName("");
    setRole("Parent of Class VIII Student");
    setCategory("PARENTS");
    setText("");
    setAvatarImage("");
    setRating(5);
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditId(item.id);
    setName(item.name);
    setRole(item.role);
    setCategory(item.category);
    setText(item.text);
    setAvatarImage(item.avatarImage || "");
    setRating(item.rating || 5);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) {
      toast.error("Please enter reviewer name and feedback text");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        role,
        category,
        text,
        avatarImage,
        rating,
      };

      const url = editId ? `/api/testimonials/${editId}` : "/api/testimonials";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(editId ? "Testimonial updated!" : "Testimonial published!");
        setModalOpen(false);
        loadTestimonials();
      } else {
        toast.error(json.error || "Failed to save testimonial");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Testimonial removed");
        loadTestimonials();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = filterCat === "ALL" ? testimonials : testimonials.filter((t) => t.category === filterCat);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Testimonials & Community Reviews"
        description="Manage verified feedback from parents, alumni, teachers, and students published on the homepage and about page."
        badge="Social Proof"
        action={{
          label: "Add New Testimonial",
          onClick: openCreateModal,
        }}
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {["ALL", "PARENTS", "TEACHERS", "STUDENTS"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterCat(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCat === tab
                ? "bg-[#0E5A60] text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading testimonials...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl p-8 border border-gray-100">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No Testimonials Found</h3>
          <p className="text-xs text-gray-400 mt-1 mb-5">Add the first student, teacher, or parent testimonial.</p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#0E5A60] text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            + Add Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0E5A60]">
                    {item.category}
                  </span>
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 text-xs italic leading-relaxed mb-5">
                  &ldquo;{item.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={
                        item.avatarImage ||
                        `https://api.dicebear.com/7.x/notionists/svg?seed=${item.name}`
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-gray-400 truncate">{item.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100 mt-4">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex-1 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl border border-red-100 hover:bg-red-50 text-red-500 text-xs font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-lg text-gray-900">
                {editId ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <InputField
                label="Reviewer Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Enter parent or student name (e.g. Dr. Rajesh Sharma)"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 px-0.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-1 focus:ring-[#0E5A60] outline-none text-gray-800"
                  >
                    <option value="PARENTS">Parent</option>
                    <option value="TEACHERS">Teacher / Faculty</option>
                    <option value="STUDENTS">Student / Alumnus</option>
                  </select>
                </div>

                <InputField
                  label="Role / Designation"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Parent of Class X Student"
                />
              </div>

              <TextAreaField
                label="Review / Testimonial Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder="e.g. Enter genuine feedback praising academic or campus life..."
                required
              />

              <ImagePickerField
                label="Reviewer Avatar / Photo"
                value={avatarImage}
                onChange={(url) => setAvatarImage(url)}
                placeholder="e.g. Upload photo to Cloudinary"
              />

              <div className="pt-2">
                <SaveButton loading={saving} label={editId ? "Update Testimonial" : "Publish Testimonial"} />
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
