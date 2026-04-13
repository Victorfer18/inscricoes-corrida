"use client";

import { useState, useEffect } from "react";

interface InscricoesStats {
  total: number;
  loading: boolean;
  error: string | null;
}

export function useInscricoesStats(): InscricoesStats {
  const [stats, setStats] = useState<InscricoesStats>({
    total: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true, error: null }));

        // Buscar estatísticas básicas
        const response = await fetch("/api/admin/stats");
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Erro ao buscar estatísticas");
        }

        const { confirmadas, pendentes } = result.data;
        const total = confirmadas + pendentes;

        setStats({
          total,
          loading: false,
          error: null,
        });
      } catch (err) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Erro desconhecido",
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
}
