"use client";

import React, { useState, useEffect } from "react";
import { Search, FileText } from "lucide-react";
import { getReminders } from "@/lib/api";

export default function RemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReminders()
      .then(setReminders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-3 px-4">
          <div className="w-1 h-6 bg-emerald-600 rounded-full" />
          <h2 className="text-xl font-bold text-slate-900">Gestion des Relances</h2>
        </div>
        <div className="flex gap-4 px-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un client, une police..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="glass-card overflow-hidden rounded-[2.5rem]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Client / Assureur</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Montant</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Échéance</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reminders.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-900">{item.client_name}</p>
                  <p className="text-xs text-slate-500 font-medium">{item.insurer}</p>
                </td>
                <td className="px-8 py-6 font-mono font-bold text-slate-700">{item.amount.toFixed(2)} €</td>
                <td className="px-8 py-6 text-sm text-slate-500">{item.due_date}</td>
                <td className="px-8 py-6 text-right">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    item.status === 'sent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    item.status === 'drafted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    item.status === 'validated' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                    'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {reminders.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">
                  Aucun rappel trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
