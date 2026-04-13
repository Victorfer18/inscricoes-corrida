import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";

export async function handleGetPremios(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventoId = searchParams.get("evento_id");

    if (!eventoId) {
      return NextResponse.json(
        { success: false, error: "evento_id é obrigatório" },
        { status: 400 },
      );
    }

    const { data: premios, error } = await supabaseAdmin
      .from("premios")
      .select("*")
      .eq("evento_id", eventoId)
      .order("posicao", { ascending: true });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: { premios: premios ?? [] } });
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

export async function handlePostPremios(request: NextRequest) {
  try {
    const body = await request.json();
    const { evento_id, posicao, titulo, valor, descricao, icone, cor } = body;

    if (!evento_id) {
      return NextResponse.json(
        { success: false, error: "evento_id é obrigatório" },
        { status: 400 },
      );
    }

    const pos = Number.parseInt(String(posicao ?? "1"), 10);
    let valorNum: number | null = null;
    if (valor !== null && valor !== undefined && String(valor).trim() !== "") {
      const n =
        typeof valor === "number"
          ? valor
          : Number.parseFloat(String(valor).replace(",", "."));
      valorNum = Number.isFinite(n) ? n : null;
    }

    const { data: premio, error } = await supabaseAdmin
      .from("premios")
      .insert([
        {
          evento_id,
          posicao: Number.isFinite(pos) ? pos : 1,
          titulo: titulo ?? "",
          valor: valorNum,
          descricao: descricao ?? null,
          icone: icone ?? null,
          cor: cor ?? null,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: { premio } });
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

export const GET = requireAuth(handleGetPremios);
export const POST = requireAuth(handlePostPremios);
