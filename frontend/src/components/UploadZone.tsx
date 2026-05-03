"use client";

import React, { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle2, Loader2 } from "lucide-react";
import { authenticatedFetch } from "@/lib/api";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadZoneProps {
  onDataParsed: (data: any) => void;
}

export default function UploadZone({ onDataParsed }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const [progress, setProgress] = useState(0);

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".pdf")) {
      toast.error("Format invalide. Seuls les fichiers PDF sont acceptés.");
      return;
    }

    setFile(selectedFile);
    setStatus("uploading");
    setProgress(10);

    const formData = new FormData();
    formData.append("file", selectedFile);

    // Simulation de progression pour l'effet visuel "IA"
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
    }, 400);

    try {
      const response = await authenticatedFetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur serveur lors de l'analyse OCR.");

      const data = await response.json();
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        onDataParsed(data);
        setStatus("success");
      }, 500);
    } catch (error: any) {
      clearInterval(interval);
      toast.error(error.message || "Erreur lors de l'analyse du document.");
      setStatus("error");
      setProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative group cursor-pointer border-2 border-dashed rounded-[2.5rem] p-12 transition-all duration-500 flex flex-col items-center justify-center gap-6 overflow-hidden",
          isDragging 
            ? "border-emerald-500 bg-emerald-50/50 scale-[1.02] shadow-2xl shadow-emerald-500/10" 
            : "border-slate-200 bg-white hover:border-emerald-400 hover:bg-slate-50/20 shadow-sm"
        )}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={handleFileInput}
          accept=".pdf"
        />

        {/* AI Scanning Animation Layer */}
        {status === "uploading" && (
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10" />
             <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent animate-pulse" />
          </div>
        )}

        <div className={cn(
          "w-20 h-20 rounded-[1.75rem] flex items-center justify-center transition-all duration-500 z-10 relative",
          status === "uploading" ? "bg-emerald-600 shadow-xl shadow-emerald-500/30 scale-110" : 
          status === "success" ? "bg-emerald-100" : "bg-slate-50 group-hover:bg-emerald-50"
        )}>
          {status === "uploading" ? (
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          ) : status === "success" ? (
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          ) : (
            <Upload className="w-10 h-10 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          )}
        </div>

        <div className="text-center z-10">
          <h3 className="text-xl font-black text-slate-900 italic tracking-tight">
            {status === "uploading" ? "Extraction des données par l'IA..." : "Ingestion de documents"}
          </h3>
          <p className="text-sm text-slate-500 mt-2 font-medium italic">
            {status === "uploading" ? "Analyse chirurgicale des montants et échéances..." : "Déposez vos exports PDF ici pour l'orchestration."}
          </p>
        </div>

        {status === "uploading" && (
          <div className="w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2 z-10 border border-slate-200">
             <div 
               className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]"
               style={{ width: `${progress}%` }}
             />
          </div>
        )}

        {file && status !== "uploading" && (
          <div className="mt-4 flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-2 z-10">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-slate-900 truncate max-w-[150px]">
                {file.name}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-bold">Document prêt</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setStatus("idle");
                setProgress(0);
              }}
              className="ml-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
