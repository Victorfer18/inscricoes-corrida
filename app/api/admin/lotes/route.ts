import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";

export async function handleGetLotes(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventoId = searchParams.get("evento_id");

    let query = supabaseAdmin
      .from("lotes")
      .select("id, nome, valor, total_vagas, status, evento_id, created_at, kit_items, requisitos_especiais")
      .order("created_at", { ascending: true });

    if (eventoId) {
      query = query.eq("evento_id", eventoId);
    }

    const { data: lotes, error } = await query;

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: { lotes } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}

export async function handlePostLote(request: NextRequest) {
  try {
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
      .insert([{ 
        nome, 
        valor: typeof valor === 'string' ? parseFloat(valor) : valor, 
        total_vagas: parseInt(total_vagas, 10), 
        status: status || false, 
        evento_id,
        kit_items: kit_items || [],
        requisitos_especiais: requisitos_especiais || null
      }])
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

export const GET = requireAuth(handleGetLotes);
export const POST = requireAuth(handlePostLote);
