/** Conteúdo da home armazenado em eventos.config (JSONB) + premios na tabela premios */

export type ModalidadeTheme = "pink" | "purple";

export interface ModalidadeDetalhe {
  emoji: string;
  label: string;
  value: string;
}

export interface ModalidadeCard {
  icon: string;
  titulo: string;
  subtitulo: string;
  theme: ModalidadeTheme;
  detalhes: ModalidadeDetalhe[];
}

export interface CausaCard {
  icon: string;
  titulo: string;
  texto: string;
}

/** Cores em hex (#rrggbb). Aplicadas como variáveis CSS no `document.documentElement`. */
export interface EventoThemeConfig {
  /** Gradiente marca (navbar, hero, botões) — ex.: roxo #8b5cf6 */
  gradientFrom: string;
  /** Outra ponta do gradiente — ex.: azul marinho #1e1b4b (arte da camisa) */
  gradientTo: string;
  /** Destaques, preço, ícones (ex.: indigo #6366f1) */
  primary: string;
  /** Gradiente do header do card “Inscrições abertas” / Inscreva-se */
  inscriptionHeaderFrom: string;
  inscriptionHeaderTo: string;
}

export interface EventoHomeConfig {
  /** Metadados de UI global (além de `eventos.nome`, `local`, etc.) */
  site?: {
    /** Texto ao lado do logo na navbar (ex.: “CORRIDA SOLIDÁRIA”). Se vazio, usa nome curto do evento. */
    brandSubtitle?: string;
    /** Se false, esconde “Inscreva-se” na navbar mesmo com lote aberto */
    showNavInscricao?: boolean;
    /** Usado na home se a coluna `eventos.local` estiver vazia (quebras com `\n`) */
    localFallback?: string;
  };
  theme: EventoThemeConfig;
  hero: {
    chipText: string;
    slogan: string;
  };
  /** Parágrafo introdutório (texto puro; quebras com \n se quiser) */
  intro: string;
  horario: {
    principal: string;
    concentracaoLabel: string;
    concentracaoDetalhe: string;
  };
  modalidades: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: ModalidadeCard[];
  };
  inscricao: {
    tituloAberto: string;
    subtituloAberto: string;
    beneficios: string[];
    statsBlurb: string;
    encerradoTitulo: string;
    encerradoSub: string;
    encerradoEmoji: string;
  };
  kit: {
    sectionTitle: string;
    sectionSubtitle: string;
    footerTitulo: string;
    /** Use {count} e {valor} como placeholders opcionais no futuro; por ora texto livre */
    footerLinhaTemplate: string;
  };
  premiosSection: {
    titulo: string;
    subtitulo: string;
  };
  brindes: {
    titulo: string;
    texto: string;
  };
  causas: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: CausaCard[];
  };
  contato: {
    sectionTitle: string;
    redesSubtitle: string;
    diretoTitulo: string;
    whatsappTexto: string;
    organizacaoTexto: string;
  };
  logo?: {
    alt?: string;
    /** Se preenchido, substitui /logo-*.png */
    imageUrl?: string | null;
  };
}

export interface PremioPublic {
  id: string;
  posicao: number;
  titulo: string | null;
  valor: number | null;
  descricao: string | null;
  icone: string | null;
  cor: string | null;
}
