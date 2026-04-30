"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings, 
  Zap, 
  ShieldCheck,
  ChevronLeft,
  Mail,
  Smartphone,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Cockpit", href: "/dashboard" },
  { icon: FileText, label: "Gestion Relances", href: "/dashboard/reminders" },
  { icon: MessageSquare, label: "Studio IA", href: "/dashboard/studio" },
  { icon: BarChart3, label: "Analyses", href: "/dashboard/insights" },
  { icon: Zap, label: "Bridges", href: "/dashboard/bridges" },
  { icon: Settings, label: "Configuration", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-slate-950 border-r border-slate-900 flex flex-col z-50">
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-900/40 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white font-display">
            Kazi<span className="text-emerald-500">Relance</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4 pl-4">Menu Principal</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm transition-all group relative active:scale-95",
                isActive ? "text-white bg-emerald-600/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full"
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-emerald-500" : "text-slate-500 group-hover:text-emerald-400"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="bg-slate-900/50 rounded-[2rem] p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">IA Active</p>
              <p className="text-[10px] text-slate-500">Protection Kazi 2.0</p>
            </div>
          </div>
          <Link href="/dashboard" className="block w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-center text-white transition-all">
            Dashboard Direct
          </Link>
        </div>
      </div>
    </aside>
  );
}
