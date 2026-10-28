"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Trash2,
  X,
  ExternalLink,
  Building,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface SubmissionsTableProps {
  formType: "admissions" | "start-school" | "careers" | "contact";
  title: string;
  description: string;
}

export function SubmissionsTable({ formType, title, description }: SubmissionsTableProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const url = `/api/submissions?formType=${formType}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setSubmissions(json.data || []);
      }
    } catch {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [formType, statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Status updated to ${newStatus}`);
        setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
        if (activeItem?.id === id) {
          setActiveItem({ ...activeItem, status: newStatus });
        }
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/submissions/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Submission deleted");
        setSubmissions((prev) => prev.filter((s) => s.id !== deleteId));
        if (activeItem?.id === deleteId) setActiveItem(null);
        setDeleteId(null);
      }
    } catch {
      toast.error("Failed to delete submission");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = submissions.filter((s) => {
    const term = search.toLowerCase();
    return (
      s.fullName?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.phone?.toLowerCase().includes(term) ||
      s.preferredCampus?.toLowerCase().includes(term) ||
      s.city?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <PageHeader title={title} description={description} />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or campus..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#6a2238] text-gray-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-[#6a2238]"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading submissions...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-gray-500 text-sm">No submissions found matching criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Candidate / Parent</th>
                  <th className="py-3.5 px-6">Contact Info</th>
                  <th className="py-3.5 px-6">Details</th>
                  <th className="py-3.5 px-6">Received On</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{item.fullName}</td>
                    <td className="py-4 px-6 text-gray-600">
                      <div>{item.email}</div>
                      <div className="text-gray-400 font-normal mt-0.5">{item.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {formType === "admissions" && (
                        <div>
                          <span className="font-semibold text-gray-800">
                            Grade: {item.grade || "N/A"}
                          </span>
                          {item.preferredCampus && (
                            <div className="text-gray-400">Campus: {item.preferredCampus}</div>
                          )}
                        </div>
                      )}
                      {formType === "start-school" && (
                        <div>
                          <span className="font-semibold text-gray-800">{item.city}</span>
                          <div className="text-gray-400">
                            Cap: {item.investmentCapacity || "TBD"}
                          </div>
                        </div>
                      )}
                      {formType === "careers" && (
                        <div>
                          <span className="font-semibold text-gray-800">
                            {item.roleOfInterest || item.careerArea}
                          </span>
                          {item.cvUrl && (
                            <a
                              href={item.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#6a2238] font-bold block hover:underline"
                            >
                              CV Attached &rarr;
                            </a>
                          )}
                        </div>
                      )}
                      {formType === "contact" && (
                        <div>
                          <span className="font-semibold text-gray-800">
                            {item.enquiryType || "General"}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-400 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border-0 focus:ring-1 focus:ring-[#6a2238] cursor-pointer ${
                          item.status === "New"
                            ? "bg-amber-50 text-amber-800"
                            : item.status === "Contacted"
                              ? "bg-emerald-50 text-emerald-800"
                              : item.status === "In Review"
                                ? "bg-blue-50 text-blue-800"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="In Review">In Review</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveItem(item)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">{activeItem.fullName}</h3>
                <p className="text-xs text-gray-400">
                  Received on {formatDate(activeItem.createdAt)} &bull; Form: {activeItem.formType}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="text-gray-400 block">Email</span>
                  <a
                    href={`mailto:${activeItem.email}`}
                    className="font-semibold text-[#6a2238] hover:underline"
                  >
                    {activeItem.email}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block">Phone</span>
                  <a href={`tel:${activeItem.phone}`} className="font-semibold text-gray-800">
                    {activeItem.phone || "N/A"}
                  </a>
                </div>
              </div>

              {activeItem.preferredCampus && (
                <div>
                  <span className="text-gray-400 block">Preferred Campus</span>
                  <span className="font-semibold text-gray-800">{activeItem.preferredCampus}</span>
                </div>
              )}

              {activeItem.grade && (
                <div>
                  <span className="text-gray-400 block">Grade / Class</span>
                  <span className="font-semibold text-gray-800">
                    {activeItem.grade} ({activeItem.academicSession || ""})
                  </span>
                </div>
              )}

              {activeItem.city && (
                <div>
                  <span className="text-gray-400 block">Proposed City / Location</span>
                  <span className="font-semibold text-gray-800">
                    {activeItem.city}{" "}
                    {activeItem.proposedLocation ? `(${activeItem.proposedLocation})` : ""}
                  </span>
                </div>
              )}

              {activeItem.investmentCapacity && (
                <div>
                  <span className="text-gray-400 block">Investment Capacity & Land</span>
                  <span className="font-semibold text-gray-800">
                    {activeItem.investmentCapacity} &bull; Land Area: {activeItem.landArea || "N/A"}
                  </span>
                </div>
              )}

              {activeItem.cvUrl && (
                <div className="pt-2">
                  <a
                    href={activeItem.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#6a2238] text-white rounded-xl text-xs font-bold hover:bg-[#521729]"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Candidate CV</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div>
                <span className="text-gray-400 block mb-1">Message / Notes</span>
                <p className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 leading-relaxed">
                  {activeItem.message || "No additional message provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Submission"
        message="Are you sure you want to permanently delete this lead? This cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
