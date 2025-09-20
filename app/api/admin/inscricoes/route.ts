import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";

interface InscricaoAdmin {
  id: string;
  nome_completo: string;
  cpf: string;
  email: string;
  celular: string;
  idade: number;
  sexo: string;
  tamanho_blusa: string;
  status: string;
  comprovante_url?: string;
  lote_nome?: string;
  lote_valor?: number;
  created_at: string;
  updated_at: string;
}

async function handleGetInscricoes(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const loteId = searchParams.get("lote_id");

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from("inscricoes")
      .select(`
        id,
        nome_completo,
        cpf,
        email,
        celular,
        idade,
        sexo,
        tamanho_blusa,
        status,
        comprovante_file_id,
        created_at,
        updated_at,
        lotes (
          nome,
          valor
        )
      `, { count: "exact" });

    if (status && status !== "todos") {
      query = query.eq("status", status);
    }

    if (loteId && loteId !== "todos") {
      query = query.eq("lote_id", loteId);
    }

    if (search) {
      query = query.or(`nome_completo.ilike.%${search}%,email.ilike.%${search}%,cpf.ilike.%${search}%`);
    }

    const { data: inscricoes, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    const formattedInscricoes: InscricaoAdmin[] = inscricoes?.map((inscricao: any) => ({
      id: inscricao.id,
      nome_completo: inscricao.nome_completo,
      cpf: inscricao.cpf,
      email: inscricao.email,
      celular: inscricao.celular,
      idade: inscricao.idade,
      sexo: inscricao.sexo,
      tamanho_blusa: inscricao.tamanho_blusa,
      status: inscricao.status,
      comprovante_url: inscricao.comprovante_file_id 
        ? `/api/files/${inscricao.comprovante_file_id}`
        : undefined,
      lote_nome: inscricao.lotes?.nome || "N/A",
      lote_valor: inscricao.lotes?.valor || undefined,
      created_at: inscricao.created_at,
      updated_at: inscricao.updated_at,
    })) || [];

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      data: {
        inscricoes: formattedInscricoes,
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
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleGetInscricoes);
