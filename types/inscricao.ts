export const TAMANHOS_BLUSA = ["P", "M", "G", "GG"] as const;
export const SEXO_OPTIONS = ["Feminino", "Masculino"] as const;

export interface Lote {
  id: string;
  nome: string;
  total_vagas: number;
  status: boolean;
}

export const PIX_INFO = {
  chavePix: "aa014320-6298-49d2-bbab-3836f99d9b93",
  nome: "Victor Fernando Magalhaes Vasconcelos",
  valor: 79.9, // Valor da inscrição
  descricao: "Inscrição Corrida Solidária Outubro Rosa - Projeto Jaíba",
  whatsapp: "31998209915",
} as const;
