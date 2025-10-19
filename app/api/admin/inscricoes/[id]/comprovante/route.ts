import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-middleware";
import { fileStorageService } from "@/lib/services/file-storage";
import { AdminUser } from "@/types/admin";

async function handleUpdateComprovante(
  request: NextRequest,
  user: AdminUser,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get("comprovante") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Arquivo não fornecido" },
        { status: 400 },
      );
    }

    // Validar tipo de arquivo
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "application/pdf",
      "image/webp",
      "image/bmp",
      "image/tiff",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Tipo de arquivo não permitido" },
        { status: 400 },
      );
    }

    // Validar tamanho (10MB para PDF, 5MB para imagens)
    const maxSize =
      file.type === "application/pdf" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `Arquivo muito grande. Máximo permitido: ${file.type === "application/pdf" ? "10MB" : "5MB"}`,
        },
        { status: 400 },
      );
    }

    // Buscar inscrição atual para pegar o comprovante antigo
    const { data: inscricao, error: fetchError } = await supabaseAdmin
      .from("inscricoes")
      .select("comprovante_file_id")
      .eq("id", id)
      .single();

    if (fetchError || !inscricao) {
      return NextResponse.json(
        { success: false, error: "Inscrição não encontrada" },
        { status: 404 },
      );
    }

    // Upload do novo arquivo
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await fileStorageService.uploadFile(
      fileBuffer,
      file.name,
      file.type,
    );

    if (!uploadResult || !uploadResult.fileId) {
      return NextResponse.json(
        { success: false, error: "Erro ao fazer upload do arquivo" },
        { status: 500 },
      );
    }

    // Atualizar inscrição com novo comprovante
    const { data: updatedInscricao, error: updateError } = await supabaseAdmin
      .from("inscricoes")
      .update({
        comprovante_file_id: uploadResult.fileId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      // Se falhou ao atualizar, deletar o arquivo que foi feito upload
      if (uploadResult.fileId) {
        await fileStorageService.deleteFile(uploadResult.fileId);
      }
      throw new Error(updateError.message);
    }

    // Deletar comprovante antigo se existir
    if (inscricao.comprovante_file_id) {
      try {
        await fileStorageService.deleteFile(inscricao.comprovante_file_id);
      } catch (deleteError) {
        console.warn("Erro ao deletar arquivo antigo:", deleteError);
        // Não falhar a operação por causa disso
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        inscricao: updatedInscricao,
        comprovante_url: `/api/files/${uploadResult.fileId}`,
      },
      message: "Comprovante atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar comprovante:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}

export const POST = requireAuth(handleUpdateComprovante);
