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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF)');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo permitido: 5MB');
      return;
    }

    onFileSelect(file);

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
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
      <CardBody className="p-6">
        <div className="text-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full inline-block mb-4">
            <UploadIcon size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
            Comprovante de Pagamento
          </h3>
          <p className="text-blue-600 dark:text-blue-400 text-sm">
            Envie uma foto ou print do comprovante do PIX
          </p>
        </div>

        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
            <div className="space-y-4">
              <div className="text-4xl">📸</div>
              <div>
                <p className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Arraste e solte sua imagem aqui
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                  ou clique no botão abaixo para selecionar
                </p>
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={handleButtonClick}
                  startContent={<UploadIcon />}
                >
                  Selecionar Arquivo
                </Button>
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-400">
                Formatos aceitos: JPG, PNG, GIF • Máximo: 5MB
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview da imagem */}
            {preview && (
              <div className="text-center">
                <img
                  src={preview}
                  alt="Preview do comprovante"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg border border-blue-200 dark:border-blue-700"
                />
              </div>
            )}

            {/* Informações do arquivo */}
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckIcon className="text-green-500" size={20} />
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-200">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
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
                >
                  Remover
                </Button>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200 text-center">
                <strong>✅ Arquivo enviado com sucesso!</strong><br />
                Você pode finalizar sua inscrição agora.
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </CardBody>
    </Card>
  );
}
