"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileSpreadsheet, 
  Mail, 
  RefreshCw, 
  Zap, 
  TrendingUp, 
  ShieldCheck,
  Plus,
  Clock,
  Cpu,
  Activity,
  MessageSquare,
  Smartphone
} from "lucide-react";
import { authenticatedFetch } from "@/lib/api";
import { MOCK_REMINDERS, MOCK_LOGS } from "@/lib/mockData";
import BentoCard from "@/components/BentoCard";
import RecoveryChart from "@/components/RecoveryChart";
import UploadZone from "@/components/UploadZone";
import ValidationTable from "@/components/ValidationTable";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Courtier");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchReminders = async () => {
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
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // Calculs Financiers "Business-First"
  const recoveredAmount = invoices.filter(i => i.status === 'sent').reduce((acc, curr) => acc + curr.amount, 0);
  const pipelineAmount = invoices.filter(i => i.status !== 'sent').reduce((acc, curr) => acc + curr.amount, 0);
  const riskAmount = invoices.filter(i => {
    // Simulation du risque : dossiers non envoyés avec montant élevé
    return i.status !== 'sent' && i.amount > 2000;
  }).reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-1000">
      {/* Premium Professional Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-display tracking-tight">
            Contrôle <span className="text-emerald-600">Financier</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">Tableau de bord de recouvrement — {userName}</p>
        </div>
        
        <div className="flex flex-wrap gap-6">
          <KPIItem label="Trésorerie Récupérée" value={recoveredAmount} color="text-emerald-600" />
          <div className="w-px h-12 bg-slate-100 hidden md:block" />
          <KPIItem label="Pipeline Actif" value={pipelineAmount} color="text-slate-900" />
          <div className="w-px h-12 bg-slate-100 hidden md:block" />
          <KPIItem label="Risque d'Impayé" value={riskAmount} color="text-rose-600" />
        </div>
      </header>

      {/* Bento Grid Cockpit */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Recovery Trend (Dominant Card) */}
        <BentoCard 
          gradient 
          className="md:col-span-2 lg:row-span-2 flex flex-col justify-between"
          title="Performance de Recouvrement"
          icon={<TrendingUp className="w-6 h-6" />}
        >
          <div className="space-y-2">
            <h3 className="text-5xl md:text-7xl font-black font-display tracking-tighter">
              {recoveredAmount.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
            </h3>
            <p className="text-emerald-100/60 font-medium text-base md:text-lg italic">Fonds sécurisés ce mois-ci.</p>
          </div>
          <div className="hidden md:block">
            <RecoveryChart />
          </div>
        </BentoCard>

        {/* Action Center / Upload */}
        <BentoCard 
          className="md:col-span-2"
          title="Nouvelle Ingestion"
          icon={<Plus className="w-6 h-6" />}
        >
          <div className="h-full flex flex-col">
            <p className="text-slate-500 text-sm mb-6 font-medium italic">L'intelligence artificielle analyse vos nouvelles primes instantanément.</p>
            <UploadZone onDataParsed={fetchReminders} />
          </div>
        </BentoCard>

        {/* Silent AI Activity (Professional Log) */}
        <BentoCard 
          className="md:col-span-2 lg:col-span-1"
          title="Journal d'Activité"
          icon={<Activity className="w-5 h-5" />}
        >
          <div className="space-y-3 font-mono text-[10px] text-slate-400 max-h-[150px] overflow-y-auto custom-scrollbar">
            {MOCK_LOGS.map((log, i) => (
              <p key={i} className="flex gap-3">
                <span className="text-emerald-500">[{log.time}]</span>
                <span className="opacity-80">{log.msg}</span>
              </p>
            ))}
          </div>
        </BentoCard>

        {/* Global Pipeline Health */}
        <BentoCard 
          className="flex flex-col justify-between"
          title="Santé du Portefeuille"
          icon={<ShieldCheck className="w-5 h-5" />}
        >
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <p className="text-2xl font-black text-slate-900">{invoices.filter(i => i.status !== 'sent').length}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En attente</p>
             </div>
             <div className="w-px h-8 bg-slate-100" />
             <div className="space-y-1 text-right">
                <p className="text-2xl font-black text-emerald-600">{invoices.filter(i => i.status === 'sent').length}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recouvrés</p>
             </div>
          </div>
        </BentoCard>
      </div>

      {/* Actionable Table Section */}
      <section className="space-y-8 pt-4 md:pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display">Actions de Recouvrement Prioritaires</h2>
          </div>
          <button className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline text-left">
            Exporter le rapport complet
          </button>
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-x-auto p-2 border-slate-200">
           <div className="min-w-[800px]">
             <ValidationTable 
                data={invoices.slice(0, 5)} 
                onDispatch={async (id) => {}}
                onGenerateDraft={async (id) => ({ draft: { subject: "", body: "" } })}
                onApproveDraft={async (id) => {}}
                             onMarkPaid={async (id) => {}}
             />
           </div>
        </div>
      </section>
    </div>
  );
}

function KPIItem({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={`text-2xl font-black font-display ${color}`}>
        {value.toLocaleString('fr-BE', { minimumFractionDigits: 0 })} €
      </p>
    </div>
  );
}

