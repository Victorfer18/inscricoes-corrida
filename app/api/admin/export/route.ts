import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";
import { AdminUser, ROLE_PERMISSIONS } from "@/types/admin";
import { formatarCPF, formatarCelular } from "@/lib/utils";

async function handleExportInscricoes(request: NextRequest, user: AdminUser) {
  try {
    // Verificar permissão
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions.can_export_data) {
      return NextResponse.json(
        { success: false, error: "Sem permissão para exportar dados" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "xlsx";
    const status = searchParams.get("status");
    const loteId = searchParams.get("lote_id");

    // Construir query
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
        created_at,
        updated_at,
        lotes (
          nome
        )
      `);

    // Aplicar filtros
    if (status && status !== "todos") {
      query = query.eq("status", status);
    }

    if (loteId && loteId !== "todos") {
      query = query.eq("lote_id", loteId);
    }

    const { data: inscricoes, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Formatar dados para exportação
    const exportData = inscricoes?.map((inscricao: any) => ({
      "ID": inscricao.id,
      "Nome Completo": inscricao.nome_completo,
      "CPF": formatarCPF(inscricao.cpf),
      "Email": inscricao.email,
      "Celular": formatarCelular(inscricao.celular),
      "Idade": inscricao.idade,
      "Sexo": inscricao.sexo,
      "Tamanho da Blusa": inscricao.tamanho_blusa,
      "Status": inscricao.status,
      "Lote": inscricao.lotes?.nome || "N/A",
      "Data de Inscrição": new Date(inscricao.created_at).toLocaleString("pt-BR"),
      "Última Atualização": new Date(inscricao.updated_at).toLocaleString("pt-BR"),
    })) || [];

    if (format === "xlsx") {
      // Criar planilha Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inscrições");

      // Ajustar largura das colunas
      const colWidths = [
        { wch: 10 }, // ID
        { wch: 25 }, // Nome
        { wch: 15 }, // CPF
        { wch: 25 }, // Email
        { wch: 15 }, // Celular
        { wch: 8 },  // Idade
        { wch: 10 }, // Sexo
        { wch: 15 }, // Tamanho
        { wch: 12 }, // Status
        { wch: 15 }, // Lote
        { wch: 20 }, // Data Inscrição
        { wch: 20 }, // Última Atualização
      ];
      worksheet["!cols"] = colWidths;

      // Gerar buffer
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      const fileName = `inscricoes_${new Date().toISOString().split("T")[0]}.xlsx`;

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    } else if (format === "csv") {
      // Criar CSV
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      const fileName = `inscricoes_${new Date().toISOString().split("T")[0]}.csv`;

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Formato não suportado" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handleExportInscricoes);
