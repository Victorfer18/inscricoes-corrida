import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import { Lote } from "@/types/inscricao";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface InscricaoStats {
  total: number;
  pendentes: number;
  confirmados: number;
  porcentagem: number;
  vagasRestantes: number;
  loteAtual: Lote | null;
  isUltimoLote: boolean;
  proximoLote: Lote | null;
  totalLotes: number;
  loading: boolean;
  error: string | null;
}

export function useInscricaoStats() {
  const [stats, setStats] = useState<InscricaoStats>({
    total: 0,
    pendentes: 0,
    confirmados: 0,
    porcentagem: 0,
    vagasRestantes: 0,
    loteAtual: null,
    isUltimoLote: false,
    proximoLote: null,
    totalLotes: 0,
    loading: true,
    error: null,
  });

  const fetchStats = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true, error: null }));

      // Buscar informações sobre todos os lotes
      const lotesResponse = await fetch("/api/lotes");
      const lotesResult = await lotesResponse.json();

      if (!lotesResult.success || !lotesResult.data) {
        throw new Error("Erro ao buscar informações dos lotes");
      }

      const { lotes, loteVigente } = lotesResult.data;

      if (!loteVigente) {
        throw new Error("Nenhum lote vigente encontrado");
      }

      // Determinar se é o último lote e qual é o próximo
      // Ordenar por nome para manter consistência
      const lotesOrdenados = lotes.sort((a: Lote, b: Lote) =>
        a.nome.localeCompare(b.nome),
      );

      const indexLoteAtual = lotesOrdenados.findIndex(
        (lote: Lote) => lote.id === loteVigente.id,
      );
      const isUltimoLote = indexLoteAtual === lotesOrdenados.length - 1;
      const proximoLote = isUltimoLote
        ? null
        : lotesOrdenados[indexLoteAtual + 1];

      // Buscar inscrições do lote vigente
      const { count: totalCount, error: totalError } = await supabase
        .from("inscricoes")
        .select("*", { count: "exact", head: true })
        .eq("lote_id", loteVigente.id);

      if (totalError) throw totalError;

      // Buscar inscrições por status no lote vigente
      const { data: statusData, error: statusError } = await supabase
        .from("inscricoes")
        .select("status")
        .eq("lote_id", loteVigente.id);

      if (statusError) throw statusError;

      const total = totalCount || 0;
      const pendentes =
        statusData?.filter((item) => item.status === "pendente").length || 0;
      const confirmados =
        statusData?.filter((item) => item.status === "confirmado").length || 0;
      const porcentagem = Math.round((total / loteVigente.total_vagas) * 100);
      const vagasRestantes = Math.max(0, loteVigente.total_vagas - total);

      setStats({
        total,
        pendentes,
        confirmados,
        porcentagem: Math.min(porcentagem, 100), // Não passar de 100%
        vagasRestantes,
        loteAtual: loteVigente,
        isUltimoLote,
        proximoLote,
        totalLotes: lotes.length,
        loading: false,
        error: null,
      });
    } catch (error) {
      // Apenas definir estado de erro, sem dados hardcoded
      setStats((prev) => ({
        ...prev,
        total: 0,
        pendentes: 0,
        confirmados: 0,
        porcentagem: 0,
        vagasRestantes: 0,
        loteAtual: null,
        isUltimoLote: false,
        proximoLote: null,
        totalLotes: 0,
        loading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
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
    refetch: fetchStats,
  };
}
