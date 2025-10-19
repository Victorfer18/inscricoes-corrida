import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ fileId: string }> },
): Promise<NextResponse> {
  try {
    const { fileId } = await context.params;

    if (!fileId) {
      return NextResponse.json(
        { error: "ID do arquivo não fornecido" },
        { status: 400 },
      );
    }

    // URL direta do Google Drive para visualização
    const googleDriveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    // Fazer fetch da imagem
    const response = await fetch(googleDriveUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
        { status: 404 },
      );
    }

    // Obter o tipo de conteúdo
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // Obter os bytes da imagem
    const imageBuffer = await response.arrayBuffer();

    // Retornar a imagem com os headers corretos
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache por 24 horas
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    console.error("Erro ao carregar arquivo do Google Drive:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
