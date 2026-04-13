import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";

export async function handlePutLote(
  request: NextRequest,
  user: any,
  context: any
) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID não fornecido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { nome, valor, total_vagas, status, evento_id, kit_items, requisitos_especiais } = body;

    // Se estiver ativando este lote, desativar os outros do mesmo evento
    if (status) {
      await supabaseAdmin
        .from("lotes")
        .update({ status: false })
        .eq("evento_id", evento_id);
    }

    const { data: lote, error } = await supabaseAdmin
      .from("lotes")
      .update({
        nome,
        valor: typeof valor === 'string' ? parseFloat(valor) : valor,
        total_vagas: parseInt(total_vagas, 10),
        status,
        kit_items: kit_items || [],
        requisitos_especiais: requisitos_especiais || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: { lote } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}

export async function handleDeleteLote(
  request: NextRequest,
  user: any,
  context: any
) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID não fornecido" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("lotes")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}

export const PUT = requireAuth(handlePutLote);
export const DELETE = requireAuth(handleDeleteLote);
