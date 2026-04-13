"use client";

import { useLoteVigente } from "@/hooks/useLoteVigente";
import { formatarMoeda } from "@/lib/utils";

interface InscricaoStatsProps {
  className?: string;
}

export function InscricaoStats({ className = "" }: InscricaoStatsProps) {
  const { loteVigente, valor, loading, error, homeConfig } = useLoteVigente();
  
  if (loading) {
    return (
      <div className={`text-center ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Carregando informações do lote...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">
            ⚠️ Erro ao carregar informações do lote
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Tente recarregar a página
          </p>
        </div>
      </div>
    );
  }

  // Se não há lote ativo, não mostra nada
  if (!loteVigente) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-lg text-blue-700 dark:text-blue-300 font-semibold">
            📊 Estatísticas do Evento
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            Inscrições encerradas - Evento confirmado!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="space-y-3">
        <div className="bg-violet-50/90 dark:bg-violet-950/25 p-4 rounded-lg border border-violet-200 dark:border-indigo-800">
          <p
            className="text-lg font-semibold break-words leading-relaxed"
            style={{ color: "var(--event-gradient-from)" }}
          >
            🎁{" "}
            <span className="inline-block">
              {loteVigente?.nome || "Lote Atual"}
            </span>
          </p>
          <p
            className="text-2xl font-bold mt-2"
            style={{ color: "var(--event-primary)" }}
          >
            {formatarMoeda(valor)}
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--event-primary)" }}
          >
            {loteVigente?.total_vagas
              ? `${loteVigente.total_vagas} vagas disponíveis`
              : "Vagas limitadas"}
          </p>
          <p
            className="text-xs mt-1 whitespace-pre-line opacity-90"
            style={{ color: "var(--event-primary)" }}
          >
            {homeConfig.inscricao.statsBlurb}
          </p>
          {loteVigente?.requisitos_especiais && (
            <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-1">
                ⚠️ Requisito Especial:
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                {loteVigente.requisitos_especiais}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
