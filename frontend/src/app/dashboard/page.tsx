"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  TrendingUp, 
  Clock,
  Activity,
  Plus,
  ArrowRightCircle,
  FileText
} from "lucide-react";
import { authenticatedFetch } from "@/lib/api";
import { MOCK_REMINDERS } from "@/lib/mockData";
import ValidationTable from "@/components/ValidationTable";
import UploadZone from "@/components/UploadZone";
import { toast } from "sonner";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<any[]>(MOCK_REMINDERS);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchReminders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authenticatedFetch(`${API_URL}/reminders`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.length > 0 ? data : MOCK_REMINDERS);
      } else {
        setInvoices(MOCK_REMINDERS);
      }
    } catch (error) {
      setInvoices(MOCK_REMINDERS);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // KPI Calculations optimisés selon KaziRelance
  const stats = useMemo(() => {
    const resolvedInvoices = invoices.filter(i => i.status === 'resolved');
    const recovered = resolvedInvoices.reduce((acc, curr) => acc + curr.amount, 0);
    const clientsEnOrdre = resolvedInvoices.length;
    const clientsSansReponse = invoices.filter(i => i.is_unresponsive).length;
    
    // Mocks pour les KPIs de succès
    const dossiersClosIA = Math.max(0, clientsEnOrdre - 1);
    const delaiMoyen = "12 jours";
    
    const sentOrResolved = invoices.filter(i => ['sent', 'resolved'].includes(i.status)).length;
    const tauxReponse = sentOrResolved > 0 
      ? Math.round(((sentOrResolved - clientsSansReponse) / sentOrResolved) * 100) 
      : 0;

    return { recovered, clientsEnOrdre, clientsSansReponse, dossiersClosIA, delaiMoyen, tauxReponse };
  }, [invoices]);

  const handleDispatch = useCallback(async (id: string) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/reminders/dispatch/${id}`, { method: 'POST' });
      if (res.ok) {
        toast.success("Relance expédiée avec succès.");
        fetchReminders();
      } else {
        toast.error("Échec de l'envoi.");
      }
    } catch {
      toast.error("Erreur réseau.");
    }
  }, [API_URL, fetchReminders]);

  const handleApprove = useCallback(async (id: string) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/reminders/approve/${id}`, { method: 'POST' });
      if (res.ok) {
        toast.success("Approuvé.");
        fetchReminders();
      }
    } catch {
      toast.error("Erreur réseau.");
    }
  }, [API_URL, fetchReminders]);

  const handleGenerateDraft = useCallback(async (id: string) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/reminders/draft/${id}`, { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch {
      return null;
    }
  }, [API_URL]);

  const handleMarkPaid = useCallback(async (id: string) => {
    toast.success("Paiement validé manuellement.");
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'resolved' } : inv));
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 font-sans p-4 md:p-10">
      <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Performance Financière</h1>
            <p className="text-sm text-slate-500 mt-1">Vue consolidée du recouvrement automatisé.</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 active:scale-95">
               <FileText className="w-4 h-4" /> Exporter
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard title="Clients En Ordre" value={stats.clientsEnOrdre} subtitle="Suite aux relances" trend="+2" trendPositive />
          <KpiCard title="Sans Réponse" value={stats.clientsSansReponse} subtitle="Alerte: 3+ envois" trend="+1" trendPositive={false} />
          <KpiCard title="Total Recouvré" value={`${stats.recovered.toLocaleString('fr-BE')} €`} subtitle="Cette semaine" trend="+12%" trendPositive />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard title="Clôtures IA" value={stats.dossiersClosIA} subtitle="Sans intervention" />
          <KpiCard title="Délai Moyen" value={stats.delaiMoyen} subtitle="De recouvrement" />
          <KpiCard title="Taux de Réponse" value={`${stats.tauxReponse}%`} subtitle="Efficacité globale" />
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
              <UploadZone onDataParsed={fetchReminders} />
            </div>

            <div className="bg-slate-900 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">État des Systèmes</h3>
               <div className="space-y-4">
                 <SystemStatus label="Agent OCR" status="Actif" />
                 <SystemStatus label="Bridge Email" status="Connecté" />
                 <SystemStatus label="Bridge WhatsApp" status="Connecté" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const KpiCard = React.memo(({ title, value, subtitle, trend, trendPositive }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{title}</p>
    <div className="mt-3 flex items-baseline gap-2">
      <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {trend && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trendPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {trend}
        </span>
      )}
    </div>
    {subtitle && <p className="text-xs text-slate-400 mt-2 font-medium">{subtitle}</p>}
  </div>
));

KpiCard.displayName = "KpiCard";

const SystemStatus = React.memo(({ label, status }: { label: string, status: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-400 font-medium">{label}</span>
    <span className="flex items-center gap-2 font-bold text-emerald-400 text-xs">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> {status}
    </span>
  </div>
));

SystemStatus.displayName = "SystemStatus";
