"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { StringListEditor } from "@/components/StringListEditor";
import { SaveButton } from "@/components/SaveButton";

interface CampusFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function CampusForm({ initialData, isEdit = false }: CampusFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(initialData?.name || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [state, setState] = useState(initialData?.state || "Uttar Pradesh");
  const [address, setAddress] = useState(initialData?.address || "");
  const [img, setImg] = useState(initialData?.img || "");
  const [website, setWebsite] = useState(initialData?.website || "");
  const [instagram, setInstagram] = useState(initialData?.instagram || "");
  const [facebook, setFacebook] = useState(initialData?.facebook || "");
  const [youtube, setYoutube] = useState(initialData?.youtube || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [principalName, setPrincipalName] = useState(initialData?.principalName || "");
  const [facilities, setFacilities] = useState<string[]>(
    Array.isArray(initialData?.facilities) ? initialData.facilities : [],
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !address) {
      toast.error("Please fill in the Campus Name, City, and Full Address.");
      return;
    }

    setLoading(true);
    setSaved(false);

    try {
      const url = isEdit ? `/api/campuses/${initialData.id}` : "/api/campuses";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city,
          state,
          address,
          img,
          website,
          instagram,
          facebook,
          youtube,
          phone,
          email,
          principalName,
          facilities,
          isFeatured,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success(isEdit ? "Campus updated successfully!" : "Campus created successfully!");
        router.push("/campuses");
        router.refresh();
      } else {
        toast.error(json.error || "Failed to save campus");
      }
    } catch {
      toast.error("Network error while saving campus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField
          label="Campus Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter official campus name (e.g. LFCS City Campus)..."
          required
        />
        <InputField
          label="City *"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter district or city..."
          required
        />
        <InputField
          label="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Enter state name..."
        />
        <InputField
          label="Principal / Head of Campus"
          value={principalName}
          onChange={(e) => setPrincipalName(e.target.value)}
          placeholder="Enter principal or headmaster name..."
        />
      </div>

      <TextAreaField
        label="Full Campus Address *"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter complete postal address with street, landmark, and pincode..."
        rows={3}
        required
      />

      <ImagePickerField
        label="Campus Photo / Banner"
        value={img}
        onChange={setImg}
        folder="lfcs-school/campuses"
        helperText="Recommended size: 1200x800px. Uploaded photos are automatically converted to optimized WebP format."
      />

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Contact & Online Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Official Website URL"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
          />
          <InputField
            label="Campus Helpline Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter contact number with area code..."
          />
          <InputField
            label="Official Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="campus@domain.edu.in"
          />
          <InputField
            label="Instagram URL"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://instagram.com/username"
          />
          <InputField
            label="Facebook URL"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            placeholder="https://facebook.com/pagename"
          />
          <InputField
            label="YouTube Channel URL"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            placeholder="https://youtube.com/@channelname"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <StringListEditor
          label="Campus Highlights & Facilities"
          items={facilities}
          onChange={setFacilities}
          placeholder="Add highlight (e.g. Robotics Center, Olympic Pool)..."
        />
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <input
          type="checkbox"
          id="featured"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="w-4 h-4 text-[#6a2238] rounded-md border-gray-300 focus:ring-[#6a2238]"
        />
        <label htmlFor="featured" className="text-xs font-semibold text-gray-700 cursor-pointer">
          Feature this campus prominently on the website
        </label>
      </div>

      <div className="pt-4 w-full">
        <SaveButton
          loading={loading}
          saved={saved}
          label={isEdit ? "Update Campus" : "Create Campus"}
        />
      </div>
    </form>
  );
}
