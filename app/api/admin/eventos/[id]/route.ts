import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";

export async function handlePutEvento(
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
    const { nome, descricao, data_evento, local, status } = body;

    const { data: evento, error } = await supabaseAdmin
      .from("eventos")
      .update({
        nome,
        descricao,
        data_evento: data_evento || null,
        local,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: { evento } });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

export async function handleDeleteEvento(
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

    // Apenas tenta deletar. Se tiver restrição FKEY, o banco vai barrar (o que é o ideal).
    const { error } = await supabaseAdmin
      .from("eventos")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

export const PUT = requireAuth(handlePutEvento);
export const DELETE = requireAuth(handleDeleteEvento);
