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

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".pdf")) {
      toast.error("Format invalide. Seuls les fichiers PDF sont acceptés.");
      return;
    }

    setFile(selectedFile);
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await authenticatedFetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur serveur lors de l'analyse OCR.");

      const data = await response.json();
      onDataParsed(data);
      setStatus("success");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'analyse du document.");
      setStatus("error");
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
          "relative group cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center gap-4",
          isDragging 
            ? "border-emerald-500 bg-emerald-50/50 scale-[1.02]" 
            : "border-slate-200 bg-white hover:border-emerald-400 hover:bg-slate-50/50"
        )}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept=".pdf"
        />

        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
          status === "uploading" ? "bg-blue-50" : "bg-emerald-50 group-hover:scale-110"
        )}>
          {status === "uploading" ? (
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          ) : status === "success" ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          ) : (
            <Upload className="w-8 h-8 text-emerald-600" />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">
            {status === "uploading" ? "Analyse IA en cours..." : "Importer un export assureur"}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Glissez-déposez vos fichiers PDF ou cliquez ici
          </p>
        </div>

        {file && (
          <div className="mt-4 flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-slate-700 truncate max-w-[150px]">
              {file.name}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setStatus("idle");
              }}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
