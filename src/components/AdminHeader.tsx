"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  FileText,
  Building,
  Settings,
  Shield,
  Inbox,
  X,
  Newspaper,
  GraduationCap,
  Image as ImageIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SearchItem {
  title: string;
  category: string;
  url: string;
  icon: any;
}

const STATIC_SEARCH_ITEMS: SearchItem[] = [
  { title: "Home Page Sections", category: "Pages", url: "/static-pages/home", icon: FileText },
  { title: "About Us Page", category: "Pages", url: "/static-pages/about", icon: FileText },
  { title: "Academics Page", category: "Pages", url: "/static-pages/academics", icon: FileText },
  { title: "Admissions Page", category: "Pages", url: "/static-pages/admissions", icon: FileText },
  { title: "Our Schools Page", category: "Pages", url: "/static-pages/our-school", icon: FileText },
  { title: "Experience Page", category: "Pages", url: "/static-pages/experience", icon: FileText },
  {
    title: "Start a School Page",
    category: "Pages",
    url: "/static-pages/start-school",
    icon: FileText,
  },
  { title: "Careers Page", category: "Pages", url: "/static-pages/careers", icon: FileText },
  { title: "Contact Us Page", category: "Pages", url: "/static-pages/contact", icon: FileText },
  { title: "News & Events Page", category: "Pages", url: "/static-pages/news-and-events", icon: FileText },
  { title: "All School Campuses", category: "Campuses", url: "/campuses", icon: Building },
  { title: "Add New Campus", category: "Campuses", url: "/campuses/create", icon: Building },
  { title: "News & Media Articles", category: "News", url: "/news", icon: Newspaper },
  { title: "Write News Story", category: "News", url: "/news/create", icon: Newspaper },
  { title: "Photo Gallery", category: "Gallery", url: "/gallery", icon: ImageIcon },
  { title: "Board Results & Toppers", category: "Academics", url: "/results", icon: GraduationCap },
  {
    title: "Admission Enquiries",
    category: "Submissions",
    url: "/submissions/admissions",
    icon: Inbox,
  },
  {
    title: "Start School Inquiries",
    category: "Submissions",
    url: "/submissions/start-school",
    icon: Inbox,
  },
  {
    title: "Career Applications & CVs",
    category: "Submissions",
    url: "/submissions/careers",
    icon: Inbox,
  },
  { title: "General Enquiries", category: "Submissions", url: "/submissions/contact", icon: Inbox },
  {
    title: "Social Media & Helpline",
    category: "Navigation",
    url: "/navigation/social-media",
    icon: Settings,
  },
  { title: "Global SEO", category: "SEO", url: "/seo/global", icon: Shield },
  { title: "Profile Settings", category: "Settings", url: "/settings/profile", icon: Settings },
];

export function AdminHeader() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Admin";
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = STATIC_SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query),
    );
    setResults(filtered);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex justify-between items-center w-full">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0B0F29] flex items-center gap-2">
          Welcome back <span className="text-[#842b46]">{userName}</span>
          <span className="text-2xl animate-bounce origin-bottom-right delay-700">👋</span>
        </h1>

        <div className="h-10 w-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
            alt="Profile Avatar"
            className="h-full w-full object-cover"
          />
        </div>
      </header>

      {/* Global Interactive Search Bar */}
      <div className="relative w-full" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-6 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search pages, campuses, articles, submissions, or SEO settings..."
            className="w-full bg-white pl-14 pr-12 py-4 rounded-3xl border border-gray-100 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#842b46]/20 focus:border-[#842b46] text-gray-800 transition-all placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setResults([]);
              }}
              className="absolute right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                No matching results found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {results.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        router.push(item.url);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-[#842b46]/10 group-hover:text-[#842b46] transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-[#842b46] transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium">{item.category}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gray-400 group-hover:text-[#842b46] transition-colors">
                        Go &rarr;
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
