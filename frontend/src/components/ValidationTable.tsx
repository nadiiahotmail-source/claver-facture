"use client";

import React, { useState, useMemo, useCallback } from "react";
import { 
  CheckCircle2, 
  Send, 
  Eye,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Bot,
  Euro,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ValidationTableProps {
  data: any[];
  onDispatch: (id: string) => void;
  onGenerateDraft: (id: string) => Promise<any>;
  onApproveDraft: (id: string) => Promise<any>;
  onMarkPaid: (id: string) => void;
}

export default function ValidationTable({ data, onDispatch, onGenerateDraft, onApproveDraft, onMarkPaid }: ValidationTableProps) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const currentIndex = useMemo(() => 
    selectedItem ? data.findIndex(i => i.id === selectedItem.id) : -1
  , [data, selectedItem]);

  const hasNext = currentIndex >= 0 && currentIndex < data.length - 1;
  const hasPrev = currentIndex > 0;

  const openModal = useCallback(async (item: any) => {
    setSelectedItem(item);
    if (!item.email_body) {
      setIsRegenerating(true);
      const res = await onGenerateDraft(item.id);
      if (res && res.draft) {
        setEmailSubject(res.draft.subject);
        setEmailBody(res.draft.body);
      } else {
        setEmailSubject(item.email_subject || "");
        setEmailBody(item.email_body || "");
      }
      setIsRegenerating(false);
    } else {
      setEmailSubject(item.email_subject || "");
      setEmailBody(item.email_body || "");
    }
  }, [onGenerateDraft]);

  const handleRegenerate = useCallback(async () => {
    if (!selectedItem) return;
    setIsRegenerating(true);
    toast.info("Génération du brouillon...");
    const res = await onGenerateDraft(selectedItem.id);
    if (res && res.draft) {
      setEmailSubject(res.draft.subject);
      setEmailBody(res.draft.body);
    }
    setIsRegenerating(false);
  }, [selectedItem, onGenerateDraft]);

  const handleApprove = useCallback(async () => {
    if (!selectedItem) return;
    await onApproveDraft(selectedItem.id);
    
    if (hasNext) {
      toast.success("Dossier validé, suivant...");
      openModal(data[currentIndex + 1]);
    } else {
      toast.success("Traitement terminé.");
      setSelectedItem(null);
    }
  }, [selectedItem, onApproveDraft, hasNext, data, currentIndex, openModal]);

  if (data.length === 0) {
    return (
      <div className="p-10 text-center text-slate-400 text-xs font-medium italic">
        Aucun dossier en attente.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* DESKTOP VIEW */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-black">
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Assureur</th>
              <th className="px-6 py-4">Montant</th>
              <th className="px-6 py-4">Échéance</th>
              <th className="px-6 py-4">Cycle</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {data.map((item) => (
              <TableRow 
                key={item.id} 
                item={item} 
                onOpen={() => openModal(item)} 
                onDispatch={() => onDispatch(item.id)}
                onMarkPaid={() => onMarkPaid(item.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {data.map((item) => (
          <MobileCard 
            key={item.id} 
            item={item} 
            onOpen={() => openModal(item)} 
            onDispatch={() => onDispatch(item.id)} 
            onMarkPaid={() => onMarkPaid(item.id)}
          />
        ))}
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-end lg:items-center justify-center p-0 lg:p-4 bg-slate-950/20 backdrop-blur-sm transition-all">
          <div className="bg-white w-full h-[90vh] lg:h-auto lg:max-w-2xl lg:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <Bot className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-900 text-sm">{selectedItem.client_name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dossier {currentIndex + 1}/{data.length}</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => hasPrev && openModal(data[currentIndex - 1])} disabled={!hasPrev} className="p-2 hover:bg-slate-50 disabled:opacity-20 transition-colors border-r border-slate-100"><ChevronLeft className="w-5 h-5" /></button>
                  <button onClick={() => hasNext && openModal(data[currentIndex + 1])} disabled={!hasNext} className="p-2 hover:bg-slate-50 disabled:opacity-20 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-xl transition-colors ml-2"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sujet de la relance</label>
                     <button onClick={handleRegenerate} disabled={isRegenerating} className="text-[10px] text-emerald-600 font-black flex items-center gap-1.5 hover:underline disabled:opacity-50">
                        <RefreshCw className={cn("w-3 h-3", isRegenerating && "animate-spin")} /> Régénérer
                     </button>
                  </div>
                  <input 
                    type="text" 
                    value={emailSubject} 
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full text-sm font-bold border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all bg-slate-50/50"
                  />
               </div>

               <div className="space-y-3 flex-1 flex flex-col">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Message personnalisé</label>
                  <div className="relative flex-1 min-h-[200px]">
                    {isRegenerating && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-emerald-600 rounded-2xl">
                        <LoaderIcon className="w-8 h-8 animate-spin" />
                      </div>
                    )}
                    <textarea 
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full h-full text-sm font-medium border border-slate-200 rounded-3xl p-5 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all resize-none leading-relaxed text-slate-700 bg-slate-50/50"
                    />
                  </div>
               </div>
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex gap-4 bg-slate-50/30">
              <button 
                onClick={handleApprove}
                disabled={isRegenerating}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                Approuver {hasNext && "& Suivant"} <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TableRow = React.memo(({ item, onOpen, onDispatch, onMarkPaid }: any) => (
  <tr className="hover:bg-slate-50/50 transition-colors group">
    <td className="px-6 py-4">
      <div className="font-bold text-slate-900 flex items-center gap-2">
        {item.client_name}
        {item.client_type && (
          <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
            {item.client_type}
          </span>
        )}
      </div>
      {item.is_unresponsive && (
        <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> Intervention requise
        </span>
      )}
    </td>
    <td className="px-6 py-4 text-slate-500 font-medium">{item.insurer}</td>
    <td className="px-6 py-4 font-bold text-slate-900">{item.amount.toLocaleString('fr-BE')} €</td>
    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{item.due_date}</td>
    <td className="px-6 py-4">
      {item.phase && <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">Phase {item.phase}</span>}
    </td>
    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
    <td className="px-6 py-4 text-right">
      <div className="flex items-center justify-end gap-2">
        <button onClick={onMarkPaid} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Marquer comme payé"><CheckCircle2 className="w-5 h-5" /></button>
        <button onClick={onOpen} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Réviser"><Eye className="w-5 h-5" /></button>
        <button onClick={onDispatch} disabled={item.status === 'sent' || item.status === 'resolved'} className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-20 rounded-xl text-xs font-bold transition-all flex items-center gap-2">Envoyer <Send className="w-3 h-3" /></button>
      </div>
    </td>
  </tr>
));

TableRow.displayName = "TableRow";

const MobileCard = React.memo(({ item, onOpen, onDispatch, onMarkPaid }: any) => (
  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          {item.client_name}
          {item.client_type && <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">{item.client_type}</span>}
        </h4>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.insurer} {item.phase && `• Phase ${item.phase}`}</p>
        {item.is_unresponsive && (
          <p className="text-[10px] font-bold text-red-600 flex items-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> Intervention requise
          </p>
        )}
      </div>
      <StatusBadge status={item.status} />
    </div>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="flex items-center gap-2 text-slate-500 font-bold"><Euro className="w-3 h-3" /> {item.amount.toLocaleString('fr-BE')} €</div>
      <div className="flex items-center gap-2 text-slate-400"><Calendar className="w-3 h-3" /> {item.due_date}</div>
    </div>
    <div className="flex gap-2 pt-1">
      <button onClick={onMarkPaid} className="py-3 px-3 bg-slate-100 text-emerald-600 rounded-2xl flex items-center justify-center active:scale-95 transition-all"><CheckCircle2 className="w-4 h-4" /></button>
      <button onClick={onOpen} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"><Eye className="w-4 h-4" /> Réviser</button>
      <button onClick={onDispatch} disabled={item.status === 'sent' || item.status === 'resolved'} className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"><Send className="w-4 h-4" /> Envoyer</button>
    </div>
  </div>
));

MobileCard.displayName = "MobileCard";

function StatusBadge({ status }: { status: string }) {
  const config = {
    'sent': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'validated': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'drafted': 'bg-amber-50 text-amber-700 border-amber-100',
    'pending': 'bg-slate-100 text-slate-600 border-slate-200',
  }[status] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", config)}>
      {status === 'sent' ? 'Expédié' : status === 'validated' ? 'Prêt' : status === 'drafted' ? 'Brouillon' : status === 'resolved' ? 'Réglé' : 'À traiter'}
    </span>
  );
}

const LoaderIcon = ({ className }: { className?: string }) => (
  <svg className={cn("animate-spin", className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
