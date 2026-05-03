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
  Cpu,
  Calendar,
  Lock,
  BarChart3,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-[#FBFDFF] text-slate-900 font-sans overflow-x-hidden">
      {/* Floating Header */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] px-8 py-4 flex items-center justify-between shadow-2xl shadow-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">Kazi<span className="text-emerald-600">Relance</span></span>
        </div>
        <div className="hidden lg:flex items-center gap-10">
          <NavLink href="#mission">Notre Mission</NavLink>
          <NavLink href="#agents">L'Armée IA</NavLink>
          <NavLink href="#resultats">Résultats</NavLink>
          <NavLink href="#pricing">Tarification</NavLink>
        </div>
        <Link 
          href="/rendez-vous"
          className="bg-emerald-600 text-white px-8 py-3 rounded-full text-[13px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-600/20"
        >
          Planifier une Démo
        </Link>
      </nav>

      {/* Hero Section: The "Vendeur d'Elite" Copy */}
      <section id="mission" className="relative pt-52 pb-32 px-8">

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50 font-black text-[11px] uppercase tracking-[0.2em] shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Agentic OS v2.0 est arrivé
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] text-slate-900">
              Transformez vos <span className="text-emerald-600">impayés</span> en cash, sans effort.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl italic">
              KaziRelance orchestre une armée d'agents IA spécialisés pour automatiser le recouvrement de vos primes d'assurance. <span className="font-bold text-slate-800 underline decoration-emerald-500/30 text-2xl">Plus de relances manuelles. Plus d'oublis.</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                href="/rendez-vous"
                className="w-full sm:w-auto bg-emerald-600 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-[14px] shadow-2xl shadow-emerald-600/40 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Prendre Rendez-vous <Calendar className="w-5 h-5" />
              </Link>
              <button className="flex items-center gap-4 text-slate-500 font-bold uppercase tracking-widest text-[11px] hover:text-emerald-600 transition-all group">
                <div className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center bg-white shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-emerald-600 text-emerald-600 ml-1" />
                </div>
                Voir la démo (3min)
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-square bg-emerald-600/5 rounded-[4rem] absolute -inset-10 -rotate-6 -z-10 blur-3xl opacity-50" />
            <div className="bg-slate-900 aspect-[4/5] rounded-[4rem] border-2 border-white overflow-hidden shadow-2xl relative flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 text-center px-10">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center backdrop-blur-xl border border-emerald-500/40">
                    <Play className="w-6 h-6 fill-emerald-500 text-emerald-600 ml-1" />
                  </div>
                  <p className="text-white font-black uppercase tracking-[0.3em] text-[10px]">OS Intelligent v2.0</p>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar: Continuous Scroll */}
      <section className="py-12 bg-white/50 border-y border-slate-100/50 backdrop-blur-sm overflow-hidden">
        <div className="flex gap-20 animate-marquee whitespace-nowrap items-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
           <TrustLogo src="https://upload.wikimedia.org/wikipedia/commons/e/e9/AXA_Logo.svg" alt="AXA" />
           <TrustLogo src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Allianz_logo.svg" alt="Allianz" />
           <TrustLogo src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Baloise_Holding_logo.svg" alt="Baloise" />
           <TrustLogo src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Logo_P%26V_Assurances.svg" alt="P&V" />
           {/* Duplicate for seamless scroll */}
           <TrustLogo src="https://upload.wikimedia.org/wikipedia/commons/e/e9/AXA_Logo.svg" alt="AXA" />
           <TrustLogo src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Allianz_logo.svg" alt="Allianz" />
           <TrustLogo src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Baloise_Holding_logo.svg" alt="Baloise" />
           <TrustLogo src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Logo_P%26V_Assurances.svg" alt="P&V" />
        </div>
      </section>

      {/* The Army of Agents */}
      <section id="agents" className="py-32 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
              Une Armée de <span className="text-emerald-600">Spécialistes</span> à votre service.
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed italic">
              KaziRelance n'est pas un simple logiciel. C'est une équipe d'agents IA autonomes qui travaillent 24h/24 pour votre rentabilité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <AgentBox 
               icon={BarChart3}
               name="L'Agent Scanner"
               role="Extraction de Données OCR"
               desc="Il analyse chaque facture entrante, extrait les montants, les IBAN et les dates d'échéance avec une précision chirurgicale."
               color="text-blue-600"
               bgColor="bg-blue-50"
             />
             <AgentBox 
               icon={MessageSquare}
               name="L'Agent Drafter"
               role="Rédaction Copywriting"
               desc="Il rédige des relances personnalisées et persuasives, adaptées au ton de votre agence, pour maximiser le taux de réponse."
               color="text-emerald-600"
               bgColor="bg-emerald-50"
             />
             <AgentBox 
               icon={ShieldCheck}
               name="L'Agent Sentinel"
               role="Surveillance & Sécurité"
               desc="Il surveille les flux de paiement et déclenche les alertes WhatsApp au moment optimal. Rien ne lui échappe."
               color="text-red-600"
               bgColor="bg-red-50"
             />
          </div>
        </div>
      </section>

      {/* Case Study Video Section - Moved below Agents */}
      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-[10px] uppercase tracking-[0.2em]">
                Démonstration Interactive
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Voyez l'IA Sentinel <span className="text-emerald-500">en action.</span>
              </h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
                "Comment nous avons récupéré 45.000€ en 90 jours grâce à l'orchestration agentique. Une immersion de 3 minutes dans le futur du courtage."
              </p>
              <div className="flex items-center gap-6 pt-4">
                 <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800" />
                    ))}
                 </div>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">+500 Courtiers ont déjà visionné cette démo</p>
              </div>
            </div>
            
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-4 bg-emerald-600/20 rounded-[3rem] blur-2xl group-hover:bg-emerald-600/30 transition-all" />
              <div className="relative aspect-video bg-slate-900 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-white text-white ml-1" />
                </div>
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Case Study : MV Assurances</p>
                      <p className="text-white font-bold text-sm">Le Recouvrement Autonome</p>
                   </div>
                   <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">03:14</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-600/5 to-transparent pointer-events-none" />
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 mb-20 text-center">
           <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Ce que disent vos confrères</h3>
        </div>
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
           <TestimonialCard name="Jean-Pierre L." agency="Allianz Namur" text="Gain de temps phénoménal. On ne s'occupe plus de rien." />
           <TestimonialCard name="Sophie M." agency="AXA Bruxelles" text="L'IA Sentinel est redoutable. Le taux de réponse est incroyable." />
           <TestimonialCard name="Marc D." agency="Baloise Gand" text="Enfin une solution qui comprend le métier de courtier." />
           <TestimonialCard name="Lucie V." agency="P&V Liège" text="Récupérer 10k€ en un mois sans passer un seul appel... magique." />
           <TestimonialCard name="Jean-Pierre L." agency="Allianz Namur" text="Gain de temps phénoménal. On ne s'occupe plus de rien." />
           <TestimonialCard name="Sophie M." agency="AXA Bruxelles" text="L'IA Sentinel est redoutable. Le taux de réponse est incroyable." />
        </div>
      </section>

      {/* Social Proof & Results */}
      <section id="resultats" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
             <div className="space-y-12">
                <h3 className="text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
                  Conçu pour les <span className="text-emerald-600">agences belges</span> les plus exigeantes.
                </h3>
                <div className="space-y-8">
                   <MetricRow icon={TrendingUp} label="Augmentation du Recouvrement" value="+42%" />
                   <MetricRow icon={Clock} label="Temps Administratif Gagné" value="-15h/sem" />
                   <MetricRow icon={CheckCircle2} label="Précision d'Extraction IA" value="99.8%" />
                </div>
                <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                   <p className="text-xl font-medium leading-relaxed italic mb-8">
                     "KaziRelance a radicalement changé notre gestion des impayés. Ce qui prenait 3 jours se fait maintenant en 10 minutes."
                   </p>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800" />
                      <div>
                        <p className="font-bold text-white">Michel Vandermeers</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">MV Assurances, Bruxelles</p>
                      </div>
                   </div>
                   <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
                </div>
             </div>

             <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <StatsCard label="Dossiers Traités" value="12,540" />
                   <StatsCard label="Primes Récupérées" value="1.2M€" />
                </div>
                <div className="p-12 rounded-[4rem] border-2 border-slate-100 bg-slate-50 space-y-8">
                   <h4 className="text-2xl font-black text-slate-900">Le "Agentic Bridge" en action</h4>
                   <p className="text-slate-500 font-medium italic">
                     Nos agents ne se contentent pas d'envoyer des mails. Ils créent un pont intelligent entre votre boîte mail et le WhatsApp de vos clients, assurant un suivi sans friction.
                   </p>
                   <Link href="/rendez-vous" className="flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-xs hover:gap-5 transition-all">
                      Découvrir la technologie <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing: Refactored for Value */}
      <section id="pricing" className="py-32 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-8 space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Ne perdez plus votre temps précieux.</h2>
            <p className="text-slate-500 text-xl font-medium italic leading-relaxed">
              Le recouvrement manuel est une entrave à votre croissance. Libérez-vous.
            </p>
          </div>
          <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-white shadow-slate-200/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-emerald-600 text-white px-10 py-3 rounded-bl-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">
                OFFRE EARLY ADOPTER
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-10">
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black text-slate-900">Gagnez un temps énorme</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">
                        Pendant que vos agents IA récupèrent vos primes, vous vous concentrez sur le développement de votre portefeuille et la relation client.
                      </p>
                   </div>
                   <ul className="space-y-5">
                      <PriceItem text="Automatisation totale du recouvrement" />
                      <PriceItem text="Garantie de récupération des primes" />
                      <PriceItem text="Zéro stress, Zéro relance manuelle" />
                      <PriceItem text="Concentration exclusive sur vos clients" />
                   </ul>
                </div>
                <div className="bg-slate-950 p-12 rounded-[3rem] text-center space-y-8 relative overflow-hidden">
                   <div className="relative z-10 space-y-6">
                      <div className="space-y-2">
                        <p className="text-white font-black text-3xl">Passez à l'Action</p>
                        <p className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Démo gratuite et sans engagement</p>
                      </div>
                      <p className="text-slate-400 text-sm font-medium italic">
                        "Rejoignez les courtiers qui ont décidé de ne plus jamais courir après l'argent."
                      </p>
                      <Link 
                        href="/rendez-vous"
                        className="block bg-emerald-600 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-sm hover:bg-emerald-700 transition-all active:scale-95 shadow-2xl shadow-emerald-600/20"
                      >
                        Planifier ma démo
                      </Link>
                   </div>
                   <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-emerald-600/20 rounded-full blur-3xl" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:col-span-4 gap-16">
           <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <span className="text-lg font-black tracking-tighter">KaziRelance</span>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm italic">
                L'OS agentique de référence pour les agences d'assurance modernes. Récupérez vos primes, préservez vos relations.
              </p>
           </div>
           <div className="space-y-6">
              <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-900">Plateforme</h5>
              <ul className="space-y-4">
                 <FooterLink href="#mission">Notre Technologie</FooterLink>
                 <FooterLink href="#agents">Les Agents IA</FooterLink>
                 <FooterLink href="#pricing">Tarification</FooterLink>
              </ul>
           </div>
           <div className="space-y-6">
              <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-900">Légal & Contact</h5>
              <ul className="space-y-4">
                 <FooterLink href="/rendez-vous">Prendre Démo</FooterLink>
                 <FooterLink href="#">Confidentialité</FooterLink>
                 <FooterLink href="#">Contact Support</FooterLink>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-24 pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">© 2026 Yawadi Agency OS. Tous droits réservés.</p>
           <div className="flex gap-8 opacity-50 grayscale">
              <Lock className="w-4 h-4" />
              <ShieldCheck className="w-4 h-4" />
           </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors">
      {children}
    </Link>
  );
}

