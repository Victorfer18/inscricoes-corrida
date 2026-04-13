import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // select('*') evita 500 quando o schema no Supabase ainda não tem alguma coluna listada
    // (ex.: kit_items); o PostgREST só devolve colunas que existem na tabela.
    const { data: eventosRows, error: eventoError } = await supabaseAdmin
      .from("eventos")
      .select("*")
      .eq("status", "ativo")
      // Sem .order("created_at"): evita erro se a coluna não existir no Supabase
      .limit(1);

    if (eventoError) {
      throw new Error(eventoError.message);
    }

    const eventoAtivo = eventosRows?.[0] ?? null;

    if (!eventoAtivo) {
      return NextResponse.json({
        success: true,
        data: {
          evento: null,
          loteVigente: null,
          premios: [],
        },
      });
    }

    // Lote vigente: status boolean true (schema README); limit(1) evita erro com vários ativos
    const { data: lotesRows, error: loteError } = await supabaseAdmin
      .from("lotes")
      .select("*")
      .eq("evento_id", eventoAtivo.id)
      .eq("status", true)
      .order("nome", { ascending: true })
      .limit(1);

    if (loteError) {
      throw new Error(loteError.message);
    }

    const loteVigente = lotesRows?.[0] ?? null;

    let premios: unknown[] = [];
    const premRes = await supabaseAdmin
      .from("premios")
      .select("id, posicao, titulo, valor, descricao, icone, cor")
      .eq("evento_id", eventoAtivo.id)
      .order("posicao", { ascending: true });

    if (premRes.error) {
      console.warn("[evento-vigente] premios:", premRes.error.message);
    } else {
      premios = premRes.data ?? [];
    }

    return NextResponse.json({
      success: true,
      data: {
        evento: eventoAtivo,
        loteVigente: loteVigente || null,
        premios,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
