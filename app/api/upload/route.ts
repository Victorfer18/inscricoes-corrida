import { NextRequest, NextResponse } from 'next/server';
import { fileStorageService } from '@/lib/services/file-storage';
import { ApiResponse, FileUploadResponse } from '@/types/database';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<FileUploadResponse>>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum arquivo foi enviado'
      }, { status: 400 });
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/jpg',
      'image/gif',
      'application/pdf',
      'image/webp',
      'image/bmp',
      'image/tiff'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Tipo de arquivo não permitido'
      }, { status: 400 });
    }

    const maxSize = file.type === 'application/pdf' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: `Arquivo muito grande. Máximo permitido: ${file.type === 'application/pdf' ? '10MB' : '5MB'}`
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    const fileName = `comprovante_${timestamp}_${file.name}`;

    const uploadResult = await fileStorageService.uploadFile(
      buffer,
      fileName,
      file.type
    );

    return NextResponse.json({
      success: true,
      data: uploadResult,
      message: 'Arquivo enviado com sucesso'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}
