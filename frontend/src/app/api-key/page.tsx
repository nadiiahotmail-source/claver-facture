"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Key, 
  Copy, 
  RefreshCw, 
  Shield, 
  Trash2, 
  CheckCircle2, 
  Zap, 
  MessageSquare, 
  Smartphone, 
  Mail, 
  Settings2,
  ExternalLink,
  Info
} from "lucide-react";
import Link from "next/link";

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState("api");

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-100">
      <nav className="bg-white border-b border-slate-200 px-8 h-20 flex items-center justify-between sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-600/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Kazi<span className="text-emerald-600">Relance</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Système Opérationnel</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500">YA</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-16 px-8 flex flex-col lg:flex-row gap-12">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 space-y-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 pl-4">Configuration</h2>
          <TabButton active={activeTab === "api"} onClick={() => setActiveTab("api")} icon={Key} label="Clés API & IA" />
          <TabButton active={activeTab === "whatsapp"} onClick={() => setActiveTab("whatsapp")} icon={MessageSquare} label="Pont WhatsApp" />
          <TabButton active={activeTab === "sms"} onClick={() => setActiveTab("sms")} icon={Smartphone} label="Passerelle SMS" />
          <TabButton active={activeTab === "email"} onClick={() => setActiveTab("email")} icon={Mail} label="Service Email" />
          <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={Shield} label="Sécurité & Logs" />
        </aside>

        <div className="flex-1 space-y-8">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Centre de Contrôle</h1>
            <p className="text-slate-500 font-medium">Gérez vos intégrations et optimisez les performances de Kazi IA.</p>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === "api" && <ApiConfig key="api" />}
            {activeTab === "whatsapp" && <WhatsAppConfig key="whatsapp" />}
            {/* Add more as needed */}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${
        active ? "bg-white text-emerald-600 shadow-md border border-slate-200" : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? "text-emerald-600" : "text-slate-400"}`} />
      {label}
    </button>
  );
}

function ApiConfig() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-xl shadow-slate-200/40">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Gemini Pro 1.5</h3>
              <p className="text-sm text-slate-400 font-medium italic">Moteur d'extraction et de rédaction</p>
            </div>
          </div>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
            Obtenir une clé <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/60 font-mono text-sm text-slate-600 flex items-center justify-between">
          <span>kz_live_••••••••••••••••••••••••</span>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-emerald-600"><Copy className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ConfigCard title="OCR Pipeline" status="Optimal" icon={Smartphone} />
        <ConfigCard title="IA Générative" status="Prêt" icon={MessageSquare} />
      </div>
    </motion.div>
  );
}

function WhatsAppConfig() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-xl shadow-slate-200/40">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-green-600 fill-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Intégration WhatsApp (Meta)</h3>
            <p className="text-sm text-slate-400 font-medium">Relancez vos clients sur leur messagerie préférée.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Phone Number ID</label>
            <div className="text-sm font-bold text-slate-900">2290142400009</div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Access Token</label>
            <div className="text-sm font-bold text-slate-900">••••••••••••••••••••</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
          <Info className="w-6 h-6 text-blue-500 shrink-0" />
          <div className="text-sm text-blue-800 leading-relaxed">
            <p className="font-bold mb-1">Documentation d'intégration</p>
            Pour connecter votre propre numéro, consultez le <a href="https://developers.facebook.com/docs/whatsapp" className="underline font-black">portail développeur Meta</a>. Vous pouvez également utiliser notre pont natif Baileys pour une configuration sans API officielle.
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ConfigCard({ title, status, icon: Icon }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-slate-400" />
        </div>
        <h4 className="font-bold text-slate-900">{title}</h4>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
        <span className="text-xs font-bold text-slate-500">{status}</span>
      </div>
    </div>
  );
}

import { AnimatePresence } from "framer-motion";
