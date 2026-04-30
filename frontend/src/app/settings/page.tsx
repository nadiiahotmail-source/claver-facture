"use client";

import React, { useState } from "react";
import { Settings, Clock, MessageSquare, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [excludeHolidays, setExcludeHolidays] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [templates, setTemplates] = useState({
    1: "Bonjour {{client_name}},\n\nSauf erreur de notre part, votre prime de {{amount}}€ arrivée à échéance le {{due_date}} n'a pas encore été réglée.\n\nMerci de faire le nécessaire.\n\nCordialement.",
    2: "Bonjour {{client_name}},\n\nNous constatons que votre paiement de {{amount}}€ est toujours en attente. Sans règlement sous 48h, votre contrat sera suspendu.\n\nCordialement.",
    3: "MISE EN DEMEURE - {{client_name}},\n\nMalgré nos relances, aucun paiement n'a été reçu. Votre contrat sera résilié définitivement si le montant de {{amount}}€ n'est pas réglé immédiatement."
  });

  const handleSave = () => {
    toast.success("Paramètres enregistrés avec succès.");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 font-sans p-4 md:p-10">
      <div className="max-w-[1000px] mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Settings className="w-8 h-8 text-emerald-600" /> Configuration KaziRelance
            </h1>
            <p className="text-sm text-slate-500 mt-2">Gérez les règles d'autonomie et les modèles de communication de l'IA.</p>
          </div>
          <button onClick={handleSave} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 active:scale-95 transition-all w-full md:w-auto justify-center">
            <Save className="w-4 h-4" /> Enregistrer
          </button>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-emerald-600" /> Règles Temporelles
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">Exclure les week-ends</p>
                    <p className="text-[10px] text-slate-400">Aucun envoi le samedi et dimanche</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${excludeWeekends ? 'bg-emerald-500' : 'bg-slate-200'}`} onClick={() => setExcludeWeekends(!excludeWeekends)}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${excludeWeekends ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">Exclure jours fériés</p>
                    <p className="text-[10px] text-slate-400">Basé sur le calendrier officiel</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${excludeHolidays ? 'bg-emerald-500' : 'bg-slate-200'}`} onClick={() => setExcludeHolidays(!excludeHolidays)}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${excludeHolidays ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </label>
              </div>

              <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <h3 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3 h-3" /> Management par exception
                </h3>
                <p className="text-[10px] text-amber-700/80 leading-relaxed">
                  L'IA déclenchera une alerte "Intervention Requise" et stoppera les envois après 3 relances consécutives sans réponse du client.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
             <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-full">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-6">
                  <MessageSquare className="w-4 h-4 text-emerald-600" /> Éditeur de Templates (Omnicanal)
                </h2>

                <div className="flex gap-2 mb-6 p-1 bg-slate-50 rounded-xl">
                  {[1, 2, 3].map(phase => (
                    <button 
                      key={phase}
                      onClick={() => setActiveTab(phase)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === phase ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Phase {phase} {phase === 1 ? '(Courtois)' : phase === 2 ? '(Ferme)' : '(Critique)'}
                    </button>
                  ))}
                </div>

                <div className="flex-1 flex flex-col space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {['{{client_name}}', '{{amount}}', '{{due_date}}', '{{insurer}}'].map(v => (
                      <span key={v} className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-mono cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => {
                        const ta = document.getElementById('template-textarea') as HTMLTextAreaElement;
                        if(ta) {
                          const start = ta.selectionStart;
                          const end = ta.selectionEnd;
                          const val = ta.value;
                          setTemplates({...templates, [activeTab as keyof typeof templates]: val.substring(0, start) + v + val.substring(end)});
                        }
                      }}>
                        {v}
                      </span>
                    ))}
                  </div>
                  <textarea 
                    id="template-textarea"
                    className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 resize-none min-h-[250px]"
                    value={templates[activeTab as keyof typeof templates]}
                    onChange={(e) => setTemplates({...templates, [activeTab]: e.target.value})}
                  />
                  <p className="text-[10px] text-slate-400 text-right">
                    Ce template sera utilisé par défaut pour les Emails et WhatsApp.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
