"use client";

import { useState, useEffect } from "react";

import {
  fetchLoteVigente,
  type LoteComKit,
  type KitItem,
} from "@/config/lotes";

interface UseLoteVigenteReturn {
  loteVigente: LoteComKit | null;
  valor: number;
  kitItems: KitItem[];
  loading: boolean;
  error: string | null;
}

export function useLoteVigente(): UseLoteVigenteReturn {
  const [loteVigente, setLoteVigente] = useState<LoteComKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLoteVigente = async () => {
      try {
        setLoading(true);
        setError(null);
        const lote = await fetchLoteVigente();

        setLoteVigente(lote);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    loadLoteVigente();
  }, []);

  return {
    loteVigente,
    valor: loteVigente?.valor || 79.9,
    kitItems: loteVigente?.kit_items || [],
    loading,
    error,
  };
}
