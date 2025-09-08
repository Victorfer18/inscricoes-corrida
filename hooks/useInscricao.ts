import { useState } from 'react';
import { InscricaoCreateResponse, ApiResponse } from '@/types/database';

interface InscricaoFormData {
  nomeCompleto: string;
  cpf: string;
  idade: number;
  sexo: 'Masculino' | 'Feminino';
  celular: string;
  email?: string;
  tamanhoBlusa: string;
}

export function useInscricao() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitInscricao = async (
    formData: InscricaoFormData,
    comprovanteFile: File
  ): Promise<InscricaoCreateResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Preparar FormData para envio
      const submitFormData = new FormData();
      
      // Adicionar dados do formulário
      submitFormData.append('nome_completo', formData.nomeCompleto);
      submitFormData.append('cpf', formData.cpf);
      submitFormData.append('idade', formData.idade.toString());
      submitFormData.append('sexo', formData.sexo);
      submitFormData.append('celular', formData.celular);
      if (formData.email) {
        submitFormData.append('email', formData.email);
      }
      submitFormData.append('tamanho_blusa', formData.tamanhoBlusa);
      
      // Adicionar arquivo
      submitFormData.append('comprovante', comprovanteFile);

      // Enviar para API
      const response = await fetch('/api/inscricoes', {
        method: 'POST',
        body: submitFormData,
      });

      const result: InscricaoCreateResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar inscrição');
      }

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getFileUrl = async (fileId: string): Promise<string> => {
    try {
      const response = await fetch(`/api/files/${fileId}`);
      const result: ApiResponse<{ url: string }> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Erro ao obter URL do arquivo');
      }

      return result.data.url;
    } catch (err) {
      throw err;
    }
  };

  const checkInscricaoByCpf = async (cpf: string) => {
    try {
      const response = await fetch(`/api/inscricoes?cpf=${encodeURIComponent(cpf)}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao verificar CPF');
      }

      return result.data && result.data.length > 0 ? result.data[0] : null;
    } catch (err) {
      throw err;
    }
  };

  return {
    submitInscricao,
    getFileUrl,
    checkInscricaoByCpf,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
