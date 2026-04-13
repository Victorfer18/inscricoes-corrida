import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";

export interface EventoBasico {
  id: string;
  nome: string;
  data_evento: string | null;
  status: string;
}

async function handleGetEventos(request: NextRequest) {
  try {
    const { data: eventos, error } = await supabaseAdmin
      .from("eventos")
      .select("id, nome, data_evento, status")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        eventos: eventos || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}

export const GET = requireAuth(handleGetEventos);
