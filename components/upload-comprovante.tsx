"use client";

import { useState, useRef } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { UploadIcon, CheckIcon, TrashIcon } from "@/components/icons";
import { formatarTamanhoArquivo } from "@/lib/utils";

interface UploadComprovanteProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function UploadComprovante({ onFileSelect, selectedFile }: UploadComprovanteProps) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validar tipo de arquivo
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
      alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF, WebP, BMP, TIFF) ou PDF');
      return;
    }

    // Validar tamanho (máximo 10MB para PDFs, 5MB para imagens)
    const maxSize = file.type === 'application/pdf' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    const maxSizeText = file.type === 'application/pdf' ? '10MB' : '5MB';
    
    if (file.size > maxSize) {
      alert(`Arquivo muito grande. Máximo permitido: ${maxSizeText}`);
      return;
    }

    onFileSelect(file);

    // Criar preview apenas para imagens
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Para PDFs, limpar o preview
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-300 dark:border-blue-700">
      <CardBody className="p-4 sm:p-6">
        <div className="text-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 sm:p-4 rounded-full inline-block mb-4">
            <UploadIcon size={24} className="text-blue-600 dark:text-blue-400 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
            Comprovante de Pagamento
          </h3>
          <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm px-2">
            Envie uma foto, print ou PDF do comprovante do PIX
          </p>
        </div>

        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition-colors ${
              dragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-blue-300 dark:border-blue-700'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="text-3xl sm:text-4xl">📸</div>
              <div>
                <p className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2 px-2">
                  Arraste e solte sua imagem aqui
                </p>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mb-4 px-2">
                  ou clique no botão abaixo para selecionar
                </p>
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={handleButtonClick}
                  startContent={<UploadIcon />}
                  className="w-full sm:w-auto"
                  size="lg"
                >
                  Selecionar Arquivo
                </Button>
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-400 px-2">
                Formatos aceitos:<br className="sm:hidden" /> JPG, PNG, GIF, PDF<br className="sm:hidden" />
                • Imagens: 5MB • PDF: 10MB
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview da imagem ou ícone do PDF */}
            <div className="text-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview do comprovante"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg border border-blue-200 dark:border-blue-700"
                />
              ) : selectedFile?.type === 'application/pdf' ? (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-8 max-w-sm mx-auto">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-red-700 dark:text-red-300 font-semibold">
                    Arquivo PDF
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                    {selectedFile.name}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Informações do arquivo */}
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <CheckIcon className="text-green-500 flex-shrink-0" size={20} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-blue-800 dark:text-blue-200 text-sm sm:text-base truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                      {formatarTamanhoArquivo(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Button
                  color="danger"
                  variant="light"
                  size="sm"
                  onPress={handleRemoveFile}
                  startContent={<TrashIcon />}
                  className="flex-shrink-0"
                >
                  <span className="hidden sm:inline">Remover</span>
                  <span className="sm:hidden">🗑️</span>
                </Button>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4 border border-green-200 dark:border-green-800">
              <p className="text-xs sm:text-sm text-green-800 dark:text-green-200 text-center px-2">
                <strong>✅ Arquivo enviado com sucesso!</strong><br />
                Você pode finalizar sua inscrição agora.
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </CardBody>
    </Card>
  );
}
