"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  TrendingUp, 
  Clock,
  Activity,
  Plus,
  ArrowRightCircle,
  FileText,
  Zap,
  BarChart3,
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { 
  getReminders, 
  getStats, 
  draftReminder, 
  approveReminder, 
  sendReminder 
} from "@/lib/api";
import ValidationTable from "@/components/ValidationTable";
import UploadZone from "@/components/UploadZone";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [realStats, setRealStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [remindersData, statsData] = await Promise.all([
        getReminders(),
        getStats()
      ]);
      setInvoices(remindersData);
      setRealStats(statsData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Échec de la récupération des données.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // KPI Calculations optimisés selon KaziRelance
  const stats = useMemo(() => {
    if (realStats) return {
      recovered: realStats.total_amount,
      clientsEnOrdre: realStats.sent_count,
      clientsSansReponse: realStats.active_reminders - realStats.sent_count, // Simplified
      dossiersClosIA: realStats.sent_count,
      delaiMoyen: "12 jours", // To be calculated on backend later
      tauxReponse: Math.round(realStats.recovery_rate)
    };

    return { recovered: 0, clientsEnOrdre: 0, clientsSansReponse: 0, dossiersClosIA: 0, delaiMoyen: "---", tauxReponse: 0 };
  }, [realStats]);

  const handleDispatch = useCallback(async (id: string) => {
    try {
      await sendReminder(id);
      toast.success("Relance expédiée avec succès.");
      fetchData();
    } catch {
      toast.error("Échec de l'envoi.");
    }
  }, [fetchData]);

  const handleApprove = useCallback(async (id: string) => {
    try {
      await approveReminder(id);
      toast.success("Approuvé.");
      fetchData();
    } catch {
      toast.error("Échec de l'approbation.");
    }
  }, [fetchData]);

  const handleGenerateDraft = useCallback(async (id: string) => {
    try {
      return await draftReminder(id);
    } catch {
      toast.error("Échec de la génération du brouillon.");
      return null;
    }
  }, []);

  const handleMarkPaid = useCallback(async (id: string) => {
    toast.success("Paiement validé manuellement.");
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'resolved' } : inv));
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 font-sans p-4 md:p-10">
      <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Système Opérationnel
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 italic">Centre de Pilotage <span className="text-emerald-600">Agentique</span></h1>
            <p className="text-sm text-slate-500 font-medium italic">Surveillance en temps réel de votre armée de recouvrement.</p>
          </div>
          <div className="flex gap-3">
             <button className="px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 active:scale-95">
               <FileText className="w-4 h-4" /> Rapport Hebdo
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <KpiCard 
              title="Cash Récupéré (Net)" 
              value={`${stats.recovered.toLocaleString('fr-BE')} €`} 
              subtitle="Performance totale via orchestration IA" 
              isPrimary={true}
            />
          </div>
          <KpiCard title="Clients En Ordre" value={stats.clientsEnOrdre} subtitle="Dossiers clos avec succès" />
          <KpiCard title="Taux de Réussite" value={`${stats.tauxReponse}%`} subtitle="Efficacité des agents" trend="+4%" trendPositive={true} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <KpiMini label="Sans Réponse" value={stats.clientsSansReponse} icon={Clock} color="text-amber-500" />
           <KpiMini label="Clôtures IA" value={stats.dossiersClosIA} icon={Zap} color="text-emerald-500" />
           <KpiMini label="Délai Moyen" value={stats.delaiMoyen} icon={Activity} color="text-blue-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Files d'Attente
              </h2>
            </div>
            <div className="flex-1 overflow-x-auto">
              <ValidationTable 
                data={invoices} 
                onDispatch={handleDispatch}
                onGenerateDraft={handleGenerateDraft}
                onApproveDraft={handleApprove}
                onMarkPaid={handleMarkPaid}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Nouvelle Ingestion
              </h3>
              <UploadZone onDataParsed={fetchData} />
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 text-white relative overflow-hidden border border-white/5">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl" />
               <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-8">L'Armée IA Active</h3>
               <div className="space-y-6">
                 <SystemStatus label="Agent Scanner (OCR)" status="Extraction..." icon={BarChart3} />
                 <SystemStatus label="Agent Drafter (Copy)" status="En veille" icon={MessageSquare} />
                 <SystemStatus label="Agent Sentinel (Sec)" status="Actif" icon={ShieldCheck} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const KpiCard = React.memo(({ title, value, subtitle, trend, trendPositive, isPrimary }: any) => (
  <div className={cn(
    "p-8 rounded-[2.5rem] border shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500 group relative overflow-hidden",
    isPrimary ? "bg-slate-900 text-white border-slate-800" : "bg-white border-slate-100 text-slate-900"
  )}>
    {isPrimary && <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />}
    <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isPrimary ? "text-emerald-500" : "text-slate-400")}>{title}</p>
    <div className="mt-6 flex items-baseline gap-3">
      <p className="text-4xl font-black tracking-tighter italic">{value}</p>
      {trend && (
        <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-lg", trendPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500')}>
          {trend}
        </span>
      )}
    </div>
    {subtitle && <p className={cn("text-[11px] mt-4 font-medium italic", isPrimary ? "text-slate-400" : "text-slate-500")}>{subtitle}</p>}
  </div>
));

KpiCard.displayName = "KpiCard";

const KpiMini = React.memo(({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
     <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-slate-50", color)}><Icon className="w-4 h-4" /></div>
        <span className="text-xs font-bold text-slate-500">{label}</span>
     </div>
     <span className="text-sm font-black text-slate-900">{value}</span>
  </div>
));

const SystemStatus = React.memo(({ label, status, icon: Icon }: { label: string, status: string, icon: any }) => (
  <div className="flex justify-between items-center text-sm group">
    <div className="flex items-center gap-3">
       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
          <Icon className="w-4 h-4 text-slate-500 group-hover:text-emerald-500 transition-colors" />
       </div>
       <span className="text-slate-400 font-medium text-[12px]">{label}</span>
    </div>
    <span className="flex items-center gap-2 font-black text-emerald-400 text-[10px] uppercase tracking-widest">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> {status}
    </span>
  </div>
));

SystemStatus.displayName = "SystemStatus";
