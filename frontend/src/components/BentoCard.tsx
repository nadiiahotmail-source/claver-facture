"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  gradient?: boolean;
}

export default function BentoCard({ children, className, title, icon, gradient }: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] border border-slate-200/50 p-8 transition-all group",
        gradient ? "emerald-gradient text-white shadow-2xl shadow-emerald-900/20" : "bg-white/70 backdrop-blur-md shadow-sm hover:shadow-xl hover:shadow-emerald-900/5",
        className
      )}
    >
      <div className="relative z-10 flex flex-col h-full">
        {(title || icon) && (
          <div className="flex items-center justify-between mb-6">
            {title && <h3 className={cn("text-xs font-black uppercase tracking-[0.2em]", gradient ? "opacity-60" : "text-slate-400")}>{title}</h3>}
            {icon && <div className={cn("p-2 rounded-xl", gradient ? "bg-white/10" : "bg-emerald-50 text-emerald-600")}>{icon}</div>}
          </div>
        )}
        <div className="flex-1">
          {children}
        </div>
      </div>
      
      {/* Background patterns */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
    </motion.div>
  );
}
