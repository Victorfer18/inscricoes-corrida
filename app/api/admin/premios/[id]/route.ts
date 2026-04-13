import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";

export async function handlePutPremio(
  request: NextRequest,
  _user: unknown,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID não fornecido" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { posicao, titulo, valor, descricao, icone, cor } = body;

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
      .update({
        posicao: Number.isFinite(pos) ? pos : 1,
        titulo: titulo ?? "",
        valor: valorNum,
        descricao: descricao ?? null,
        icone: icone ?? null,
        cor: cor ?? null,
      })
      .eq("id", id)
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

export async function handleDeletePremio(
  request: NextRequest,
  _user: unknown,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID não fornecido" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin.from("premios").delete().eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
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

export const PUT = requireAuth(handlePutPremio);
export const DELETE = requireAuth(handleDeletePremio);
