"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trophy, Trash2, Edit, Award, Search, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CategoryManager, CategoryItem } from "@/components/CategoryManager";

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterExam, setFilterExam] = useState("All");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [examType, setExamType] = useState("CBSE 10th");
  const [year, setYear] = useState("2024-2025");
  const [percentageOrRank, setPercentageOrRank] = useState("");
  const [campusName, setCampusName] = useState("LFCS Mau");
  const [studentPhoto, setStudentPhoto] = useState("");
  const [stream, setStream] = useState("");

  const loadResults = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/results");
      const json = await res.json();
      if (json.success) setResults(json.data);
    } catch {
      toast.error("Failed to load toppers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const openCreateModal = () => {
    setEditId(null);
    setStudentName("");
    setExamType(categories[0]?.name || "CBSE 10th");
    setYear("2024-2025");
    setPercentageOrRank("");
    setCampusName("LFCS Mau");
    setStudentPhoto("");
    setStream("");
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditId(item.id);
    setStudentName(item.studentName);
    setExamType(item.examType);
    setYear(item.year);
    setPercentageOrRank(item.percentageOrRank);
    setCampusName(item.campusName);
    setStudentPhoto(item.studentPhoto || "");
    setStream(item.stream || "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !percentageOrRank) {
      toast.error("Please enter student name and score");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        studentName,
        examType,
        year,
        percentageOrRank,
        campusName,
        studentPhoto,
        stream,
      };

      const url = editId ? `/api/results/${editId}` : "/api/results";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(editId ? "Topper updated!" : "Topper record added!");
        setModalOpen(false);
        loadResults();
      } else {
        toast.error(json.error || "Failed to save result");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving result");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this topper record?")) return;
    try {
      const res = await fetch(`/api/results/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Topper record removed");
        loadResults();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered =
    filterExam === "All" || filterExam === "ALL"
      ? results
      : results.filter((r) => r.examType.toLowerCase() === filterExam.toLowerCase());

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Board Results & Toppers"
        description="Manage CBSE Class 10th and 12th board toppers, competitive entrance ranks, student photographs, and scores."
        badge="Academic Records"
        action={{
          label: "Add New Topper",
          onClick: openCreateModal,
        }}
      />

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 pb-3">
        <CategoryManager
          type="results"
          activeCategory={filterExam}
          onSelectCategory={setFilterExam}
          onCategoriesChange={setCategories}
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading student merit records...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl p-8 border border-gray-100">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No Topper Records Found</h3>
          <p className="text-xs text-gray-400 mt-1 mb-5">
            Add the first CBSE board topper or competitive ranker.
          </p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#0E5A60] text-white rounded-xl text-xs font-bold"
          >
            + Add Topper
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-[#0E5A60]">
                    {item.examType}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    {item.percentageOrRank}
                  </span>
                </div>

                <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-2 border-[#0E5A60]/20 bg-gray-100">
                  <img
                    src={
                      item.studentPhoto ||
                      `https://api.dicebear.com/7.x/notionists/svg?seed=${item.studentName}`
                    }
                    alt={item.studentName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-bold text-center text-gray-900 text-sm">{item.studentName}</h3>
                <p className="text-center text-xs text-gray-500 font-medium">{item.campusName}</p>
                {item.stream && (
                  <p className="text-center text-[11px] text-gray-400 mt-0.5">
                    {item.stream} Stream
                  </p>
                )}
                <p className="text-center text-[10px] text-gray-400 font-mono mt-1">
                  Batch {item.year}
                </p>
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
                {editId ? "Edit Topper Record" : "Add Board Topper"}
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
                label="Student Full Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Enter student's full name (e.g. Siddhi Vishwakarma)"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 px-0.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                    Exam / Level
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-1 focus:ring-[#0E5A60] outline-none text-gray-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <InputField
                  label="Score / Percentage / Rank"
                  value={percentageOrRank}
                  onChange={(e) => setPercentageOrRank(e.target.value)}
                  placeholder="e.g. 97.4% or AIR 245"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Academic Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2024-2025"
                />
                <InputField
                  label="Campus Name"
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  placeholder="e.g. LFCS Mau / Sikatiya"
                />
              </div>

              <InputField
                label="Stream (Class XII)"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                placeholder="e.g. Science (PCM/PCB) / Commerce"
              />

              <ImagePickerField
                label="Student Passport / Portrait Photo"
                value={studentPhoto}
                onChange={(url) => setStudentPhoto(url)}
                placeholder="e.g. Upload photo to Cloudinary"
              />

              <div className="pt-2">
                <SaveButton loading={saving} label={editId ? "Update Topper" : "Save Topper"} />
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
