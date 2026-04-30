"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { getSettings, saveSettings } from "@/lib/api";
import { toast } from "sonner";
import { Cpu, Key, Mail, Smartphone, QrCode, Zap, CheckCircle2, Save } from "lucide-react";

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState("");
  const [tone, setTone] = useState("courteous");
  const [emailKey, setEmailKey] = useState("");
  const [waMode, setWaMode] = useState("native"); // native | official
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  React.useEffect(() => {
    getSettings().then(data => {
      setGeminiKey(data.gemini_key || "");
      setEmailKey(data.resend_key || "");
      setTone(data.tone || "courteous");
      setWaMode(data.whatsapp_mode || "native");
    }).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await saveSettings({
        gemini_key: geminiKey,
        resend_key: emailKey,
        tone,
        whatsapp_mode: waMode
      });
      setStatus("success");
      toast.success("Paramètres synchronisés avec le backend.");
    } catch (error) {
      setStatus("error");
      toast.error("Échec de la sauvegarde.");
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-3 px-4">
          <div className="w-1 h-6 bg-emerald-600 rounded-full" />
          <h1 className="text-3xl font-black text-slate-900 font-display">Configuration du Cockpit</h1>
        </div>
        <p className="text-slate-500 px-4 font-medium italic">Gérez l'intelligence et les connecteurs de votre agence.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Intelligence Artificielle & Personnalité */}
        <section className="glass-card rounded-[2.5rem] p-10 space-y-8 border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Moteur IA & Personnalité</h2>
                <p className="text-xs text-slate-400 font-medium">Configurez le cerveau de Kazi IA</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Clé API Gemini 1.5 Pro</label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="password" 
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="votre_clé_ici"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Ton de Voix des Relances</label>
              <div className="grid grid-cols-3 gap-2">
                <ToneOption id="courteous" active={tone === "courteous"} onClick={() => setTone("courteous")} label="Courtois" />
                <ToneOption id="formal" active={tone === "formal"} onClick={() => setTone("formal")} label="Formel" />
                <ToneOption id="firm" active={tone === "firm"} onClick={() => setTone("firm")} label="Ferme" />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bridge E-mail (Resend) */}
          <section className="glass-card rounded-[2.5rem] p-10 space-y-6 border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Bridge E-mail</h3>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Recommandé : **Resend** pour une délivrabilité optimale en Belgique.
              </p>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Clé API Resend</label>
                <input 
                  type="password" 
                  value={emailKey}
                  onChange={(e) => setEmailKey(e.target.value)}
                  placeholder="re_xxxxxxx..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </section>

          {/* Bridge WhatsApp */}
          <section className="glass-card rounded-[2.5rem] p-10 space-y-6 border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Bridge WhatsApp</h3>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  type="button"
                  onClick={() => setWaMode("native")}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${waMode === "native" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}
                >
                  Kazi Native
                </button>
                <button 
                  type="button"
                  onClick={() => setWaMode("official")}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${waMode === "official" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}
                >
                  Officiel
                </button>
              </div>

              {waMode === "native" ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 group cursor-pointer">
                  <QrCode className="w-10 h-10 text-emerald-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-emerald-900">Scanner le QR Code</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Lien direct vers votre numéro courtier</p>
                  </div>
                </div>
              ) : (
                <input 
                  type="password" 
                  placeholder="Twilio Auth Token"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none"
                />
              )}
            </div>
          </section>
        </div>

        {/* Action Footer */}
        <div className="emerald-gradient p-10 rounded-[3rem] text-white shadow-2xl shadow-emerald-900/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <h3 className="text-2xl font-black font-display">Prêt à synchroniser ?</h3>
            <p className="text-emerald-100 text-sm font-medium opacity-80">Vos modifications seront appliquées instantanément aux bridges actifs.</p>
          </div>
          <button 
            type="submit"
            disabled={status === "saving"}
            className="relative z-10 w-full md:w-auto bg-white text-emerald-700 px-12 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {status === "saving" ? (
              <Zap className="w-5 h-5 animate-pulse" />
            ) : status === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {status === "saving" ? "Synchronisation..." : "Sauvegarder"}
          </button>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        </div>
      </form>
    </div>
  );
}

function ToneOption({ id, active, onClick, label }: { id: string, active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
        active 
          ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20" 
          : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}
