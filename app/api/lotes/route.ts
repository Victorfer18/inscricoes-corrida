import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { ApiResponse } from "@/types/database";
import { Lote } from "@/types/inscricao";

export async function GET(): Promise<NextResponse<ApiResponse<{ lotes: Lote[]; loteVigente: Lote | null }>>> {
  try {
    // Buscar todos os lotes ordenados por nome (ou outro campo disponível)
    const { data: lotes, error: lotesError } = await supabaseAdmin
      .from("lotes")
      .select("*")
      .order("nome", { ascending: true });

    if (lotesError) {
      throw new Error(lotesError.message);
    }

    // Buscar lote vigente
    const { data: loteVigente, error: loteVigenteError } = await supabaseAdmin
      .from("lotes")
      .select("*")
      .eq("status", true)
      .single();

    // Não é erro se não há lote vigente, apenas retorna null
    const loteVizenteResult = loteVigenteError ? null : loteVigente;

    return NextResponse.json({
      success: true,
      data: {
        lotes: lotes || [],
        loteVigente: loteVizenteResult,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar lotes:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 },
    );
  }
}
