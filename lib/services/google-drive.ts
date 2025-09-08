import { google } from 'googleapis';
import { config } from '../config';
import { Readable } from 'stream';

export interface FileUploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

class GoogleDriveService {
  private drive;
  private oauth2Client;

  constructor() {
    if (!config.googleDrive.clientId || !config.googleDrive.clientSecret) {
      throw new Error('Google Drive Client ID e Client Secret são obrigatórios');
    }
    
    if (!config.googleDrive.refreshToken) {
      throw new Error('Google Drive Refresh Token é obrigatório');
    }

    this.oauth2Client = new google.auth.OAuth2(
      config.googleDrive.clientId,
      config.googleDrive.clientSecret,
      'http://localhost:3000/api/auth/google/callback'
    );

    this.oauth2Client.setCredentials({
      refresh_token: config.googleDrive.refreshToken,
    });

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  async refreshAccessToken(): Promise<void> {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);
    } catch (error) {
      throw new Error('Falha ao renovar token de acesso do Google Drive');
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<FileUploadResponse> {
    try {
      await this.refreshAccessToken();

      const bufferStream = new Readable();
      bufferStream.push(fileBuffer);
      bufferStream.push(null);

      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: [config.googleDrive.folderId],
        },
        media: {
          mimeType: mimeType,
          body: bufferStream,
        },
        fields: 'id,name,size',
      });

      const fileId = response.data.id!;

      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return {
        fileId,
        fileName,
        fileSize: fileBuffer.length,
        mimeType,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Falha no upload do arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.drive.files.delete({
        fileId: fileId,
      });
    } catch (error) {
      throw new Error('Falha ao deletar arquivo');
    }
  }

  getFileUrl(fileId: string): string {
    return `${config.fileStorage.baseUrl}${fileId}`;
  }

  async getFileMetadata(fileId: string) {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id,name,size,mimeType,createdTime',
      });
      return response.data;
    } catch (error) {
      throw new Error('Falha ao obter informações do arquivo');
    }
  }
}

export const googleDriveService = new GoogleDriveService();
