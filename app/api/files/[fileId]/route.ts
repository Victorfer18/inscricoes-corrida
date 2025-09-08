import { NextRequest, NextResponse } from 'next/server';
import { fileStorageService } from '@/lib/services/file-storage';
import { ApiResponse } from '@/types/database';

interface RouteParams {
  params: {
    fileId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<{ url: string }>>> {
  try {
    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json({
        success: false,
        error: 'ID do arquivo não fornecido'
      }, { status: 400 });
    }

    const fileUrl = fileStorageService.getFileUrl(fileId);

    return NextResponse.json({
      success: true,
      data: { url: fileUrl }
    });

  } catch (error) {
    console.error('Erro ao obter URL do arquivo:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    const { fileId } = params;

    if (!fileId) {
      return NextResponse.json({
        success: false,
        error: 'ID do arquivo não fornecido'
      }, { status: 400 });
    }

    await fileStorageService.deleteFile(fileId);

    return NextResponse.json({
      success: true,
      message: 'Arquivo deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}
