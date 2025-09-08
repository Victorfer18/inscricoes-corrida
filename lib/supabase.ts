import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Cliente público (para uso no frontend)
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Cliente administrativo (para uso no backend)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export type Database = {
  public: {
    Tables: {
      inscricoes: {
        Row: {
          id: string;
          nome_completo: string;
          cpf: string;
          idade: number;
          sexo: 'Masculino' | 'Feminino';
          celular: string;
          email: string | null;
          tamanho_blusa: string;
          comprovante_file_id: string;
          status: 'pendente' | 'confirmado' | 'cancelado';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome_completo: string;
          cpf: string;
          idade: number;
          sexo: 'Masculino' | 'Feminino';
          celular: string;
          email?: string | null;
          tamanho_blusa: string;
          comprovante_file_id: string;
          status?: 'pendente' | 'confirmado' | 'cancelado';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome_completo?: string;
          cpf?: string;
          idade?: number;
          sexo?: 'Masculino' | 'Feminino';
          celular?: string;
          email?: string | null;
          tamanho_blusa?: string;
          comprovante_file_id?: string;
          status?: 'pendente' | 'confirmado' | 'cancelado';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
