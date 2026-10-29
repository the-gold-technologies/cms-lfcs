import Link from "next/link";
import { Loader2 } from "lucide-react";

interface ActivityItem {
  type: string;
  text: string;
  time: string;
}

interface AdminRightSidebarProps {
  stats?: {
    activities?: ActivityItem[];
  };
  loading?: boolean;
}

export function AdminRightSidebar({ stats, loading }: AdminRightSidebarProps) {
  const activities: ActivityItem[] = [
    { type: "enquiry", text: "New admission inquiry for Class XI Science", time: "10m ago" },
    { type: "campus", text: "LFCS Nizamuddinpura campus profile updated", time: "1h ago" },
    { type: "news", text: "Published press article: Super 30 Anand Kumar", time: "3h ago" },
    { type: "gallery", text: "Added 4 photos to Science Labs category", time: "Yesterday" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Dark Promo Card */}
      <div className="bg-[#0B0F29] rounded-[2rem] p-7 text-white relative overflow-hidden shadow-xl">
        {/* Decorative Bubbles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#6a2238]/40 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="flex items-center gap-2 font-bold tracking-tight text-white/90 mb-6">
          <div className="w-6 h-6 rounded-full bg-white text-[#0B0F29] flex items-center justify-center font-serif italic text-sm">
            LF
          </div>
          LFCS CMS Suite
        </div>

        <h2 className="text-[26px] font-black leading-[1.1] mb-3">
          Manage <br />
          Campuses & Leads
        </h2>

        <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-[200px] mb-8">
          Manage 8 school branches, prospective parent inquiries, and franchise proposals
          effortlessly.
        </p>

        <Link
          href="/campuses"
          className="inline-block bg-[#6a2238] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white hover:text-[#6a2238] transition-colors transform hover:scale-105 shadow-[0_0_20px_rgba(106,34,56,0.4)] relative z-10"
        >
          View Campuses
        </Link>

        {/* Illustration */}
        <div className="absolute -bottom-4 right-0 w-36 h-36 opacity-90 pointer-events-none">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=School&backgroundColor=transparent"
            className="w-full h-full object-contain filter drop-shadow-2xl grayscale contrast-125"
            alt="illustration"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="font-bold text-lg text-[#0B0F29]">Recent Activity</h3>
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-50 space-y-4">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-[#842b46] mt-1.5 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 leading-snug">{activity.text}</p>
                <span className="text-[10px] text-gray-400 mt-0.5 block">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
