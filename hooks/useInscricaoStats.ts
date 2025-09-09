import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface InscricaoStats {
  total: number;
  pendentes: number;
  confirmadas: number;
  porcentagem: number;
  loading: boolean;
  error: string | null;
}

const LIMITE_VAGAS = 200; // Limite total de vagas

export function useInscricaoStats() {
  const [stats, setStats] = useState<InscricaoStats>({
    total: 0,
    pendentes: 0,
    confirmadas: 0,
    porcentagem: 0,
    loading: true,
    error: null
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Buscar total de inscrições
      const { count: totalCount, error: totalError } = await supabase
        .from('inscricoes')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Buscar inscrições por status
      const { data: statusData, error: statusError } = await supabase
        .from('inscricoes')
        .select('status');

      if (statusError) throw statusError;

      const total = totalCount || 0;
      const pendentes = statusData?.filter(item => item.status === 'pendente').length || 0;
      const confirmadas = statusData?.filter(item => item.status === 'confirmada').length || 0;
      const porcentagem = Math.round((total / LIMITE_VAGAS) * 100);

      setStats({
        total,
        pendentes,
        confirmadas,
        porcentagem: Math.min(porcentagem, 100), // Não passar de 100%
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
    }
  };

  useEffect(() => {
    fetchStats();

    // Atualizar a cada 30 segundos para manter dados atualizados
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...stats,
    limiteVagas: LIMITE_VAGAS,
    refetch: fetchStats
  };
}
