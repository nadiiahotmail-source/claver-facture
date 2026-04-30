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
