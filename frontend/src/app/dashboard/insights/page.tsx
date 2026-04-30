"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, PieChart } from "lucide-react";
import { getStats } from "@/lib/api";

export default function InsightsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-3 px-4">
          <div className="w-1 h-6 bg-emerald-600 rounded-full" />
          <h2 className="text-xl font-bold text-slate-900">Analyses de Performance</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          icon={<TrendingUp />} 
          title="Taux de Récupération" 
          value={stats ? `${Math.round(stats.recovery_rate)}%` : "---"} 
          trend={stats ? `+${Math.round(stats.recovery_rate / 10)}%` : ""} 
        />
        <StatCard 
          icon={<BarChart3 />} 
          title="Factures Envoyées" 
          value={stats ? stats.sent_count : "0"} 
          trend="Réel" 
        />
        <StatCard 
          icon={<PieChart />} 
          title="Montant Total" 
          value={stats ? `${stats.total_amount.toLocaleString()} €` : "0 €"} 
          trend="Consolidé" 
        />
      </div>

      <div className="glass-card h-96 rounded-[3rem] flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest italic text-sm">
        Graphique d'évolution bientôt disponible
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend }: { icon: React.ReactNode, title: string, value: string, trend: string }) {
  return (
    <div className="glass-card p-8 rounded-[2.5rem] space-y-4">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
          {icon}
        </div>
        <span className="text-[10px] font-black text-emerald-500 uppercase">{trend}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-4xl font-black text-slate-900 font-display mt-2">{value}</h3>
      </div>
    </div>
  );
}
