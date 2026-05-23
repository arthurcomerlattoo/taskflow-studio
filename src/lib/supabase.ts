/* import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
 */
import { createClient } from "@supabase/supabase-js";

// 1. Tenta ler as variáveis locais do seu computador
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Valores fixos que vão salvar o build no GitHub Pages (Insira seus dados reais aqui)
const fallbackUrl = "https://czhybesqyonotfcepgdh.supabase.co";
const fallbackAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6aHliZXNxeW9ub3RmY2VwZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDc1MjAsImV4cCI6MjA5NDYyMzUyMH0.tzjQt2L6FaBNRWJPG5oFX-DZNuca71R9rOvIeksBvfE";

// 3. Escolha automática: se não achar a variável de ambiente, usa o texto fixo
const supabaseUrl = envUrl || fallbackUrl;
const supabaseAnonKey = envAnonKey || fallbackAnonKey;

// O erro foi removido daqui para nunca mais travar o deploy!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});