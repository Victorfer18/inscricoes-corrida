import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";
import { AdminUser } from "@/types/admin";

async function handleUpdateInscricao(
  request: NextRequest, 
  user: AdminUser,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, comprovante_url } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status é obrigatório" },
        { status: 400 }
      );
    }

    // Validar status
    const validStatuses = ["pendente", "confirmado", "cancelada"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status inválido" },
        { status: 400 }
      );
    }

    // Preparar dados para atualização
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Se foi fornecido um novo comprovante
    if (comprovante_url) {
      updateData.comprovante_url = comprovante_url;
    }

    // Atualizar inscrição
    const { data, error } = await supabaseAdmin
      .from("inscricoes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: "Inscrição atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar inscrição:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

async function handleGetInscricao(
  request: NextRequest,
  user: AdminUser,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { data: inscricao, error } = await supabaseAdmin
      .from("inscricoes")
      .select(`
        *,
        lotes (
          nome,
          total_vagas
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!inscricao) {
      return NextResponse.json(
        { success: false, error: "Inscrição não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: inscricao,
    });
  } catch (error) {
    console.error("Erro ao buscar inscrição:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

export const PUT = requireAuth(handleUpdateInscricao);
export const GET = requireAuth(handleGetInscricao);
