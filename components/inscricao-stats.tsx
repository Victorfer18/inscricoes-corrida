"use client";

import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";

import { useInscricaoStats } from "@/hooks/useInscricaoStats";
import { PIX_INFO } from "@/types/inscricao";
import { formatarMoeda } from "@/lib/utils";

interface InscricaoStatsProps {
  className?: string;
}

export function InscricaoStats({ className = "" }: InscricaoStatsProps) {
  const {
    total,
    porcentagem,
    vagasRestantes,
    loteAtual,
    isUltimoLote,
    proximoLote,
    loading,
    error,
  } = useInscricaoStats();

  if (loading) {
    return (
      <div className={`text-center ${className}`}>
        <Progress
          isIndeterminate
          className="mb-2"
          color="success"
          size="lg"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Carregando estatísticas...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">
            ⚠️ Erro ao carregar informações das inscrições
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Tente recarregar a página
          </p>
        </div>
      </div>
    );
  }

  const getProgressColor = () => {
    if (porcentagem >= 90) return "danger";
    if (porcentagem >= 70) return "warning";

    return "success";
  };

  const getStatusMessage = () => {
    if (porcentagem >= 95) return "🔥 Últimas vagas disponíveis!";
    if (porcentagem >= 80) return "⚡ Vagas se esgotando rapidamente!";
    if (porcentagem >= 60) return "🏃‍♀️ Garante já sua vaga!";

    return "📝 Inscrições abertas!";
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="mb-4">
        <Progress
          className="mb-2"
          color={getProgressColor()}
          showValueLabel={true}
          size="lg"
          value={porcentagem}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {total} de {loteAtual?.total_vagas || 0} vagas preenchidas no {loteAtual?.nome || "lote atual"}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300 font-semibold break-words leading-relaxed">
            🎁 <span className="inline-block">{loteAtual?.nome || "Lote Atual"}</span> -{" "}
            <span className="inline-block font-bold">{formatarMoeda(PIX_INFO.valor)}</span>{" "}
            e concorre a uma cesta básica!
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {getStatusMessage()}
          </p>
        </div>

        {/* Mostrar aviso sobre próximo lote se não for o último */}
        {!isUltimoLote && proximoLote && porcentagem >= 80 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
              🔔 {proximoLote.nome} - Será divulgado em breve
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Assim que preencherem as vagas do {loteAtual?.nome}. Não fiquem de
              fora, são muitas novidades por esta causa!
            </p>
          </div>
        )}

        {/* Mostrar aviso de último lote */}
        {isUltimoLote && (
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-700 dark:text-purple-300 font-semibold">
              🚀 Último Lote - Últimas vagas!
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Esta é sua última chance de participar da corrida!
            </p>
          </div>
        )}

        {/* Mostrar aviso sobre próximo lote se ainda não estiver próximo do fim */}
        {!isUltimoLote && proximoLote && porcentagem < 80 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
              🔔 {proximoLote.nome} - Será divulgado em breve
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Assim que preencherem as vagas do {loteAtual?.nome}. Não fiquem de
              fora, são muitas novidades por esta causa!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
