"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, FileText, CheckCircle2 } from "lucide-react";
import { MOCK_REMINDERS } from "@/lib/mockData";
import IStudioEditor from "@/components/IStudioEditor";

export default function StudioPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState(MOCK_REMINDERS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const selectedItem = items.find(r => r.id === selectedId);
  const pendingItems = items.filter(r => r.status !== 'sent' && r.status !== 'validated');

  const handleApprove = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, status: 'validated' } : i));
    setSelectedId(null); // Return to home screen after validation
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-white border border-slate-200 rounded-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
      </button>

      {/* Sidebar (History/Queue) */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-slate-100 bg-slate-50/50 flex flex-col shrink-0 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" /> File d'attente
              </h2>
              <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                {pendingItems.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
              {pendingItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 relative group flex gap-3 active:scale-[0.98] ${
                    selectedId === item.id 
                      ? 'bg-white shadow-[0_2px_10px_-3px_rgba(6,182,212,0.15)] border-l-4 border-l-emerald-500 border-y border-r border-slate-200' 
                      : 'bg-transparent hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200'
                  }`}
                >
                  {/* Avatar Initials */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                    selectedId === item.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600 group-hover:bg-slate-100'
                  }`}>
                    {item.client_name.substring(0, 2).toUpperCase()}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-bold truncate ${selectedId === item.id ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.client_name}
                      </span>
                      <span className={`text-[10px] font-black tracking-wider ${selectedId === item.id ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {item.amount}€
                      </span>
                    </div>
                    <p className={`text-xs truncate font-medium ${selectedId === item.id ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.insurer} • Échéance: {item.due_date}
                    </p>
                  </div>
                </button>
              ))}
              
              {pendingItems.length === 0 && (
                <div className="p-4 text-center flex flex-col items-center gap-2 text-slate-400 mt-10">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-50" />
                  <p className="text-sm font-medium">Tout est traité !</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat/Editor Area */}
      <div className="flex-1 flex flex-col bg-white relative">
        <AnimatePresence mode="wait">
          {selectedItem ? (
            <motion.div 
              key={selectedItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto"
            >
              <IStudioEditor item={selectedItem} onApprove={handleApprove} />
            </motion.div>
          ) : (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Kazi IA Studio</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-2">
                Sélectionnez un dossier dans la file d'attente pour préparer la relance personnalisée.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
