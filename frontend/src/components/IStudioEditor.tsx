"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  FileText, 
  RefreshCw,
  X,
  Bot
} from "lucide-react";

interface StudioEditorProps {
  item: any;
  onApprove: (id: string) => void;
}

export default function IStudioEditor({ item, onApprove }: StudioEditorProps) {
  const [subject, setSubject] = useState(item.email_subject || "");
  const [body, setBody] = useState(item.email_body || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  // Generate a mock initial state if it's empty
  React.useEffect(() => {
    if (!subject && !body && !isGenerating) {
      simulateAIGeneration();
    }
  }, []);

  const simulateAIGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSubject(`Rappel important : Prime ${item.insurer}`);
      setBody(`Cher(e) ${item.client_name},\n\nSauf erreur ou omission de notre part, nous n'avons pas encore reçu le règlement de votre prime d'assurance ${item.insurer} d'un montant de ${item.amount}€.\n\nLa date d'échéance était fixée au ${item.due_date}.\n\nMerci de bien vouloir régulariser la situation dans les plus brefs délais afin de maintenir vos garanties.\n\nBien à vous,\nVotre Courtier.`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-8">
      
      {/* Top Header / Document Quick Actions */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{item.client_name}</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Dossier: {item.policy_number || 'En attente'} • Échéance: {item.due_date}</p>
        </div>
        <button 
          onClick={() => setPdfModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200"
        >
          <FileText className="w-4 h-4" /> Voir la facture
        </button>
      </div>

      {/* Chat Stream Area */}
      <div className="flex-1 space-y-8 overflow-y-auto pb-20">
        
        {/* AI Message Bubble */}
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-sm text-slate-700 leading-relaxed pt-2">
              <p>J'ai analysé le document extrait pour <strong>{item.client_name}</strong> chez <strong>{item.insurer}</strong>.</p>
              <p className="mt-1">Le montant à recouvrer est de <strong className="text-emerald-600">{item.amount}€</strong>. Voici le brouillon de relance que j'ai préparé :</p>
            </div>

            {/* Editable Draft Block */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-4">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Éditeur de brouillon</span>
                <button 
                  onClick={simulateAIGeneration}
                  disabled={isGenerating}
                  className="text-xs text-emerald-600 font-medium flex items-center gap-1 hover:underline disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} /> Régénérer
                </button>
              </div>
              
              <div className="p-4 space-y-3 relative">
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-emerald-600">
                    <Sparkles className="w-8 h-8 animate-pulse mb-2" />
                    <span className="text-sm font-medium animate-pulse">L'IA rédige...</span>
                  </div>
                )}
                
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Sujet de l'e-mail..."
                  className="w-full text-sm font-semibold border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <textarea 
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Corps du message..."
                  className="w-full text-sm border border-slate-200 rounded-lg p-4 min-h-[250px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-y leading-relaxed text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-auto">
        <button 
          onClick={() => onApprove(item.id)}
          disabled={isGenerating}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50"
        >
          <CheckCircle2 className="w-5 h-5" /> Valider & Préparer l'envoi
        </button>
      </div>

      {/* PDF Viewer Modal */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" /> Document PDF : {item.client_name}
              </h3>
              <button 
                onClick={() => setPdfModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 p-8 flex items-center justify-center">
              <div className="bg-white border border-slate-200 shadow-sm w-full max-w-2xl h-full flex flex-col items-center justify-center text-slate-400 rounded-lg">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-sm font-medium">Aperçu du PDF indisponible dans cette démo.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
