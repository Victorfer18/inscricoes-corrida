import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { ApiResponse } from "@/types/database";

interface LoteBasico {
  id: string;
  nome: string;
  total_vagas: number;
  status: boolean;
  valor: number;
}

export async function GET(): Promise<NextResponse<ApiResponse<{ lotes: LoteBasico[]; loteVigente: LoteBasico | null }>>> {
  try {
    const { data: lotes, error: lotesError } = await supabaseAdmin
      .from("lotes")
      .select("id, nome, total_vagas, status, valor")
      .order("nome", { ascending: true });

    if (lotesError) {
      throw new Error(lotesError.message);
    }

    const { data: loteVigente, error: loteVigenteError } = await supabaseAdmin
      .from("lotes")
      .select("id, nome, total_vagas, status, valor")
      .eq("status", true)
      .single();

    const loteVizenteResult = loteVigenteError ? null : loteVigente;

    return NextResponse.json({
      success: true,
      data: {
        lotes: lotes || [],
        loteVigente: loteVizenteResult,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 },
    );
  }
}
