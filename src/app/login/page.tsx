"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Logged in successfully!");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] font-sans p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#6a2238] flex items-center justify-center text-white font-bold text-2xl shadow-md">
            LF
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Little Flower Schools</h1>
          <p className="text-gray-500 text-xs mt-1">Sign in to LFCS School Management CMS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@lfcs.edu.in"
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#6a2238] text-white rounded-xl font-bold text-sm hover:bg-[#521729] transition-all shadow-md shadow-[#6a2238]/20 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-4">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} Little Flower Group of Schools. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
