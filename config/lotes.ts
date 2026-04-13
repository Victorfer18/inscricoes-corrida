import { getKitItemsByIds } from "@/constants/kits";
import type { PremioPublic } from "@/types/evento-home";

export interface KitItem {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
}

export interface LoteBasico {
  id: string;
  nome: string;
  total_vagas: number;
  status: boolean;
  valor: number;
  /** IDs cadastrados no admin (ex.: camiseta, medalha) ou objetos completos, se vierem do banco */
  kit_items?: string[] | KitItem[];
  requisitos_especiais?: string;
}

export interface LoteComKit extends LoteBasico {
  requisitos_especiais?: string;
  kit_items: KitItem[];
}

export const KIT_ITEMS: Record<string, KitItem> = {
  camiseta: {
    id: "camiseta",
    name: "Camiseta Oficial",
    description:
      "Camiseta exclusiva do evento com design Outubro Rosa em tecido dry-fit de alta qualidade",
    image: "/kit/camiseta.png",
    icon: "👕",
  },
  medalha: {
    id: "medalha",
    name: "Medalha de Participação",
    description:
      "Medalha comemorativa personalizada para todos os participantes da corrida",
    image: "/kit/medalha.png",
    icon: "🏅",
  },
  bolsa: {
    id: "bolsa",
    name: "Bolsa Esportiva",
    description:
      "Bolsa prática e resistente para carregar seus pertences durante o evento",
    image: "/kit/bolsa.png",
    icon: "🎒",
  },
  garrafa: {
    id: "garrafa",
    name: "Garrafa de Água",
    description:
      "Garrafa reutilizável com logo do evento para hidratação durante a corrida",
    image: "/kit/garrafa.png",
    icon: "💧",
  },
  barra: {
    id: "barra",
    name: "Barra Energética",
    description: "Barra nutritiva para dar energia antes ou depois da corrida",
    image: "/kit/barra.png",
    icon: "🍫",
  },
};

export const aplicarConfiguracaoLote = (loteBasico: LoteBasico): LoteComKit => {
  const raw = loteBasico.kit_items;
  if (Array.isArray(raw) && raw.length > 0) {
    const head = raw[0];
    if (typeof head === "string") {
      const resolved = getKitItemsByIds(raw as string[]);
      if (resolved.length > 0) {
        return {
          ...loteBasico,
          kit_items: resolved,
          requisitos_especiais: loteBasico.requisitos_especiais,
        };
      }
    } else if (typeof head === "object" && head !== null && "name" in head) {
      return {
        ...loteBasico,
        kit_items: raw as KitItem[],
        requisitos_especiais: loteBasico.requisitos_especiais,
      };
    }
  }

  const loteComKit: LoteComKit = {
    ...loteBasico,
    kit_items: [],
    requisitos_especiais: loteBasico.requisitos_especiais,
  };

  switch (loteBasico.nome) {
    case "1º Lote":
      loteComKit.kit_items = [
        KIT_ITEMS.camiseta,
        KIT_ITEMS.medalha,
        KIT_ITEMS.bolsa,
        KIT_ITEMS.garrafa,
        KIT_ITEMS.barra,
      ];
      break;

    case "2º Lote":
      loteComKit.kit_items = [
        KIT_ITEMS.camiseta,
        KIT_ITEMS.barra,
        KIT_ITEMS.medalha,
      ];
      loteComKit.requisitos_especiais =
        "Para retirar o kit é necessário trazer 1kg de alimento não perecível";
      break;

    case "3º Lote":
      loteComKit.kit_items = [KIT_ITEMS.camiseta, KIT_ITEMS.medalha];
      break;

    default:
      loteComKit.kit_items = [
        KIT_ITEMS.camiseta,
        KIT_ITEMS.medalha,
        KIT_ITEMS.bolsa,
        KIT_ITEMS.garrafa,
        KIT_ITEMS.barra,
      ];
      break;
  }

  return loteComKit;
};

export const fetchLoteVigente = async (): Promise<{
  evento: Record<string, unknown> | null;
  loteVigente: LoteComKit | null;
  premios: PremioPublic[];
} | null> => {
  try {
    const response = await fetch("/api/evento-vigente");
    const result = await response.json();

    if (!result.success) {
      return null;
    }

    const { evento, loteVigente, premios } = result.data;
    const premiosList = (premios as PremioPublic[]) ?? [];

    if (!evento) {
      return { evento: null, loteVigente: null, premios: premiosList };
    }

    if (!loteVigente) {
      return {
        evento: evento as Record<string, unknown>,
        loteVigente: null,
        premios: premiosList,
      };
    }

    return {
      evento: evento as Record<string, unknown>,
      loteVigente: aplicarConfiguracaoLote(loteVigente),
      premios: premiosList,
    };
  } catch {
    return null;
  }
};

export const fetchAllLotes = async (): Promise<LoteComKit[]> => {
  try {
    // Para recuperar todos os lotes agora passamos por um evento em especifico no admin. 
    // Na tela pública, não listamos "todos os lotes" abertos a não ser os do evento vigente (já fetcheado na linha de cima).
    return [];
  } catch (error) {
    return [];
  }
};
