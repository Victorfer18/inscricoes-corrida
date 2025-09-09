"use client";

import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";

import { useInscricaoStats } from "@/hooks/useInscricaoStats";

interface InscricaoStatsProps {
  className?: string;
}

export function InscricaoStats({ className = "" }: InscricaoStatsProps) {
  const {
    total,
    pendentes,
    confirmadas,
    porcentagem,
    limiteVagas,
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
          showValueLabel={true}
          size="lg"
          value={65}
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
        <Progress
          className="mb-2"
          color="success"
          showValueLabel={true}
          size="lg"
          value={65}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {total || 130} de {limiteVagas} vagas preenchidas (estimativa)
        </p>
        <p className="text-xs text-red-500 mt-1">
          Erro ao carregar dados em tempo real
        </p>
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
          {total} de {limiteVagas} vagas preenchidas
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300 font-semibold">
            🎁 1º Lote - R$ 79,90 e concorre a uma cesta básica!
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {getStatusMessage()}
          </p>
        </div>

        {porcentagem < 90 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
              🔔 2º Lote - Será divulgado em breve
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Assim que preencherem as vagas do primeiro lote. Não fiquem de
              fora, são muitas novidades por esta causa!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
