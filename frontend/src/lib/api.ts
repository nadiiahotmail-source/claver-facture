import { createClient } from "./supabase";

const getApiUrl = () => {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    // Si on est sur Vercel, on utilise l'URL relative ou le proxy configuré
    return process.env.NEXT_PUBLIC_API_URL || ""; 
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export const API_URL = getApiUrl();


export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  let session = null;
  try {
    const supabase = createClient();
    const result = await supabase.auth.getSession();
    session = result.data.session;
  } catch (e) {
    console.warn("Supabase auth not available, proceeding without session.");
  }
  
  // Si l'URL ne commence pas par http, on préfixe avec l'API_URL par défaut
  const finalUrl = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;

  const headers = new Headers(options.headers || {});
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  } else {
    // For local testing without real auth
    headers.set("Authorization", "Bearer mock-token");
  }
  
  return fetch(finalUrl, {
    ...options,
    headers,
  });
}

export async function getReminders() {
  const res = await authenticatedFetch("/reminders");
  if (!res.ok) throw new Error("Failed to fetch reminders");
  return res.json();
}

export async function getStats() {
  const res = await authenticatedFetch("/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function getLogs() {
  const res = await authenticatedFetch("/logs");
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}

export async function draftReminder(id: string) {
  const res = await authenticatedFetch(`/reminders/draft/${id}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to draft reminder");
  return res.json();
}

export async function approveReminder(id: string) {
  const res = await authenticatedFetch(`/reminders/approve/${id}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to approve reminder");
  return res.json();
}

export async function sendReminder(id: string) {
  const res = await authenticatedFetch(`/reminders/dispatch/${id}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to send reminder");
  return res.json();
}

export async function getSettings() {
  const res = await authenticatedFetch("/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function saveSettings(data: any) {
  const res = await authenticatedFetch("/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save settings");
  return res.json();
}

export async function createAppointment(data: any) {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to schedule appointment");
  return res.json();
}

