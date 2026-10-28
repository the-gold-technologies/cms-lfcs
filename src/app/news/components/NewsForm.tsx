"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface NewsFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [source, setSource] = useState(initialData?.source || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [img, setImg] = useState(initialData?.img || "");
  const [isFeaturedHome, setIsFeaturedHome] = useState<boolean>(
    initialData?.isFeaturedHome ?? false,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !date || !source || !url) {
      toast.error("Please fill in Title, Excerpt, Date, Source, and URL.");
      return;
    }

    setLoading(true);
    setSaved(false);

    try {
      const endpoint = isEdit ? `/api/news/${initialData.id}` : "/api/news";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          date,
          source,
          url,
          img,
          isFeaturedHome,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success(isEdit ? "Article updated successfully!" : "Article published successfully!");
        router.push("/news");
        router.refresh();
      } else {
        toast.error(json.error || "Failed to save article");
      }
    } catch {
      toast.error("Network error while saving article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs space-y-6"
    >
      <InputField
        label="Article Headline / Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter news headline or publication title..."
        required
      />

      <TextAreaField
        label="Summary / Excerpt *"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Enter short summary displayed on news cards..."
        rows={3}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <InputField
          label="Publication Date *"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Enter publication date (e.g. 09 Oct 2026)..."
          required
        />
        <InputField
          label="Media Outlet / Source *"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Enter media source name (e.g. Dailyhunt, The Times of India)..."
          required
        />
        <InputField
          label="Full Article Link / External URL *"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://news-outlet.com/article"
          required
        />
      </div>

      <ImagePickerField
        label="Featured Article Photo"
        value={img}
        onChange={setImg}
        folder="lfcs-school/news"
        helperText="Card thumbnail photo. Auto-converted to WebP."
      />

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <input
          type="checkbox"
          id="featuredHome"
          checked={isFeaturedHome}
          onChange={(e) => setIsFeaturedHome(e.target.checked)}
          className="w-4 h-4 text-[#6a2238] rounded-md border-gray-300 focus:ring-[#6a2238]"
        />
        <label
          htmlFor="featuredHome"
          className="text-xs font-semibold text-gray-700 cursor-pointer"
        >
          Feature as primary highlighted story on the Home Page
        </label>
      </div>

      <div className="pt-4 max-w-xs">
        <SaveButton
          loading={loading}
          saved={saved}
          label={isEdit ? "Update Article" : "Publish Article"}
        />
      </div>
    </form>
  );
}
