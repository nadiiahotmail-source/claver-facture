"use client";

import React, { useState } from "react";
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Mail,
  MessageSquare
} from "lucide-react";
import { getReminders } from "@/lib/api";

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  React.useEffect(() => {
    getReminders().then(data => {
      const sentItems = data.filter((i: any) => i.status === 'sent');
      setHistory(sentItems);
    }).catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <History className="w-8 h-8 text-emerald-600" />
            Historique des Relances
          </h1>
          <p className="text-slate-500 mt-2">Suivez l'état de toutes les notifications envoyées à vos clients.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" /> Filtrer
          </button>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            Exporter (.csv)
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher par client ou assureur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-50">
              <th className="px-8 py-4">Client</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Assureur</th>
              <th className="px-6 py-4">Montant</th>
              <th className="px-6 py-4">Méthode</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {history.filter(i => i.client_name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 text-sm font-bold text-slate-900">{item.client_name}</td>
                <td className="px-6 py-5 text-sm text-slate-500 font-mono">{item.created_at?.split('T')[0]}</td>
                <td className="px-6 py-5 text-sm text-slate-600">{item.insurer}</td>
                <td className="px-6 py-5 text-sm font-bold text-slate-900">{item.amount.toFixed(2)} €</td>
                <td className="px-6 py-5 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-blue-500" />
                    Email
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    item.status === "sent" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    item.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                    "bg-red-50 text-red-700 border-red-100"
                  }`}>
                    {item.status === "sent" && <CheckCircle2 className="w-3 h-3" />}
                    {item.status === "pending" && <Clock className="w-3 h-3" />}
                    {item.status === "failed" && <AlertCircle className="w-3 h-3" />}
                    {item.status === "sent" ? "Envoyé" : item.status === "pending" ? "En attente" : "Échec"}
                  </div>
                </td>
                <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center gap-1">
                    Détails <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