function AgentBox({ icon: Icon, name, role, desc, color, bgColor }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group"
    >
      <div className={`w-16 h-16 ${bgColor} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="text-xl font-bold text-slate-900">{name}</h4>
          <p className={`text-[10px] font-black ${color} uppercase tracking-widest`}>{role}</p>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed italic">{desc}</p>
      </div>
    </motion.div>
  );
}

function MetricRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
             <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-600">{label}</span>
       </div>
       <span className="text-xl font-black text-slate-900">{value}</span>
    </div>
  );
}

function StatsCard({ label, value }: any) {
  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-100 text-center space-y-2 shadow-sm">
       <p className="text-3xl font-black text-slate-900">{value}</p>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function PriceItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4">
       <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
       </div>
       <span className="text-sm font-medium text-slate-600">{text}</span>
    </li>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">
        {children}
      </Link>
    </li>
  );
}

function TrustLogo({ src, alt }: { src: string, alt: string }) {
  return (
    <img src={src} alt={alt} className="h-6 md:h-8 object-contain" />
  );
}

function TestimonialCard({ name, agency, text }: { name: string, agency: string, text: string }) {
  return (
    <div className="inline-block px-10 py-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] shadow-sm min-w-[350px]">
       <p className="text-sm font-medium text-slate-700 italic mb-6 leading-relaxed">"{text}"</p>
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div>
             <p className="text-xs font-black text-slate-900">{name}</p>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{agency}</p>
          </div>
       </div>
    </div>
  );
}
