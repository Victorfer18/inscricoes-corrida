import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // 1. Encontrar o Evento mais recente que esteja "ativo"
    const { data: eventoAtivo, error: eventoError } = await supabaseAdmin
      .from("eventos")
      .select("id, nome, descricao, data_evento, local, status")
      .eq("status", "ativo")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (eventoError) {
      throw new Error(eventoError.message);
    }

    if (!eventoAtivo) {
      // Nenhum evento ativo
      return NextResponse.json({
        success: true,
        data: {
          evento: null,
          loteVigente: null,
        },
      });
    }

    // 2. Encontrar o lote vigente atrelado a este evento
    const { data: loteVigente, error: loteError } = await supabaseAdmin
      .from("lotes")
      .select("id, nome, total_vagas, status, valor, evento_id, kit_items, requisitos_especiais")
      .eq("evento_id", eventoAtivo.id)
      .eq("status", true)
      .maybeSingle();

    if (loteError) {
      throw new Error(loteError.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        evento: eventoAtivo,
        loteVigente: loteVigente || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
