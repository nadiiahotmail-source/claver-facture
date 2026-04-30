"use client";

import React, { useState } from "react";
import { Zap, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Timeout de sécurité
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 5000)
      );

      const { error: loginError } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/dashboard");
      router.refresh(); // Refresh middleware
    } catch (err: any) {
      if (err.message === "Timeout") {
        setError("Le serveur d'authentification ne répond pas (Port 54321 hors-ligne). Vérifiez que Supabase est lancé.");
      } else {
        setError("Erreur critique de connexion. Assurez-vous que votre base de données locale est active.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Visual Side */}
      <div className="hidden md:flex flex-1 relative bg-emerald-600 items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/50 to-slate-900/80 z-0" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-0" />
        
        <div className="relative z-10 text-white max-w-lg">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
            <Zap className="w-10 h-10 text-emerald-400 fill-emerald-400" />
          </div>
          <h2 className="text-5xl font-black mb-6 leading-tight">
            Reprenez le contrôle sur vos <span className="text-emerald-400 text-6xl">primes.</span>
          </h2>
          <p className="text-emerald-100 text-xl font-medium leading-relaxed opacity-80">
            KaziRelance automatise vos relances pour que vous puissiez vous concentrer sur le conseil.
          </p>
          
          <div className="mt-12 flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-emerald-200">
            <ShieldCheck className="w-5 h-5" />
            Sécurisé par Kazi IA
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-slate-400/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Bon retour.</h1>
            <p className="text-slate-500 font-medium italic">Accédez à votre cockpit de courtage.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Adresse E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-700 font-medium"
                    placeholder="courtier@agence.be"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Mot de passe</label>
                  <a href="#" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors">Oublié ?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-emerald-900/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Se connecter <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 text-sm font-medium">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-emerald-500 font-bold hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
