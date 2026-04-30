"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Zap, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { icon: LayoutDashboard, label: "Cockpit", href: "/dashboard" },
  { icon: MessageSquare, label: "Studio", href: "/dashboard/studio" },
  { icon: Zap, label: "Bridges", href: "/dashboard/bridges" },
  { icon: Settings, label: "Config", href: "/dashboard/settings" },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 z-[100] lg:hidden pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
      <div className="flex justify-around items-center h-16 px-2">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-all duration-200 active:scale-90",
                isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200",
                isActive ? "scale-110" : "scale-100"
              )} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
