import { createClient } from "./supabase";

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Si l'URL ne commence pas par http, on préfixe avec l'API_URL par défaut
  const finalUrl = url.startsWith("http") ? url : `${DEFAULT_API_URL}${url.startsWith("/") ? "" : "/"}${url}`;

  const headers = new Headers(options.headers || {});
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
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
