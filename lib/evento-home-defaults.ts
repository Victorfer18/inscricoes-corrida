import type { EventoHomeConfig, PremioPublic } from "@/types/evento-home";

/** Usado na home quando a tabela premios está vazia para o evento */
export const FALLBACK_PREMIOS: PremioPublic[] = [
  {
    id: "fallback-1",
    posicao: 1,
    titulo: "1º Lugar",
    valor: 500,
    descricao: "Troféu",
    icone: "🥇",
    cor: null,
  },
  {
    id: "fallback-2",
    posicao: 2,
    titulo: "2º Lugar",
    valor: 400,
    descricao: "Troféu",
    icone: "🥈",
    cor: null,
  },
  {
    id: "fallback-3",
    posicao: 3,
    titulo: "3º Lugar",
    valor: 300,
    descricao: "Troféu",
    icone: "🥉",
    cor: null,
  },
  {
    id: "fallback-4",
    posicao: 4,
    titulo: "4º Lugar",
    valor: 200,
    descricao: "Troféu",
    icone: "🏅",
    cor: null,
  },
  {
    id: "fallback-5",
    posicao: 5,
    titulo: "5º Lugar",
    valor: 150,
    descricao: "Troféu",
    icone: "🏅",
    cor: null,
  },
];

export const DEFAULT_HOME_CONFIG: EventoHomeConfig = {
  site: {
    brandSubtitle: "CORRIDA SOLIDÁRIA",
    showNavInscricao: true,
    localFallback:
      "NS2 — Projeto JAÍBA\nEm frente ao supermercado Luz",
  },
  /** Paleta alinhada à arte da camisa: roxo/violeta → azul marinho */
  theme: {
    gradientFrom: "#8b5cf6",
    gradientTo: "#1e1b4b",
    primary: "#6366f1",
    inscriptionHeaderFrom: "#7c3aed",
    inscriptionHeaderTo: "#1e1b4b",
  },
  hero: {
    chipText: "🏃‍♀️ PROJETO JAÍBA 🏃‍♂️",
    slogan: "“Eles e Elas Correndo Pela Vida”",
  },
  intro:
    "Participe deste importante evento! Uma corrida que une esporte, conscientização e solidariedade em apoio ao 4.4 da Gil Minas.\n\nCelebrando a vida e saúde: é uma maneira ativa de celebrar um novo ciclo, focando na longevidade e na funcionalidade do corpo.",
  horario: {
    principal: "06h00",
    concentracaoLabel: "Concentração",
    concentracaoDetalhe: "",
  },
  modalidades: {
    sectionTitle: "🏃‍♀️ Modalidades do Evento",
    sectionSubtitle: "Escolha sua modalidade e participe desta causa importante",
    items: [
      {
        icon: "🏃‍♀️",
        titulo: "Percurso 5 km",
        subtitulo: "Para os aventureiros",
        theme: "pink",
        detalhes: [
          { emoji: "⏰", label: "Largada:", value: "07h00" },
          { emoji: "📏", label: "Distância:", value: "5 quilômetros" },
          { emoji: "🎯", label: "Público:", value: "Atletas e entusiastas" },
          { emoji: "⏱️", label: "Duração:", value: "Aproximadamente 1 h" },
        ],
      },
    ],
  },
  inscricao: {
    tituloAberto: "💳 Inscrições Abertas!",
    subtituloAberto: "Garante já sua vaga nesta causa importante",
    beneficios: [
      "Kit completo incluso",
      "Medalha de participação",
      "Camiseta oficial do evento",
      "Hidratação durante o percurso",
      "Apoio médico e segurança",
    ],
    statsBlurb:
      "📝 Inscrições abertas! Kit completo incluso + concorre a uma cesta básica!",
    encerradoTitulo: "✅ Inscrições Encerradas!",
    encerradoSub:
      "Obrigado pelo interesse em participar desta causa importante",
    encerradoEmoji: "🎉",
  },
  kit: {
    sectionTitle: "🎁 Kit de Participação",
    sectionSubtitle:
      "Todos os participantes receberão um kit completo com itens exclusivos do evento",
    footerTitulo: "🎁 Kit Completo Incluso na Inscrição",
    footerLinhaTemplate:
      "Todos os {count} itens acima + hidratação durante o percurso + apoio médico",
  },
  premiosSection: {
    titulo: "🏆 Classificação e Premiação",
    subtitulo:
      "Será premiados do 1º ao 5º lugar geral, ao cruzar a faixa de chegada",
  },
  brindes: {
    titulo: "🎁 Brindes e Sorteios",
    texto:
      "Além da premiação principal, haverá diversos brindes e sorteios especiais durante o evento!",
  },
  causas: {
    sectionTitle: "💖 Uma Causa que Importa",
    sectionSubtitle:
      "Mais que uma corrida, um movimento de conscientização e solidariedade",
    items: [
      {
        icon: "🎗️",
        titulo: "Outubro Rosa",
        texto:
          "Campanha mundial de conscientização sobre a importância da prevenção e do diagnóstico precoce do câncer de mama. Juntos pela vida!",
      },
      {
        icon: "🤝",
        titulo: "Solidariedade",
        texto:
          "Arrecadação de alimentos não perecíveis para famílias em situação de vulnerabilidade social. Esporte que transforma vidas!",
      },
      {
        icon: "🏃‍♀️",
        titulo: "Saúde & Bem-estar",
        texto:
          "Promovendo a prática de atividades físicas e a integração da comunidade. Movimento que gera saúde e união!",
      },
    ],
  },
  contato: {
    sectionTitle: "Fique Conectado",
    redesSubtitle:
      "Siga nossas redes sociais e fique por dentro de todas as novidades do evento",
    diretoTitulo: "📞 Contato Direto",
    whatsappTexto: "WhatsApp: (31) 99820-9915 - Gil",
    organizacaoTexto: "Organização: Projeto Fitness - NS2",
  },
  logo: {
    alt: "Logo do Evento - Corrida Solidária Outubro Rosa",
    imageUrl: null,
  },
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

/** Valor antigo no JSON do banco que não deve sobrescrever o horário real do código. */
const HORARIO_PLACEHOLDER = /^a\s*confirmar\.?$/i;

function mergeHorario(
  d: EventoHomeConfig["horario"],
  raw: unknown,
): EventoHomeConfig["horario"] {
  if (!isRecord(raw)) return d;
  const merged = { ...d, ...raw };
  const p =
    typeof merged.principal === "string" ? merged.principal.trim() : "";
  const principal =
    !p || HORARIO_PLACEHOLDER.test(p) ? d.principal : merged.principal;
  return {
    principal,
    concentracaoLabel:
      typeof merged.concentracaoLabel === "string" &&
      merged.concentracaoLabel.trim()
        ? merged.concentracaoLabel
        : d.concentracaoLabel,
    concentracaoDetalhe:
      typeof merged.concentracaoDetalhe === "string"
        ? merged.concentracaoDetalhe
        : d.concentracaoDetalhe,
  };
}

/** Mescla JSON do banco com defaults (campos parciais ok). */
export function mergeHomeConfig(raw: unknown): EventoHomeConfig {
  const d = DEFAULT_HOME_CONFIG;
  if (!isRecord(raw)) return d;

  const hero = isRecord(raw.hero)
    ? { ...d.hero, ...raw.hero }
    : d.hero;
  const horario = mergeHorario(d.horario, raw.horario);
  const modalidades = isRecord(raw.modalidades)
    ? {
        sectionTitle:
          (raw.modalidades.sectionTitle as string) ?? d.modalidades.sectionTitle,
        sectionSubtitle:
          (raw.modalidades.sectionSubtitle as string) ??
          d.modalidades.sectionSubtitle,
        items: Array.isArray(raw.modalidades.items) &&
        raw.modalidades.items.length > 0
          ? (raw.modalidades.items as EventoHomeConfig["modalidades"]["items"])
          : d.modalidades.items,
      }
    : d.modalidades;
  const inscricao = isRecord(raw.inscricao)
    ? { ...d.inscricao, ...raw.inscricao }
    : d.inscricao;
  const kit = isRecord(raw.kit) ? { ...d.kit, ...raw.kit } : d.kit;
  const premiosSection = isRecord(raw.premiosSection)
    ? { ...d.premiosSection, ...raw.premiosSection }
    : d.premiosSection;
  const brindes = isRecord(raw.brindes) ? { ...d.brindes, ...raw.brindes } : d.brindes;
  const causas = isRecord(raw.causas)
    ? {
        sectionTitle:
          (raw.causas.sectionTitle as string) ?? d.causas.sectionTitle,
        sectionSubtitle:
          (raw.causas.sectionSubtitle as string) ?? d.causas.sectionSubtitle,
        items: Array.isArray(raw.causas.items) && raw.causas.items.length > 0
          ? (raw.causas.items as EventoHomeConfig["causas"]["items"])
          : d.causas.items,
      }
    : d.causas;
  const contato = isRecord(raw.contato) ? { ...d.contato, ...raw.contato } : d.contato;
  const logo =
    raw.logo === undefined
      ? d.logo
      : isRecord(raw.logo)
        ? { ...d.logo, ...raw.logo }
        : d.logo;

  const site = isRecord(raw.site) ? { ...d.site, ...raw.site } : d.site;
  const theme = isRecord(raw.theme)
    ? { ...d.theme, ...raw.theme }
    : d.theme;

  return {
    intro: typeof raw.intro === "string" ? raw.intro : d.intro,
    site,
    theme,
    hero,
    horario,
    modalidades,
    inscricao,
    kit,
    premiosSection,
    brindes,
    causas,
    contato,
    logo,
  };
}
