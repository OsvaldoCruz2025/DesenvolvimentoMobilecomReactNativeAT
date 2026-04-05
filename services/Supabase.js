import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Verifica se as credenciais do Supabase estão configuradas
const isSupabaseConfigured =
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes("sua_url") &&
  !SUPABASE_ANON_KEY.includes("sua_chave");

// Se não estiver configurado, cria um cliente falso para não quebrar o app
let supabase;

if (isSupabaseConfigured) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  console.log("✅ Supabase configurado");
} else {
  console.warn(
    "⚠️ Supabase não configurado. Configure o .env para usar autenticação.",
  );
  // Cliente falso para não quebrar o app
  supabase = {
    auth: {
      signUp: async () => ({
        data: null,
        error: { message: "Supabase não configurado" },
      }),
      signInWithPassword: async () => ({
        data: null,
        error: { message: "Supabase não configurado" },
      }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  };
}

export { supabase, isSupabaseConfigured };
