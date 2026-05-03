"use client";

import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, MapPin, Zap, ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { createAppointment } from "@/lib/api";

export default function AppointmentPage() {
  const [step, setStep] = useState(1); // 1: Select Slot, 2: Details, 3: Success
  const [selectedDate, setSelectedDate] = useState("2026-05-19");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: ""
  });

  const handleConfirmSlot = () => {
    if (selectedTime) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAppointment({
        ...formData,
        appointment_date: selectedDate,
        appointment_time: selectedTime
      });
      setStep(3);
    } catch (err) {
      alert("Erreur lors de la réservation. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFDFF] font-sans overflow-x-hidden">
      {/* Premium Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-all font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-4 h-4" /> Retour au site
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <span className="text-lg font-black tracking-tighter text-slate-900">Kazi<span className="text-emerald-600">Relance</span></span>
        </div>
        <div className="w-24 hidden md:block" />
      </nav>

      <main className="pt-40 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Info Card */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                  <div className="w-16 h-16 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-emerald-600/20">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black tracking-tight mb-4 leading-tight">Démonstration Stratégique</h1>
                    <p className="text-slate-400 font-medium italic leading-relaxed">
                      "Découvrez comment nos agents IA peuvent automatiser votre recouvrement et libérer 15h par semaine."
                    </p>
                  </div>
                  
                  <div className="space-y-6 pt-6">
                    <InfoItem icon={Clock} label="Durée" value="30 minutes" />
                    <InfoItem icon={MapPin} label="Lieu" value="Google Meet / Zoom" />
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Au programme :</p>
                    <ul className="space-y-4">
                      {["Audit de votre flux", "Demo Extraction OCR", "Setup IA Drafter"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium italic">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px]" />
              </div>
            </div>

            {/* Right: Interaction Area */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/50"
                  >
                    <h2 className="text-2xl font-black text-slate-900 mb-8">1. Sélectionnez un créneau</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Mock Calendar */}
                      <div className="space-y-6">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mai 2026</p>
                         <div className="grid grid-cols-7 gap-2">
                           {["L", "M", "M", "J", "V", "S", "D"].map(d => (
                             <div key={d} className="text-center text-[10px] font-black text-slate-300 py-2">{d}</div>
                           ))}
                           {[...Array(31)].map((_, i) => (
                             <button 
                               key={i} 
                               disabled={i < 18}
                               onClick={() => setSelectedDate(`2026-05-${i+1}`)}
                               className={`h-10 rounded-xl text-xs font-bold transition-all ${
                                 i+1 === parseInt(selectedDate.split("-")[2]) ? "bg-emerald-600 text-white shadow-lg" : 
                                 i < 18 ? "text-slate-200 cursor-not-allowed" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                               }`}
                             >
                               {i + 1}
                             </button>
                           ))}
                         </div>
                      </div>

                      {/* Times */}
                      <div className="space-y-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Heures Disponibles</p>
                        <div className="grid grid-cols-2 gap-3">
                          {["09:00", "10:30", "14:00", "15:30", "16:45"].map((time) => (
                            <button 
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-4 rounded-2xl font-black text-xs transition-all border-2 ${
                                selectedTime === time ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "border-slate-100 text-slate-600 hover:border-emerald-600 hover:text-emerald-600"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 flex justify-end">
                      <button 
                        onClick={handleConfirmSlot}
                        disabled={!selectedTime}
                        className="bg-slate-900 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-slate-800 transition-all disabled:opacity-30 active:scale-95"
                      >
                        Suivant
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/50"
                  >
                    <h2 className="text-2xl font-black text-slate-900 mb-2">2. Vos informations</h2>
                    <p className="text-slate-400 text-sm mb-10 font-medium italic">Remplissez ces détails pour recevoir votre invitation.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom Complet / Agence</label>
                        <input 
                          required
                          type="text"
                          value={formData.client_name}
                          onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                          placeholder="Ex: Michel Vandermeers"
                          className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-emerald-600 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse Email</label>
                        <input 
                          required
                          type="email"
                          value={formData.client_email}
                          onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                          placeholder="michel@agence.be"
                          className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-emerald-600 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro de Téléphone (WhatsApp)</label>
                        <input 
                          type="tel"
                          value={formData.client_phone}
                          onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                          placeholder="+32 470 00 00 00"
                          className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-emerald-600 transition-all outline-none"
                        />
                      </div>

                      <div className="pt-8 flex items-center justify-between">
                        <button 
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                        >
                          Retour
                        </button>
                        <button 
                          disabled={loading}
                          className="bg-emerald-600 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-3 active:scale-95"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmer le RDV"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[4rem] p-20 border border-slate-100 shadow-xl shadow-slate-200/50 text-center space-y-8"
                  >
                    <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">C'est confirmé !</h2>
                    <p className="text-slate-500 font-medium italic max-w-sm mx-auto">
                      Merci <span className="text-emerald-600 font-bold">{formData.client_name}</span>. Un email de confirmation a été envoyé à {formData.client_email}.
                    </p>
                    <div className="pt-10">
                      <Link href="/" className="bg-slate-900 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-slate-800 transition-all">
                        Retour à l'accueil
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-emerald-400 border border-white/10">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-white font-bold">{value}</p>
      </div>
    </div>
  );
}
