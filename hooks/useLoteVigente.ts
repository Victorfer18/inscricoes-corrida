"use client";

import { useState, useEffect } from "react";

import {
  fetchLoteVigente,
  type LoteComKit,
  type KitItem,
} from "@/config/lotes";

interface UseLoteVigenteReturn {
  evento: any | null;
  loteVigente: LoteComKit | null;
  valor: number;
  kitItems: KitItem[];
  loading: boolean;
  error: string | null;
}

export function useLoteVigente(): UseLoteVigenteReturn {
  const [evento, setEvento] = useState<any | null>(null);
  const [loteVigente, setLoteVigente] = useState<LoteComKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLoteVigente = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLoteVigente();

        if (data) {
          setEvento(data.evento);
          setLoteVigente(data.loteVigente);
        } else {
          setEvento(null);
          setLoteVigente(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    loadLoteVigente();
  }, []);

  return {
    evento,
    loteVigente,
    valor: loteVigente?.valor || 0,
    kitItems: loteVigente?.kit_items || [],
    loading,
    error,
  };
}
