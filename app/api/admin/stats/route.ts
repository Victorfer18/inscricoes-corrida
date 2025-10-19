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
    // Buscar todas as inscrições com contagem por status
    const { data: inscricoes, error } = await supabaseAdmin
      .from("inscricoes")
      .select("status");

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

    // Calcular estatísticas
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
