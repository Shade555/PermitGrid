"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Calendar, 
  Settings,
  Bell,
  Search
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: CheckSquare, label: "Approval Grid", href: "/dashboard/grid" },
  { icon: FileText, label: "Document Center", href: "/dashboard/documents" },
  { icon: Building2, label: "Application Tracker", href: "/dashboard/tracker" },
  { icon: Calendar, label: "Compliance Calendar", href: "/dashboard/calendar" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [businessData, setBusinessData] = useState({ name: "Nova Foods Pvt Ltd", location: "Pune, Maharashtra" });
  const [initials, setInitials] = useState("NF");

  useEffect(() => {
    // Load Business Profile
    const savedProfile = localStorage.getItem("permitgrid_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setBusinessData({
          name: parsed.business_name || "Nova Foods Pvt Ltd",
          location: `${parsed.district || "Pune"}, ${parsed.state || "Maharashtra"}`
        });
      } catch (e) {
        console.error(e);
      }
    }

    // Load User Initials
    const userName = localStorage.getItem("permitgrid_user_name");
    if (userName) {
      const parts = userName.trim().split(" ");
      if (parts.length > 1) {
        setInitials((parts[0][0] + parts[1][0]).toUpperCase());
      } else {
        setInitials(parts[0].substring(0, 2).toUpperCase());
      }
    } else {
      // Fallback to business initials
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.business_name) {
            const parts = parsed.business_name.trim().split(" ");
            if (parts.length > 1) {
              setInitials((parts[0][0] + parts[1][0]).toUpperCase());
            }
          }
        } catch (e) {}
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-background border-r border-border flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">PermitGrid</span>
          </Link>
        </div>
        
        <div className="p-4 flex-1">
          <div className="mb-6 px-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Business</div>
            <div className="font-medium text-sm line-clamp-1" title={businessData.name}>{businessData.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">{businessData.location}</div>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-border mt-auto">
          <button 
            onClick={() => {
              localStorage.removeItem("permitgrid_user_name");
              localStorage.removeItem("permitgrid_profile");
              localStorage.removeItem("permitgrid_approvals");
              window.location.href = "/";
            }}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search approvals, documents, schemes..." className="pl-9 bg-muted/50 border-none focus-visible:ring-1" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border border-background"></span>
            </button>
            <Link href="/dashboard/settings">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-medium text-primary cursor-pointer hover:bg-primary/30 transition-colors">
                {initials}
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
