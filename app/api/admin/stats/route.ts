import { NextRequest } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";

interface StatsResponse {
  total: number;
  confirmados: number;
  pendentes: number;
  canceladas: number;
}

async function handleGetStats(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const eventoId = searchParams.get("evento_id");

    let query = supabaseAdmin
      .from("inscricoes")
      .select(eventoId && eventoId !== "todos" ? "status, lotes!inner(evento_id)" : "status");

    if (eventoId && eventoId !== "todos") {
      query = query.eq("lotes.evento_id", eventoId);
    }

    const { data: rawInscricoes, error } = await query;

    if (error) {
      console.error("Erro ao buscar estatísticas:", error);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Erro ao buscar estatísticas",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const inscricoes = rawInscricoes as unknown as { status: string }[] | null;

    const stats: StatsResponse = {
      total: inscricoes?.length || 0,
      confirmados:
        inscricoes?.filter((i) => i.status === "confirmado").length || 0,
      pendentes: inscricoes?.filter((i) => i.status === "pendente").length || 0,
      canceladas:
        inscricoes?.filter((i) => i.status === "cancelada").length || 0,
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: stats,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Erro interno ao buscar estatísticas:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Erro interno do servidor",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const GET = requireAuth(handleGetStats);
