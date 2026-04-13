import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";

interface InscricaoConfirmada {
  id: string;
  nome_completo: string;
  cpf: string;
  email: string;
  celular: string;
  idade: number;
  sexo: string;
  tamanho_blusa: string;
  lote_nome: string;
  lote_valor: number;
  created_at: string;
}

async function handleGetInscricoesConfirmadas(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loteId = searchParams.get("lote_id");

    // Construir query base
    let query = supabaseAdmin
      .from("inscricoes")
      .select(
        `
        id,
        nome_completo,
        cpf,
        email,
        celular,
        idade,
        sexo,
        tamanho_blusa,
        created_at,
        lotes (
          nome,
          valor
        )
      `,
      )
      .eq("status", "confirmado");

    // Se não for "todos", filtrar por lote específico
    if (loteId && loteId !== "todos") {
      query = query.eq("lote_id", loteId);
    }

    // Buscar inscrições confirmadas
    const { data: inscricoes, error } = await query.order("nome_completo", {
      ascending: true,
    });

    if (error) {
      throw new Error(error.message);
    }

    const formattedInscricoes: InscricaoConfirmada[] =
      inscricoes?.map((inscricao: any) => ({
        id: inscricao.id,
        nome_completo: inscricao.nome_completo,
        cpf: inscricao.cpf,
        email: inscricao.email,
        celular: inscricao.celular,
        idade: inscricao.idade,
        sexo: inscricao.sexo,
        tamanho_blusa: inscricao.tamanho_blusa,
        lote_nome: inscricao.lotes?.nome || "N/A",
        lote_valor: inscricao.lotes?.valor || 0,
        created_at: inscricao.created_at,
      })) || [];

    return NextResponse.json({
      success: true,
      data: {
        inscricoes: formattedInscricoes,
        total: formattedInscricoes.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}

export const GET = requireAuth(handleGetInscricoesConfirmadas);
