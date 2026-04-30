"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Server, 
  RefreshCw, 
  Database, 
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Settings as SettingsIcon
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    db_status: "online",
    whatsapp_status: "online",
    email_bridge_status: "online",
    total_logs: 1254,
    errors_today: 3,
    api_consumption: "12%"
  });

  const [logs, setLogs] = useState([
    { id: 1, time: "10:45:22", type: "INFO", msg: "Email Bridge: 2 nouveaux dossiers capturés." },
    { id: 2, time: "10:48:05", type: "SUCCESS", msg: "WhatsApp: Relance envoyée à Dubois Bistro." },
    { id: 3, time: "10:52:10", type: "ERROR", msg: "OCR IA: Échec lecture facture_xyz.pdf (Format inconnu)." },
    { id: 4, time: "10:55:00", type: "INFO", msg: "Admin: Modification de la clé Gemini." },
  ]);

  return (
    <div className="p-10 bg-slate-900 min-h-screen text-slate-300 font-sans">
      <header className="flex items-center justify-between mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-emerald-500" />
            ADMIN CONTROL CENTER
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Maintenance & Diagnostics Système</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700">
            <RefreshCw className="w-4 h-4" /> Restart Bridges
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10">
            <SettingsIcon className="w-4 h-4" /> Global Config
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatusCard title="Database" status={stats.db_status} icon={<Database className="w-5 h-5" />} />
        <StatusCard title="WhatsApp Bridge" status={stats.whatsapp_status} icon={<Wifi className="w-5 h-5" />} />
        <StatusCard title="Email Listener" status={stats.email_bridge_status} icon={<Server className="w-5 h-5" />} />
        <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Erreurs IA (24h)</p>
          <h3 className="text-2xl font-black text-red-500">{stats.errors_today}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Terminal Logs */}
        <div className="lg:col-span-2 bg-black/40 rounded-3xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-6 bg-slate-800/30 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" /> System Logs (Live)
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded font-mono">AUTONOMOUS_MODE: ON</span>
          </div>
          <div className="p-6 font-mono text-xs space-y-3 overflow-y-auto h-[400px]">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <span className="text-slate-600">[{log.time}]</span>
                <span className={`font-bold ${
                  log.type === "ERROR" ? "text-red-500" : 
                  log.type === "SUCCESS" ? "text-emerald-500" : "text-blue-500"
                }`}>{log.type}</span>
                <span className="text-slate-400">{log.msg}</span>
              </div>
            ))}
            <div className="flex gap-2 text-emerald-500 animate-pulse">
              <span>_</span>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="space-y-6">
          <section className="bg-slate-800/50 p-8 rounded-3xl border border-slate-800">
            <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> Usage Ressources
            </h4>
            <div className="space-y-4">
              <UsageBar label="Gemini API" percentage={stats.api_consumption} color="bg-emerald-500" />
              <UsageBar label="Stockage DB" percentage="4%" color="bg-blue-500" />
              <UsageBar label="CPU Load" percentage="1.2%" color="bg-slate-500" />
            </div>
          </section>

          <section className="bg-red-500/5 p-8 rounded-3xl border border-red-500/20">
            <h4 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Alertes Critiques
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed italic">
              Aucune alerte critique détectée. Tous les systèmes sont nominaux.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, status, icon }: { title: string, status: string, icon: any }) {
  const isOnline = status === "online";
  return (
    <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOnline ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
          <p className="text-sm font-black text-white">{isOnline ? "OPERATIONAL" : "DOWN"}</p>
        </div>
      </div>
      {isOnline ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
    </div>
  );
}

function UsageBar({ label, percentage, color }: { label: string, percentage: string, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
        <span>{label}</span>
        <span>{percentage}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: percentage }} />
      </div>
    </div>
  );
}
