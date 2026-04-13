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

export async function GET(request: Request): Promise<
  NextResponse<
    ApiResponse<{ lotes: LoteBasico[]; loteVigente: LoteBasico | null }>
  >
> {
  try {
    const { searchParams } = new URL(request.url);
    const eventoId = searchParams.get("evento_id");

    let lotesQuery = supabaseAdmin
      .from("lotes")
      .select("id, nome, total_vagas, status, valor")
      .order("nome", { ascending: true });

    if (eventoId && eventoId !== "todos") {
      lotesQuery = lotesQuery.eq("evento_id", eventoId);
    }

    const { data: lotes, error: lotesError } = await lotesQuery;

    if (lotesError) {
      throw new Error(lotesError.message);
    }

    let loteVigenteQuery = supabaseAdmin
      .from("lotes")
      .select("id, nome, total_vagas, status, valor")
      .eq("status", true);

    if (eventoId && eventoId !== "todos") {
      loteVigenteQuery = loteVigenteQuery.eq("evento_id", eventoId);
    }

    const { data: loteVigente, error: loteVigenteError } = await loteVigenteQuery.maybeSingle();

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
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 },
    );
  }
}
