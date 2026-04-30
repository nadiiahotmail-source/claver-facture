"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MOCK_REMINDERS } from "@/lib/mockData";
import IStudioEditor from "@/components/IStudioEditor";

export default function StudioPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState(MOCK_REMINDERS);
  
  const selectedItem = items.find(r => r.id === selectedId);

  const handleApprove = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, status: 'validated' } : i));
    alert("Dossier validé ! Retrouvez-le dans l'onglet Relances pour l'envoi final.");
  };

  return (
    <div className="p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3 px-4">
          <div className="w-1 h-6 bg-emerald-600 rounded-full" />
          <h1 className="text-3xl font-black text-slate-900 font-display">Studio IA de Rédaction</h1>
        </div>
        <p className="text-slate-500 px-4 font-medium italic">Transformez vos données brutes en communications persuasives.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Selection Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8 space-y-6 border-slate-200">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">File d'attente IA</h4>
            <div className="space-y-3">
              {items.filter(r => r.status !== 'sent' && r.status !== 'validated').map(item => (
                <button 
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all relative overflow-hidden group ${
                    selectedId === item.id 
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-900/20' 
                      : 'bg-white border-slate-100 hover:border-emerald-200 text-slate-900 shadow-sm'
                  }`}
                >
                  <div className="relative z-10">
                    <p className="font-bold text-sm truncate">{item.client_name}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${selectedId === item.id ? 'text-white/70' : 'text-emerald-600'}`}>
                        {item.insurer}
                       </span>
                       <div className={`w-1 h-1 rounded-full ${selectedId === item.id ? 'bg-white/40' : 'bg-slate-200'}`} />
                       <span className={`text-[10px] font-bold ${selectedId === item.id ? 'text-white/50' : 'text-slate-400'}`}>
                        {item.amount}€
                       </span>
                    </div>
                  </div>
                  {selectedId === item.id && (
                    <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full" />
                  )}
                </button>
              ))}
              {items.filter(r => r.status !== 'sent' && r.status !== 'validated').length === 0 && (
                <div className="p-8 text-center text-slate-400 italic text-sm">
                  Tous les dossiers sont validés !
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div 
                key={selectedItem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <IStudioEditor item={selectedItem} onApprove={handleApprove} />
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card h-[700px] rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-8 border-slate-200"
              >
                <div className="w-32 h-32 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center border border-emerald-100 shadow-inner">
                  <Sparkles className="w-16 h-16 text-emerald-600 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-black text-slate-900 font-display">Prêt pour la Magie ?</h3>
                  <p className="text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                    Sélectionnez un dossier dans la file d'attente à gauche pour lancer l'Assistant de Rédaction Kazi IA.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
