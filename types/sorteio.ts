export interface Sorteio {
  id: string;
  titulo: string;
  descricao?: string;
  lote_id: string | null; // Null quando sorteio é de "todos os lotes"
  lote_nome: string;
  total_inscritos: number;
  total_sorteados: number;
  realizado_por: string;
  realizado_por_nome: string;
  status: "finalizado" | "cancelado";
  created_at: string;
  updated_at: string;
}

export interface SorteioParticipante {
  id: string;
  sorteio_id: string;
  inscricao_id: string;
  rodada: number;
  created_at: string;
  // Dados da inscrição (obtidos via JOIN)
  nome_completo?: string;
  cpf?: string;
  email?: string;
  celular?: string;
  idade?: number;
  sexo?: string;
  tamanho_blusa?: string;
}

export interface SorteioComParticipantes extends Sorteio {
  participantes: SorteioParticipante[];
}

export interface SalvarSorteioRequest {
  titulo: string;
  descricao?: string;
  lote_id: string | null; // Null para sorteios de "todos os lotes"
  lote_nome: string;
  total_inscritos: number;
  sorteados: Array<{
    inscricao_id: string;
    rodada: number;
  }>;
}

