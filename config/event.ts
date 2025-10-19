export const eventConfig = {
  // Controle de inscrições
  inscricoesAbertas: false, // Mudado para false - inscrições finalizadas

  // Informações do evento
  local: "NS2 AO LADO DA QUADRA POLIESPORTIVA", // Novo local
  dataEvento: "26 de Outubro de 2025",
  horarioConcentracao: "06h00",
  horarioCaminhada: "07h00",
  horarioCorrida: "07h30",

  // Mensagens do modo finalizado
  mensagemInscricoesFinalizadas:
    "As inscrições para a 1ª Corrida Solidária Outubro Rosa foram encerradas!",
  mensagemEventoRealizado:
    "Obrigado a todos que participaram da nossa corrida! Acompanhe as fotos e resultados em nossas redes sociais.",

  // Configurações de exibição
  mostrarBotaoInscricao: false,
  mostrarProgressoInscricoes: true, // Manter para mostrar o total final
  mostrarInformacoesEvento: true,
} as const;

export type EventConfig = typeof eventConfig;
