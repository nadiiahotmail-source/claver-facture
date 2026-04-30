"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Zap, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AppointmentPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" /> Retour
          </Link>
          <div className="flex items-center gap-3">
             <div className="bg-emerald-600 p-2 rounded-xl">
               <Zap className="w-4 h-4 text-white" />
             </div>
             <span className="text-xl font-bold tracking-tight text-slate-900">
               Kazi<span className="text-emerald-600">Relance</span>
             </span>
           </div>
           <div className="w-20" /> {/* Spacer */}
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
            {/* Sidebar Info */}
            <div className="w-full md:w-80 bg-slate-900 p-10 text-white">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Démonstration Stratégique</h1>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Découvrez comment KaziRelance peut automatiser 98% de vos tâches administratives liées aux impayés.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <Clock className="w-5 h-5 text-emerald-400" /> 30 minutes
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <MapPin className="w-5 h-5 text-emerald-400" /> Google Meet / Zoom
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <Calendar className="w-5 h-5 text-emerald-400" /> Sélectionnez un créneau
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/10">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Inclus dans la démo :</p>
                <ul className="space-y-3">
                  {["Audit de votre flux actuel", "Test d'extraction OCR", "Simulation WhatsApp"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Booking Content */}
            <div className="flex-1 p-10 bg-white">
              <h2 className="text-xl font-bold text-slate-900 mb-8">Choisissez une date et heure</h2>
              
              {/* Mock Calendar UI */}
              <div className="grid grid-cols-7 gap-2 mb-10">
                {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                  <div key={i} className="text-center text-[10px] font-black text-slate-400 uppercase">{d}</div>
                ))}
                {[...Array(31)].map((_, i) => (
                  <button 
                    key={i} 
                    disabled={i < 15}
                    className={`h-10 rounded-lg text-sm font-bold transition-all ${
                      i === 18 ? "bg-emerald-600 text-white shadow-lg" : 
                      i < 15 ? "text-slate-200 cursor-not-allowed" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-900">Mercredi 19 Avril</p>
                <div className="grid grid-cols-2 gap-3">
                  {["09:00", "10:30", "14:00", "15:30"].map((time, i) => (
                    <button 
                      key={i}
                      className="border-2 border-emerald-600 text-emerald-600 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all">
                  Confirmer le rendez-vous
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
