"use client";

import React from "react";
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  MessageSquare, 
  TrendingUp, 
  Smartphone,
  Star,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900 font-sans overflow-x-hidden">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 emerald-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">KaziRelance</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <NavLink href="#features">Fonctionnalités</NavLink>
          <NavLink href="#agentic">Agents IA</NavLink>
          <NavLink href="#pricing">Tarifs</NavLink>
        </div>
        <button 
          onClick={() => window.location.href = "/dashboard"}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
        >
          Accéder au Cockpit
        </button>
      </nav>

      {/* Hero Section (Sales Expert) */}
      <section className="pt-48 pb-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[10px] uppercase tracking-widest"
            >
              <Cpu className="w-4 h-4" /> Nouvelle Version 2026 : Agentic Edition
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] font-display">
              Récupérez vos <span className="text-emerald-600">primes impayées</span> en pilote automatique.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed italic">
              KaziRelance utilise une armée d'agents IA spécialisés pour scanner vos e-mails, extraire les factures et relancer vos clients via WhatsApp et E-mail.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <button 
                onClick={() => window.location.href = "/dashboard"}
                className="w-full sm:w-auto emerald-gradient text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-emerald-600/30 active:scale-95 flex items-center justify-center gap-3"
              >
                Lancer ma Production <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-4 text-slate-600 font-black uppercase tracking-widest text-xs hover:text-emerald-600 transition-colors">
                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm">
                  <Play className="w-4 h-4 fill-slate-900 ml-1" />
                </div>
                Voir la Démo
              </button>
            </div>
          </div>
          
          <div className="relative">
             <div className="glass-card aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-slate-200 bg-slate-900 group cursor-pointer">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 space-y-4 group-hover:text-emerald-500 transition-colors">
                  <Play className="w-16 h-16 fill-current" />
                  <p className="text-xs font-black uppercase tracking-widest">Video Case Study: +35% de Recovery</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
             </div>
             <div className="absolute -z-10 -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
          </div>
        </div>
      </section>

      {/* Agentic Power Section */}
      <section id="agentic" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight text-slate-900">
              L'Armée des <span className="text-emerald-600">Agents Kazi</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium italic">
              Pourquoi se contenter d'un simple logiciel quand vous pouvez avoir une équipe d'experts IA travaillant pour vous 24/7 ?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AgentCard 
              name="Agent Scanner" 
              role="Extraction OCR Pro"
              desc="Scanne automatiquement votre boîte IMAP et extrait chaque donnée de facture avec 99.8% de précision."
            />
            <AgentCard 
              name="Agent Drafter" 
              role="Rédaction Persuasive"
              desc="Génère des messages de relance personnalisés selon le ton de votre agence (Courtois, Ferme ou Ami)."
            />
            <AgentCard 
              name="Agent Sentinel" 
              role="Suivi & Relance"
              desc="Surveille les flux et déclenche les relances WhatsApp au moment optimal pour maximiser le paiement."
            />
          </div>
        </div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200/50" />
      </section>

      {/* Social Proof (Testimonials) */}
      <section className="py-32 px-8 max-w-7xl mx-auto space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black font-display text-slate-900 leading-tight">
              Adopté par les plus grandes <span className="text-emerald-600">agences belges</span>.
            </h2>
            <div className="space-y-6">
              <Testimonial 
                name="Michel Vandermeers" 
                agency="MV Assurances"
                content="KaziRelance a automatisé 80% de nos tâches administratives. Nous avons récupéré 45k€ d'impayés en seulement 3 mois."
              />
              <Testimonial 
                name="Sophie Dubois" 
                agency="Courtage Elite"
                content="L'interface est d'une beauté incroyable, mais c'est surtout la précision de l'IA qui nous a bluffés."
              />
            </div>
          </div>
          <div className="bg-slate-900 rounded-[3rem] p-16 text-white space-y-8 relative overflow-hidden shadow-2xl">
             <TrendingUp className="w-16 h-16 text-emerald-500 mb-8" />
             <h3 className="text-5xl font-black font-display">+42%</h3>
             <p className="text-emerald-100/60 font-medium italic text-lg leading-relaxed">
               Augmentation moyenne du taux de recouvrement observée chez nos partenaires utilisant l'Agentic Bridge.
             </p>
             <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-slate-50 px-8">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-black font-display text-slate-900">Une tarification simple et transparente.</h2>
          </div>
          <div className="glass-card rounded-[3rem] p-12 md:p-20 shadow-2xl border-slate-200 bg-white relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest shadow-lg">
                Offre de lancement
             </div>
             <div className="space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-3xl font-black font-display">Kazi Elite Pack</h3>
                    <p className="text-slate-500 font-medium">Tout inclus pour votre agence.</p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-6xl font-black text-slate-900 font-display">99€<span className="text-xl text-slate-400 font-bold">/mois</span></p>
                    <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">Utilisateurs illimités</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-slate-100">
                  <PriceItem text="Bridges Email & WhatsApp Inclus" />
                  <PriceItem text="Agents IA Illimités" />
                  <PriceItem text="Stockage Documentaire Sécurisé" />
                  <PriceItem text="Support Premium 24/7" />
                </div>
                <button 
                  onClick={() => window.location.href = "/dashboard"}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                >
                  Démarrer mon essai gratuit
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Final Footer */}
      <footer className="py-20 border-t border-slate-100 text-center space-y-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 emerald-gradient rounded-lg flex items-center justify-center text-white">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <span className="text-lg font-black tracking-tighter">KaziRelance</span>
        </div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.3em]">© 2026 Yawadi Agency OS. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a href={href} className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-emerald-600 transition-colors">
      {children}
    </a>
  );
}

function AgentCard({ name, role, desc }: { name: string, role: string, desc: string }) {
  return (
    <div className="glass-card p-10 rounded-[2.5rem] bg-white border-slate-100 hover:shadow-xl transition-all group">
      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
        <Cpu className="w-6 h-6" />
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900">{name}</h3>
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{role}</p>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed italic">{desc}</p>
      </div>
    </div>
  );
}

function Testimonial({ name, agency, content }: { name: string, agency: string, content: string }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-emerald-500 text-emerald-500" />)}
      </div>
      <p className="text-slate-700 font-medium leading-relaxed italic text-sm">"{content}"</p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100" />
        <div>
          <p className="text-xs font-bold text-slate-900">{name}</p>
          <p className="text-[10px] text-slate-400 font-medium">{agency}</p>
        </div>
      </div>
    </div>
  );
}

function PriceItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      <span className="text-sm font-medium text-slate-600">{text}</span>
    </div>
  );
}
