import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";
import { fileStorageService } from "@/lib/services/file-storage";
import { emailService } from "@/lib/services/email-service";
import { limparCPF, limparCelular } from "@/lib/utils";
import {
  ApiResponse,
  InscricaoData,
  InscricaoCreateResponse,
} from "@/types/database";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<InscricaoCreateResponse>> {
  try {
    const formData = await request.formData();

    // Extrair dados do formulário
    const inscricaoData = {
      nome_completo: formData.get("nome_completo") as string,
      cpf: limparCPF(formData.get("cpf") as string), // Remove formatação do CPF
      idade: parseInt(formData.get("idade") as string),
      sexo: formData.get("sexo") as "Masculino" | "Feminino",
      celular: limparCelular(formData.get("celular") as string), // Remove formatação do celular
      email: (formData.get("email") as string) || null,
      tamanho_blusa: formData.get("tamanho_blusa") as string,
    };

    const file = formData.get("comprovante") as File;

    if (
      !inscricaoData.nome_completo ||
      !inscricaoData.cpf ||
      !inscricaoData.celular ||
      !file
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados obrigatórios não fornecidos",
        },
        { status: 400 },
      );
    }

    const { data: existingInscricao } = await supabaseAdmin
      .from("inscricoes")
      .select("id")
      .eq("cpf", inscricaoData.cpf) // CPF já está limpo
      .single();

    if (existingInscricao) {
      return NextResponse.json(
        {
          success: false,
          error: "CPF já cadastrado",
        },
        { status: 409 },
      );
    }

    // Buscar lote vigente (status = true)
    const { data: loteVigente, error: loteError } = await supabaseAdmin
      .from("lotes")
      .select("*")
      .eq("status", true)
      .single();

    if (loteError || !loteVigente) {
      return NextResponse.json(
        {
          success: false,
          error: "Nenhum lote vigente encontrado",
        },
        { status: 400 },
      );
    }

    // Verificar se ainda há vagas no lote vigente
    const { count: inscricoesNoLote } = await supabaseAdmin
      .from("inscricoes")
      .select("*", { count: "exact", head: true })
      .eq("lote_id", loteVigente.id);

    if (inscricoesNoLote && inscricoesNoLote >= loteVigente.total_vagas) {
      return NextResponse.json(
        {
          success: false,
          error: `Lote ${loteVigente.nome} esgotado. Aguarde o próximo lote.`,
        },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const timestamp = Date.now();
    const fileName = `comprovante_${timestamp}_${inscricaoData.cpf}_${file.name}`;

    const uploadResult = await fileStorageService.uploadFile(
      buffer,
      fileName,
      file.type,
    );

    const { data: inscricao, error: inscricaoError } = await supabaseAdmin
      .from("inscricoes")
      .insert({
        ...inscricaoData,
        comprovante_file_id: uploadResult.fileId,
        lote_id: loteVigente.id, // Vincular ao lote vigente
        status: "pendente",
      })
      .select()
      .single();

    if (inscricaoError) {
      try {
        await fileStorageService.deleteFile(uploadResult.fileId);
      } catch (deleteError) {
        // Falha silenciosa na limpeza
      }

      throw inscricaoError;
    }

    // Enviar email de confirmação (não bloquear o processo se falhar)
    if (inscricao && inscricao.email) {
      try {
        await emailService.sendConfirmationEmail(inscricao, loteVigente.valor);
      } catch (emailError) {}
    }

    return NextResponse.json({
      success: true,
      data: {
        inscricao,
        fileUpload: uploadResult,
      },
      message: "Inscrição realizada com sucesso",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<InscricaoData[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const cpf = searchParams.get("cpf");

    let query = supabaseAdmin.from("inscricoes").select("*");

    if (status) {
      query = query.eq("status", status);
    }

    if (cpf) {
      query = query.eq("cpf", limparCPF(cpf)); // Limpa CPF para busca
    }

    const { data: inscricoes, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: inscricoes,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    );
  }
}
