export interface KitItem {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
}

export const AVAILABLE_KIT_ITEMS: Record<string, KitItem> = {
  camiseta: {
    id: "camiseta",
    name: "Camiseta Oficial",
    description: "Camiseta exclusiva do evento em tecido dry-fit de alta qualidade",
    image: "/kit/camiseta.png",
    icon: "👕",
  },
  medalha: {
    id: "medalha",
    name: "Medalha de Participação",
    description: "Medalha comemorativa personalizada para todos os participantes da corrida",
    image: "/kit/medalha.png",
    icon: "🏅",
  },
  bolsa: {
    id: "bolsa",
    name: "Bolsa Esportiva",
    description: "Bolsa prática e resistente para carregar seus pertences durante o evento",
    image: "/kit/bolsa.png",
    icon: "🎒",
  },
  garrafa: {
    id: "garrafa",
    name: "Garrafa de Água",
    description: "Garrafa reutilizável com logo do evento para hidratação durante a corrida",
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

export const getKitItemsByIds = (ids: string[]): KitItem[] => {
  if (!ids || !Array.isArray(ids)) return [];
  return ids.map((id) => AVAILABLE_KIT_ITEMS[id]).filter(Boolean);
};
