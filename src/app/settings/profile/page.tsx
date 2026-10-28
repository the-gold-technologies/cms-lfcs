"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(json.error || "Password change failed");
      }
    } catch {
      toast.error("Network error updating password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16">
      <PageHeader
        title="Admin Profile & Security"
        description="Update your administrator password and manage account credentials."
      />

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">Account Information</h3>
          <p className="text-xs text-gray-500">
            Logged in as {session?.user?.email || "Administrator"}
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Change Password
          </h4>

          <InputField
            label="Current Password *"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <InputField
            label="New Password *"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <InputField
            label="Confirm New Password *"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="pt-2">
            <SaveButton loading={saving} label="Update Password" />
          </div>
        </form>
      </div>
    </div>
  );
}
