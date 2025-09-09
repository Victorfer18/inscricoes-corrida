"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInscricao } from "@/hooks/useInscricao";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { useDisclosure } from "@heroui/modal";
import { CheckIcon, RunnerIcon } from "@/components/icons";
import { BackgroundWrapper } from "@/components/background-wrapper";
import { title, subtitle } from "@/components/primitives";
import { FormularioInscricao } from "@/components/formulario-inscricao";
import { KitSlider } from "@/components/kit-slider";

export default function InscricaoPage() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { submitInscricao, isLoading, error } = useInscricao();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitInscricao = async (formData: any, comprovanteFile: File) => {
    setSubmitError(null);
    
    try {
      // Mapear dados do formulário para o formato da API
      const inscricaoData = {
        nomeCompleto: formData.nomeCompleto,
        cpf: formData.cpf,
        idade: formData.idade,
        sexo: formData.sexo,
        celular: formData.celular,
        email: formData.email,
        tamanhoBlusa: formData.tamanhoBlusa,
      };

      await submitInscricao(inscricaoData, comprovanteFile);
      
      // Abrir modal de sucesso
      onOpen();
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : 'Erro desconhecido');
        }
  };

  const handleSuccessClose = () => {
    onClose();
    // Redirecionar para regulamento após 500ms
    setTimeout(() => {
      router.push('/regulamento');
    }, 500);
  };

  return (
    <>
      {/* Modal de Sucesso */}
      <Modal 
        isOpen={isOpen} 
        onClose={handleSuccessClose} 
        size="2xl"
        closeButton={false}
        backdrop="blur"
        classNames={{
          backdrop: "bg-gradient-to-t from-pink-900/50 to-purple-900/50 backdrop-opacity-20"
        }}
      >
        <ModalContent>
          <ModalHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
            <div className="w-full flex flex-col items-center gap-2">
              <div className="bg-white/20 p-3 rounded-full">
                <CheckIcon size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold">🎉 Inscrição Realizada!</h2>
            </div>
          </ModalHeader>
          <ModalBody className="p-6">
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-3">
                  ✅ Parabéns! Sua inscrição foi enviada com sucesso!
                </h3>
                <p className="text-green-600 dark:text-green-400 text-sm">
                  Você receberá a confirmação via WhatsApp em até 24 horas.
                </p>
              </div>

              {/* Informações de Retirada do Kit */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center justify-center gap-2">
                  <span>📦</span>
                  <span>RETIRADA DO KIT</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🏠</span>
                      <span className="font-semibold text-purple-700 dark:text-purple-300">NS2 - Atletas da Região</span>
                    </div>
                    <div className="space-y-1 text-purple-600 dark:text-purple-400">
                      <div className="flex justify-between">
                        <span>📅 Data:</span>
                        <span className="font-semibold">20/10/2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span>📍 Local:</span>
                        <span className="font-semibold">NS2</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🌍</span>
                      <span className="font-semibold text-purple-700 dark:text-purple-300">Outras Regiões</span>
                    </div>
                    <div className="space-y-1 text-purple-600 dark:text-purple-400">
                      <div className="flex justify-between">
                        <span>📅 Data:</span>
                        <span className="font-semibold">Dia da corrida</span>
                      </div>
                      <div className="flex justify-between">
                        <span>⏰ Horário:</span>
                        <span className="font-semibold">06:00-07:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>📍 Local:</span>
                        <span className="font-semibold">Ponto de apoio</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
                    <strong>⚠️ Importante:</strong> Leve documento com foto para retirar o kit
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  📋 Próximos Passos:
                </h4>
                <div className="text-left text-sm space-y-2 text-blue-600 dark:text-blue-400">
                  <div className="flex items-center gap-2">
                    <span>⏳</span>
                    <span>Aguarde confirmação via WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📖</span>
                    <span>Leia o regulamento completo</span>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="justify-center">
            <Button 
              color="success" 
              size="lg"
              onPress={handleSuccessClose}
              className="font-semibold px-8"
            >
              Ver Regulamento 📖
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    <BackgroundWrapper intensity="strong" showAnimation={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Header da Página */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 sm:p-6 rounded-full shadow-lg">
              <RunnerIcon size={48} className="text-white sm:w-16 sm:h-16" />
            </div>
          </div>
          
          <h1 className={title({ size: "md", class: "mb-4 text-2xl sm:text-3xl md:text-4xl" })}>
            <span className={title({ color: "pink", size: "md" })}>Inscrição</span> para a Corrida
          </h1>
          
          <div className={subtitle({ class: "max-w-2xl mx-auto text-sm sm:text-base px-2" })}>
            Preencha todos os campos abaixo para realizar sua inscrição na 
            1ª Corrida e Caminhada Outubro Rosa - Projeto Jaíba
          </div>
        </div>

        {/* Informações Importantes */}
        <Card className="max-w-4xl mx-auto mb-6 sm:mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-300 dark:border-yellow-700">
          <CardBody className="p-4 sm:p-6">
            <h3 className="font-bold text-base sm:text-lg mb-4 text-yellow-800 dark:text-yellow-300">
              ⚠️ Informações Importantes
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>• <strong>Valor da inscrição:</strong> R$ 79,90</p>
              <p>• <strong>Pagamento:</strong> Apenas via PIX</p>
              <p>• <strong>Comprovante:</strong> Obrigatório upload da imagem no formulário</p>
              <p>• <strong>Confirmação:</strong> Será feita via WhatsApp em até 24 horas</p>
              <p>• <strong>Kit:</strong> Inclui camiseta oficial, medalha e mais itens</p>
            </div>
          </CardBody>
        </Card>

        {/* Seção do Kit de Participação */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
          <div className="text-center mb-4 sm:mb-6 px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2">
              🎁 Seu Kit de Participação
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Veja tudo que você vai receber com sua inscrição
            </p>
          </div>
          <KitSlider />
        </div>

        {/* Informações de Retirada do Kit */}
        <Card className="max-w-4xl mx-auto mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-300 dark:border-blue-700">
          <CardBody className="p-4 sm:p-6">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="font-bold text-lg sm:text-xl mb-2 text-blue-800 dark:text-blue-200">
                📦 RETIRADA DO KIT
              </h3>
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                Confira onde e quando retirar seu kit de participação
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 sm:p-3 rounded-full">
                    <span className="text-xl sm:text-2xl">🏠</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-blue-800 dark:text-blue-200">
                      NS2 - Atletas da Região
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                      Retirada antecipada
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="flex justify-between">
                    <span className="font-semibold">📅 Data:</span>
                    <span>20/10/2025</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold">📍 Local:</span>
                    <span>NS2</span>
                  </p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900 p-2 sm:p-3 rounded-full">
                    <span className="text-xl sm:text-2xl">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-indigo-800 dark:text-indigo-200">
                      Outras Regiões
                    </h4>
                    <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">
                      No dia do evento
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="flex justify-between">
                    <span className="font-semibold">📅 Data:</span>
                    <span>Dia da corrida</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold">⏰ Horário:</span>
                    <span>06:00 às 07:00</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold">📍 Local:</span>
                    <span>Ponto de apoio</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 text-center">
                <strong>⚠️ Importante:</strong> Leve um documento com foto para retirar o kit
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Formulário de Inscrição Completo */}
        <FormularioInscricao 
          onSubmit={handleSubmitInscricao} 
          isSubmitting={isLoading}
          error={submitError}
        />
      </div>
    </BackgroundWrapper>
    </>
  );
}
