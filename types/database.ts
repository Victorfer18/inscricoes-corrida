export interface InscricaoData {
  id?: string;
  nome_completo: string;
  cpf: string;
  idade: number;
  sexo: "Masculino" | "Feminino";
  celular: string;
  email?: string;
  tamanho_blusa: string;
  comprovante_file_id: string; // Referência do arquivo, não URL completa
  status: "pendente" | "confirmado" | "cancelado";
  created_at?: string;
  updated_at?: string;
}

export interface FileUploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface InscricaoCreateRequest {
  formData: Omit<
    InscricaoData,
    "id" | "comprovante_file_id" | "status" | "created_at" | "updated_at"
  >;
  file: File;
}

export interface InscricaoCreateResponse extends ApiResponse {
  data?: {
    inscricao: InscricaoData;
    fileUpload: FileUploadResponse;
  };
}
