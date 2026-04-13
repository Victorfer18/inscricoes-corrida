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
      .select("id, nome, descricao, data_evento, local, status")
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

async function handlePostEvento(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Se "status" enviado não existir, forcar "ativo" ou o padrão banco.
    // Mas no caso é seguro tratar tudo o que vier validado do frontend.
    const { nome, descricao, data_evento, local, status, config } = body;

    const insertRow: Record<string, unknown> = {
      nome,
      descricao,
      data_evento: data_evento || null,
      local,
      status: status || "ativo",
    };
    if (config !== undefined) {
      insertRow.config = config;
    }

    const { data: evento, error } = await supabaseAdmin
      .from("eventos")
      .insert([insertRow])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      data: { evento },
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
export const POST = requireAuth(handlePostEvento);
