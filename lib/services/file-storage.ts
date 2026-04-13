import { config, FileStorageProvider } from "../config";

import { googleDriveService, FileUploadResponse } from "./google-drive";

export interface FileStorageService {
  uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<FileUploadResponse>;
  deleteFile(fileId: string): Promise<void>;
  getFileUrl(fileId: string): string;
}

class GoogleDriveStorageService implements FileStorageService {
  async uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<FileUploadResponse> {
    return googleDriveService.uploadFile(file, fileName, mimeType);
  }

  async deleteFile(fileId: string): Promise<void> {
    return googleDriveService.deleteFile(fileId);
  }

  getFileUrl(fileId: string): string {
    return googleDriveService.getFileUrl(fileId);
  }
}

class ExternalApiStorageService implements FileStorageService {
  async uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<FileUploadResponse> {
    if (!config.fileStorage.externalApiUrl) {
      throw new Error("URL da API externa não configurada");
    }

    const formData = new FormData();

    formData.append("file", new Blob([file], { type: mimeType }), fileName);

    const response = await fetch(
      `${config.fileStorage.externalApiUrl}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Falha no upload via API externa");
    }

    const result = await response.json();

    return {
      fileId: result.fileId,
      fileName,
      fileSize: file.length,
      mimeType,
      uploadedAt: new Date().toISOString(),
    };
  }

  async deleteFile(fileId: string): Promise<void> {
    if (!config.fileStorage.externalApiUrl) {
      throw new Error("URL da API externa não configurada");
    }

    const response = await fetch(
      `${config.fileStorage.externalApiUrl}/files/${fileId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Falha ao deletar arquivo via API externa");
    }
  }

  getFileUrl(fileId: string): string {
    return `${config.fileStorage.baseUrl}${fileId}`;
  }
}

export function createFileStorageService(): FileStorageService {
  const provider: FileStorageProvider = config.fileStorage
    .provider as FileStorageProvider;

  switch (provider) {
    case "google_drive":
      return new GoogleDriveStorageService();
    case "external":
      return new ExternalApiStorageService();
    case "supabase":
      throw new Error("Supabase Storage não implementado ainda");
    default:
      throw new Error(`Provedor de armazenamento não suportado: ${provider}`);
  }
}

export const fileStorageService = createFileStorageService();
