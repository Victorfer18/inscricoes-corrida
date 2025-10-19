import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "xlsx";
    const status = searchParams.get("status");
    const loteId = searchParams.get("lote_id");

    // Construir query
    let query = supabaseAdmin.from("inscricoes").select(`
        id,
        nome_completo,
        cpf,
        email,
        celular,
        idade,
        sexo,
        tamanho_blusa,
        status,
        number_shirt,
        created_at,
        updated_at,
        lotes (
          nome,
          valor
        )
      `);

    // Aplicar filtros
    if (status && status !== "todos") {
      query = query.eq("status", status);
    }

    if (loteId && loteId !== "todos") {
      query = query.eq("lote_id", loteId);
    }

    const { data: inscricoes, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Formatar dados para exportação
    const exportData =
      inscricoes?.map((inscricao: any) => ({
        ID: inscricao.id,
        "Número da Camisa": inscricao.number_shirt || "",
        "Nome Completo": inscricao.nome_completo || "",
        CPF: formatarCPF(inscricao.cpf),
        Email: inscricao.email || "",
        Celular: formatarCelular(inscricao.celular),
        Idade: inscricao.idade || 0,
        Sexo: inscricao.sexo || "",
        "Tamanho da Blusa": inscricao.tamanho_blusa || "",
        Status: inscricao.status || "",
        Lote: inscricao.lotes?.nome || "N/A",
        Valor: inscricao.lotes?.valor
          ? `R$ ${inscricao.lotes.valor.toFixed(2).replace(".", ",")}`
          : "N/A",
        "Data de Inscrição": inscricao.created_at
          ? new Date(inscricao.created_at).toLocaleString("pt-BR")
          : "",
        "Última Atualização": inscricao.updated_at
          ? new Date(inscricao.updated_at).toLocaleString("pt-BR")
          : "",
      })) || [];

    if (format === "xlsx") {
      // Criar planilha Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Inscrições");

      // Ajustar largura das colunas
      const colWidths = [
        { wch: 10 }, // ID
        { wch: 12 }, // Número da Camisa
        { wch: 25 }, // Nome
        { wch: 15 }, // CPF
        { wch: 25 }, // Email
        { wch: 15 }, // Celular
        { wch: 8 }, // Idade
        { wch: 10 }, // Sexo
        { wch: 15 }, // Tamanho
        { wch: 12 }, // Status
        { wch: 15 }, // Lote
        { wch: 12 }, // Valor
        { wch: 20 }, // Data Inscrição
        { wch: 20 }, // Última Atualização
      ];

      worksheet["!cols"] = colWidths;

      // Gerar buffer
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      const fileName = `inscricoes_${new Date().toISOString().split("T")[0]}.xlsx`;

      return new NextResponse(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
    } else if (format === "pdf") {
      // Criar PDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Verificar se há dados para exportar
      if (!exportData || exportData.length === 0) {
        return NextResponse.json(
          { success: false, error: "Nenhum dado encontrado para exportar" },
          { status: 404 },
        );
      }

      // Título
      doc.setFontSize(16);
      doc.text(
        "Relatório de Inscrições - Corrida Solidária Outubro Rosa",
        14,
        20,
      );

      // Data de geração
      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 14, 30);
      doc.text(`Total de registros: ${exportData.length}`, 14, 35);

      // Preparar dados para a tabela
      const tableData = exportData.map((item) => [
        item["Nome Completo"] || "",
        item["Número da Camisa"] || "",
        item["CPF"] || "",
        item["Email"] || "",
        item["Celular"] || "",
        (item["Idade"] || 0).toString(),
        item["Sexo"] || "",
        item["Tamanho da Blusa"] || "",
        item["Status"] || "",
        item["Lote"] || "",
        item["Valor"] || "",
        item["Data de Inscrição"] || "",
      ]);

      // Criar tabela
      autoTable(doc, {
        head: [
          [
            "Nome",
            "Nº Camisa",
            "CPF",
            "Email",
            "Celular",
            "Idade",
            "Sexo",
            "Tamanho",
            "Status",
            "Lote",
            "Valor",
            "Data",
          ],
        ],
        body: tableData,
        startY: 45,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [220, 20, 60], // Rosa
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Nome
          1: { cellWidth: 15 }, // Nº Camisa
          2: { cellWidth: 20 }, // CPF
          3: { cellWidth: 35 }, // Email
          4: { cellWidth: 20 }, // Celular
          5: { cellWidth: 12 }, // Idade
          6: { cellWidth: 15 }, // Sexo
          7: { cellWidth: 15 }, // Tamanho
          8: { cellWidth: 15 }, // Status
          9: { cellWidth: 15 }, // Lote
          10: { cellWidth: 12 }, // Valor
          11: { cellWidth: 30 }, // Data
        },
        margin: { top: 45, left: 14, right: 14 },
      });

      // Gerar buffer do PDF
      const pdfBuffer = doc.output("arraybuffer");
      const fileName = `inscricoes_${new Date().toISOString().split("T")[0]}.pdf`;

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Formato não suportado" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Erro ao exportar dados:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}

export const GET = requireAuth(handleExportInscricoes);
