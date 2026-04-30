"use client";

import React from "react";
import { Mail, Smartphone, Activity } from "lucide-react";
import { MOCK_LOGS } from "@/lib/mockData";

export default function BridgesPage() {
  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-3 px-4">
          <div className="w-1 h-6 bg-emerald-600 rounded-full" />
          <h2 className="text-xl font-bold text-slate-900">Gestion des Bridges Connecteurs</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BridgeCard 
          icon={<Mail />} 
          title="Bridge E-mail (Resend)" 
          desc="Propulsé par Resend. Scan automatique de votre boîte de réception pour les nouvelles factures."
          status="Actif"
        />
        <BridgeCard 
          icon={<Smartphone />} 
          title="Bridge WhatsApp (Kazi Native)" 
          desc="Protocole Baileys. Envoi direct via votre numéro courtier sans restrictions de templates."
          status="Actif"
        />
      </div>

      <div className="glass-card p-8 rounded-[3rem] space-y-6">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" /> Logs d'activité en temps réel
        </h3>
        <div className="space-y-3 font-mono text-[10px] text-slate-500">
          {MOCK_LOGS.map((log, i) => (
            <p key={i} className="flex gap-4">
              <span className="text-emerald-500">[{log.time}]</span> {log.msg}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function BridgeCard({ icon, title, desc, status }: { icon: React.ReactNode, title: string, desc: string, status: string }) {
  return (
    <div className="glass-card p-10 rounded-[2.5rem] space-y-6 relative overflow-hidden group">
      <div className="flex justify-between items-start relative z-10">
        <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-emerald-500 border border-slate-800 shadow-xl">
          {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8" })}
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-glow" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{status}</span>
        </div>
      </div>
      <div className="relative z-10 space-y-2">
        <h4 className="text-xl font-bold text-slate-900">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      </div>
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
    </div>
  );
}
