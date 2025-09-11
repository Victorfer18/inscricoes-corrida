"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { 
  DocumentIcon, 
  XMarkIcon, 
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon 
} from "@heroicons/react/24/outline";

interface ComprovanteViewerProps {
  isOpen: boolean;
  onClose: () => void;
  comprovanteUrl: string;
  nomeParticipante: string;
}

export function ComprovanteViewer({
  isOpen,
  onClose,
  comprovanteUrl,
  nomeParticipante,
}: ComprovanteViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actualUrl, setActualUrl] = useState<string>("");
  const [isMaximized, setIsMaximized] = useState(false);

  // Função para obter a URL real do arquivo
  const fetchActualUrl = useCallback(async (url: string) => {
    try {
      setLoading(true);
      setError(false);

      // Se já é uma URL completa do Google Drive, usar diretamente
      if (url.includes('drive.google.com/uc?id=')) {
        const fileId = url.split('id=')[1];
        setActualUrl(`/api/files/${fileId}/view`);
        return;
      }

      // Se é uma URL da nossa API (/api/files/fileId), buscar a URL real
      if (url.startsWith('/api/files/') && !url.includes('/view')) {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.url.includes('drive.google.com/uc?id=')) {
            const fileId = data.data.url.split('id=')[1];
            setActualUrl(`/api/files/${fileId}/view`);
          } else {
            setActualUrl(data.data.url);
          }
        } else {
          throw new Error('Falha ao carregar URL do arquivo');
        }
        return;
      }

      // Se é apenas um fileId, buscar a URL na API
      if (!url.includes('http') && !url.startsWith('/')) {
        const response = await fetch(`/api/files/${url}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.url.includes('drive.google.com/uc?id=')) {
            const fileId = data.data.url.split('id=')[1];
            setActualUrl(`/api/files/${fileId}/view`);
          } else {
            setActualUrl(data.data.url);
          }
        } else {
          throw new Error('Falha ao carregar URL do arquivo');
        }
        return;
      }

      // URL externa normal
      setActualUrl(url);
    } catch (err) {
      console.error('Erro ao buscar URL do arquivo:', err);
      setError(true);
    }
  }, [setLoading, setError, setActualUrl]);

  // Buscar URL quando o modal abrir
  useEffect(() => {
    if (isOpen && comprovanteUrl) {
      fetchActualUrl(comprovanteUrl);
    }
  }, [isOpen, comprovanteUrl, fetchActualUrl]);

  const isPDF = comprovanteUrl.includes('.pdf') || comprovanteUrl.includes('pdf');

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  const toggleMaximized = () => {
    setIsMaximized(!isMaximized);
  };

  const openInNewTab = async () => {
    try {
      // Se é uma URL da nossa API, buscar a URL original do Google Drive
      if (comprovanteUrl.startsWith('/api/files/') && !comprovanteUrl.includes('/view')) {
        const response = await fetch(comprovanteUrl);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            window.open(data.data.url, '_blank');
            return;
          }
        }
      }
      
      // Se é apenas um fileId, buscar a URL original
      if (!comprovanteUrl.includes('http') && !comprovanteUrl.startsWith('/')) {
        const response = await fetch(`/api/files/${comprovanteUrl}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            window.open(data.data.url, '_blank');
            return;
          }
        }
      }
      
      // Usar URL direta se já for uma URL completa
      window.open(comprovanteUrl, '_blank');
    } catch (error) {
      console.error('Erro ao abrir arquivo:', error);
      // Fallback para URL original
      window.open(comprovanteUrl, '_blank');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size={isMaximized ? "full" : "2xl"}
      scrollBehavior="inside"
      classNames={{
        base: isMaximized ? "h-screen w-screen max-h-screen" : "max-h-[90vh]",
        body: "p-0",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row items-center justify-between px-6 py-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">
                  Comprovante de Pagamento
                </h3>
                <p className="text-sm text-gray-500 font-normal">
                  {nomeParticipante}
                </p>
              </div>
              <Button
                isIconOnly
                variant="light"
                onPress={toggleMaximized}
                title={isMaximized ? "Minimizar" : "Maximizar"}
              >
                {isMaximized ? (
                  <ArrowsPointingInIcon className="w-5 h-5" />
                ) : (
                  <ArrowsPointingOutIcon className="w-5 h-5" />
                )}
              </Button>
            </ModalHeader>
            
            <ModalBody className="px-0 py-0">
              <div className={`relative w-full ${isMaximized ? 'min-h-[calc(100vh-120px)]' : 'min-h-[400px]'} bg-gray-50 dark:bg-gray-800 flex items-center justify-center`}>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <div className="text-center">
                      <Spinner size="lg" />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Carregando comprovante...
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-center p-8">
                    <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Erro ao carregar o comprovante
                    </p>
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={openInNewTab}
                    >
                      Abrir em nova aba
                    </Button>
                  </div>
                )}

                {isPDF ? (
                  <div className="w-full h-full min-h-[400px] p-4">
                    <div className="text-center p-8">
                      <DocumentIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                        Arquivo PDF
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        Clique no botão abaixo para visualizar o PDF
                      </p>
                      <Button
                        color="primary"
                        onPress={openInNewTab}
                        startContent={<DocumentIcon className="w-4 h-4" />}
                      >
                        Abrir PDF
                      </Button>
                    </div>
                  </div>
                ) : (
                  actualUrl && (
                    <img
                      src={actualUrl}
                      alt={`Comprovante de ${nomeParticipante}`}
                      className={`max-w-full ${isMaximized ? 'max-h-[calc(100vh-140px)]' : 'max-h-[70vh]'} object-contain ${loading ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  )
                )}
              </div>
            </ModalBody>
            
            <ModalFooter className="px-6 py-4">
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                startContent={<XMarkIcon className="w-4 h-4" />}
              >
                Fechar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
