import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";
import { AdminUser } from "@/types/admin";
import { SalvarSorteioRequest } from "@/types/sorteio";

// POST - Salvar novo sorteio
async function handleSalvarSorteio(request: NextRequest, user: AdminUser) {
  try {
    const body: SalvarSorteioRequest = await request.json();

    const {
      titulo,
      descricao,
      lote_id,
      lote_nome,
      total_inscritos,
      sorteados,
    } = body;

    if (!titulo || !lote_nome || !sorteados || sorteados.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados incompletos para salvar o sorteio",
        },
        { status: 400 },
      );
    }

    // Inserir sorteio principal
    const { data: sorteio, error: sorteioError } = await supabaseAdmin
      .from("sorteios")
      .insert({
        titulo,
        descricao,
        lote_id: lote_id || null, // Pode ser null para "todos os lotes"
        lote_nome,
        total_inscritos,
        total_sorteados: sorteados.length,
        realizado_por: user.id,
        realizado_por_nome: user.nome,
        status: "finalizado",
      })
      .select()
      .single();

    if (sorteioError) {
      throw new Error(sorteioError.message);
    }

    // Inserir participantes sorteados (apenas referências)
    const participantes = sorteados.map((s) => ({
      sorteio_id: sorteio.id,
      inscricao_id: s.inscricao_id,
      rodada: s.rodada,
    }));

    const { error: participantesError } = await supabaseAdmin
      .from("sorteio_participantes")
      .insert(participantes);

    if (participantesError) {
      // Reverter sorteio se falhar ao inserir participantes
      await supabaseAdmin.from("sorteios").delete().eq("id", sorteio.id);
      throw new Error(participantesError.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        sorteio_id: sorteio.id,
        message: "Sorteio salvo com sucesso!",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao salvar sorteio",
      },
      { status: 500 },
    );
  }
}

// GET - Listar sorteios com filtros
async function handleListarSorteios(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const loteId = searchParams.get("lote_id");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    let query = supabaseAdmin.from("sorteios").select("*", { count: "exact" });

    // Aplicar filtros
    if (loteId && loteId !== "todos") {
      query = query.eq("lote_id", loteId);
    }

    if (status && status !== "todos") {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `titulo.ilike.%${search}%,lote_nome.ilike.%${search}%,realizado_por_nome.ilike.%${search}%`,
      );
    }

    const {
      data: sorteios,
      error,
      count,
    } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      data: {
        sorteios: sorteios || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao listar sorteios",
      },
      { status: 500 },
    );
  }
}

export const POST = requireAuth(handleSalvarSorteio);
export const GET = requireAuth(handleListarSorteios);
