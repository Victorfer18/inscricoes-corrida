"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  fetchLoteVigente,
  type LoteComKit,
  type KitItem,
} from "@/config/lotes";
import { mergeHomeConfig } from "@/lib/evento-home-defaults";
import type { EventoHomeConfig, PremioPublic } from "@/types/evento-home";

export interface UseLoteVigenteReturn {
  evento: Record<string, unknown> | null;
  loteVigente: LoteComKit | null;
  valor: number;
  kitItems: KitItem[];
  premios: PremioPublic[];
  homeConfig: EventoHomeConfig;
  loading: boolean;
  error: string | null;
  /** Inscrições abertas = evento ativo + lote vigente */
  inscricoesAbertas: boolean;
}

const EventoPublicContext = createContext<UseLoteVigenteReturn | null>(null);

function applyThemeVars(config: EventoHomeConfig) {
  const t = config.theme;
  const root = document.documentElement;
  root.style.setProperty("--event-gradient-from", t.gradientFrom);
  root.style.setProperty("--event-gradient-to", t.gradientTo);
  root.style.setProperty("--event-primary", t.primary);
  root.style.setProperty("--event-inscription-from", t.inscriptionHeaderFrom);
  root.style.setProperty("--event-inscription-to", t.inscriptionHeaderTo);
}

export function EventoPublicProvider({ children }: { children: ReactNode }) {
  const [evento, setEvento] = useState<Record<string, unknown> | null>(null);
  const [loteVigente, setLoteVigente] = useState<LoteComKit | null>(null);
  const [premios, setPremios] = useState<PremioPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const homeConfig = useMemo(
    () => mergeHomeConfig(evento?.config),
    [evento],
  );

  useEffect(() => {
    applyThemeVars(homeConfig);
  }, [homeConfig]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLoteVigente();

        if (data) {
          setEvento(data.evento);
          setLoteVigente(data.loteVigente);
          setPremios(data.premios);
        } else {
          setEvento(null);
          setLoteVigente(null);
          setPremios([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const value: UseLoteVigenteReturn = {
    evento,
    loteVigente,
    valor: loteVigente?.valor || 0,
    kitItems: loteVigente?.kit_items || [],
    premios,
    homeConfig,
    loading,
    error,
    inscricoesAbertas: Boolean(evento && loteVigente),
  };

  return (
    <EventoPublicContext.Provider value={value}>
      {children}
    </EventoPublicContext.Provider>
  );
}

export function useLoteVigente(): UseLoteVigenteReturn {
  const ctx = useContext(EventoPublicContext);
  if (!ctx) {
    throw new Error(
      "useLoteVigente deve ser usado dentro de EventoPublicProvider",
    );
  }
  return ctx;
}
