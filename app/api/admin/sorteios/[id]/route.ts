import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";

// GET - Buscar detalhes de um sorteio específico com participantes
async function handleGetSorteio(
  request: NextRequest,
  user: any,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const { id } = params;

    // Buscar sorteio
    const { data: sorteio, error: sorteioError } = await supabaseAdmin
      .from("sorteios")
      .select("*")
      .eq("id", id)
      .single();

    if (sorteioError || !sorteio) {
      return NextResponse.json(
        {
          success: false,
          error: "Sorteio não encontrado",
        },
        { status: 404 },
      );
    }

    // Buscar participantes com JOIN para pegar dados da inscrição
    const { data: participantes, error: participantesError } =
      await supabaseAdmin
        .from("sorteio_participantes")
        .select(
          `
        id,
        sorteio_id,
        inscricao_id,
        rodada,
        created_at,
        inscricoes (
          nome_completo,
          cpf,
          email,
          celular,
          idade,
          sexo,
          tamanho_blusa
        )
      `,
        )
        .eq("sorteio_id", id)
        .order("rodada", { ascending: true });

    if (participantesError) {
      throw new Error(participantesError.message);
    }

    // Formatar participantes para incluir dados da inscrição
    const formattedParticipantes =
      participantes?.map((p: any) => ({
        id: p.id,
        sorteio_id: p.sorteio_id,
        inscricao_id: p.inscricao_id,
        rodada: p.rodada,
        created_at: p.created_at,
        nome_completo: p.inscricoes?.nome_completo,
        cpf: p.inscricoes?.cpf,
        email: p.inscricoes?.email,
        celular: p.inscricoes?.celular,
        idade: p.inscricoes?.idade,
        sexo: p.inscricoes?.sexo,
        tamanho_blusa: p.inscricoes?.tamanho_blusa,
      })) || [];

    return NextResponse.json({
      success: true,
      data: {
        sorteio,
        participantes: formattedParticipantes,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar sorteio",
      },
      { status: 500 },
    );
  }
}

// DELETE - Cancelar sorteio
async function handleCancelarSorteio(
  request: NextRequest,
  user: any,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const { id } = params;

    const { error } = await supabaseAdmin
      .from("sorteios")
      .update({ status: "cancelado" })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Sorteio cancelado com sucesso",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao cancelar sorteio",
      },
      { status: 500 },
    );
  }
}

export const GET = requireAuth(handleGetSorteio);
export const DELETE = requireAuth(handleCancelarSorteio);
