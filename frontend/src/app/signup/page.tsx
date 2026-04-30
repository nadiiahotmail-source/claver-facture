"use client";

import React, { useState } from "react";
import { Zap, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Timeout de sécurité pour éviter l'attente infinie si le serveur est down
      const signupPromise = supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 5000)
      );

      const { data, error: signupError } = await Promise.race([signupPromise, timeoutPromise]) as any;

      if (signupError) {
        setError(signupError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccess(true);
      
      // Redirection automatique vers le dashboard après 2 secondes
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err: any) {
      if (err.message === "Timeout") {
        setError("Le serveur d'authentification ne répond pas (Port 54321 hors-ligne). Vérifiez que Supabase est lancé.");
      } else {
        setError("Erreur critique de connexion. Assurez-vous que votre base de données locale est active.");
      }
      setLoading(false);
    }
  };
 
   if (success) {
     return (
       <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
         <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in duration-500">
           <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/30">
             <CheckCircle2 className="w-10 h-10 text-emerald-500" />
           </div>
           <h1 className="text-3xl font-bold text-white">Compte prêt !</h1>
           <p className="text-slate-400 leading-relaxed">
             Bienvenue chez KaziRelance. Pour cette version de démonstration, nous activons votre accès immédiatement.
             Préparation de votre cockpit en cours...
           </p>
           <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
             <div className="bg-emerald-500 h-full animate-progress-fast" />
           </div>
         </div>
       </div>
     );
   }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Visual Side */}
      <div className="hidden md:flex flex-1 relative bg-slate-900 items-center justify-center p-20 overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-transparent z-0" />
        
        <div className="relative z-10 space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Rejoignez l'élite du <span className="text-emerald-500">courtage automatisé.</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Plus de 200 agences en Belgique utilisent déjà Kazi IA pour leurs relances de primes.
            </p>
          </div>

          <ul className="space-y-4">
            <FeatureItem text="Extraction OCR 99.9% précise" />
            <FeatureItem text="Envois WhatsApp & Email automatisés" />
            <FeatureItem text="Conformité RGPD totale" />
            <FeatureItem text="Tableau de bord de performance" />
          </ul>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md">
          <header className="mb-10">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Créer un compte.</h1>
            <p className="text-slate-500 font-medium italic">Commencez à gagner du temps dès aujourd'hui.</p>
          </header>

          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Nom de l'Agence / Complet</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  required
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  placeholder="Ex: Agence Relance SPRL"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">E-mail Professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  placeholder="contact@agence.be"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  required
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="Min. 8 caractères"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-emerald-900/40 transition-all flex items-center justify-center gap-3 mt-4 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Démarrer gratuitement <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            Déjà inscrit ?{" "}
            <Link href="/login" className="text-emerald-500 font-bold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-slate-400 font-medium">
      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      </div>
      {text}
    </li>
  );
}
