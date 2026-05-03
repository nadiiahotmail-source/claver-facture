"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Settings as SettingsIcon,
  Lock,
  Calendar,
  User,
  Mail,
  Smartphone,
  ExternalLink,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStats, authenticatedFetch } from "@/lib/api";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_amount: 0,
    active_reminders: 0,
    pending_validation: 0,
    sent_count: 0,
    recovery_rate: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [logs, setLogs] = useState([
    { id: 1, time: "18:40:22", type: "INFO", msg: "Admin Hub: Nouveau déploiement détecté." },
    { id: 2, time: "18:42:05", type: "SUCCESS", msg: "System: Base de données connectée." },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "KaziDev2026!") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
    } else {
      setError("Mot de passe incorrect");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsData = await getStats();
      setStats(statsData);
      
      const apptsRes = await authenticatedFetch("/admin/appointments");
      if (apptsRes.ok) {
        const apptsData = await apptsRes.json();
        setAppointments(apptsData);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-900 rounded-[3rem] p-12 border border-slate-800 shadow-2xl"
        >
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="w-20 h-20 bg-emerald-600/10 rounded-[2rem] flex items-center justify-center border border-emerald-500/20">
              <Lock className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Mission Control</h1>
              <p className="text-slate-500 text-sm font-medium italic">Accès restreint aux administrateurs KaziRelance.</p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <input 
                autoFocus
                type="password"
                placeholder="Entrez le code d'accès"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full bg-slate-800 border-2 border-slate-800 rounded-2xl px-6 py-4 text-center text-white font-bold tracking-[0.5em] focus:border-emerald-600 outline-none transition-all"
              />
              {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>}
              <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95">
                Déverrouiller
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-slate-950 min-h-screen text-slate-300 font-sans">
      <header className="flex items-center justify-between mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-emerald-500" />
            MISSION CONTROL
          </h1>
          <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-[0.3em] font-black">Autonomous Agentic Hub v2.0</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchData}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-slate-800"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync Data
          </button>
          <button 
            onClick={() => { localStorage.removeItem("admin_auth"); setIsAuthenticated(false); }}
            className="bg-red-600/10 hover:bg-red-600/20 text-red-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatusCard title="Backend API" status="online" icon={<Server className="w-5 h-5" />} />
        <StatusCard title="Reminders" count={stats.active_reminders} icon={<Activity className="w-5 h-5" />} color="text-blue-500" />
        <StatusCard title="Pending" count={stats.pending_validation} icon={<AlertTriangle className="w-5 h-5" />} color="text-orange-500" />
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Recovery Rate</p>
          <h3 className="text-2xl font-black text-emerald-500">{stats.recovery_rate}%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Appointments List */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-slate-900 rounded-[3rem] border border-slate-800 overflow-hidden">
              <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4 text-emerald-500" /> Rendez-vous Entrants
                </h3>
                <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full uppercase tracking-widest">
                  {appointments.length} Leads
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/50">
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Client / Agence</th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact</th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Date & Heure</th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {appointments.map((appt: any) => (
                      <tr key={appt.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-bold text-white">{appt.client_name}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Mail className="w-3 h-3" /> {appt.client_email}
                              </div>
                              {appt.client_phone && (
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                                  <Smartphone className="w-3 h-3" /> {appt.client_phone}
                                </div>
                              )}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="text-xs font-black text-emerald-500">{appt.appointment_date}</div>
                           <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{appt.appointment_time}</div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[9px] font-black px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded uppercase tracking-[0.2em]">
                             {appt.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-slate-500 italic text-sm">
                          Aucun rendez-vous pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
           </div>
        </div>

        {/* Right: Logs & Quick Actions */}
        <div className="lg:col-span-4 space-y-8">
           <section className="bg-slate-900 rounded-[3rem] border border-slate-800 p-8 space-y-8">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" /> Logs Systèmes
              </h3>
              <div className="space-y-4 font-mono text-[11px]">
                 {logs.map(log => (
                   <div key={log.id} className="flex gap-3 leading-relaxed">
                      <span className="text-slate-600">[{log.time}]</span>
                      <span className={log.type === "SUCCESS" ? "text-emerald-500" : "text-blue-500"}>{log.type}</span>
                      <span className="text-slate-400">{log.msg}</span>
                   </div>
                 ))}
                 <div className="animate-pulse text-emerald-500">_</div>
              </div>
           </section>

           <section className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-600/10 space-y-8 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2">Production</h3>
                <p className="text-emerald-100 text-xs font-medium italic mb-8 leading-relaxed">
                  Accédez au cockpit client pour gérer les dossiers de relance.
                </p>
                <Link 
                  href="/dashboard"
                  className="bg-white text-emerald-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-xl shadow-emerald-900/20"
                >
                  Accéder au Cockpit <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
           </section>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, status, count, icon, color = "text-emerald-500" }: any) {
  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
          <p className="text-sm font-black text-white">{status ? status.toUpperCase() : count}</p>
        </div>
      </div>
      <CheckCircle2 className={`w-4 h-4 ${color}`} />
    </div>
  );
}
