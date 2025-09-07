"use client";

import { useState } from "react";
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
  const [inscricaoRealizada, setInscricaoRealizada] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmitInscricao = async () => {
    // Simular envio dos dados
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setInscricaoRealizada(true);
    onOpen();
  };

  const handleNovaInscricao = () => {
    setInscricaoRealizada(false);
    onClose();
  };

  if (inscricaoRealizada) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-pink-950 dark:via-purple-950 dark:to-pink-900 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardBody className="text-center p-8">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-full">
                  <CheckIcon size={48} className="text-white" />
                </div>
              </div>
              
              <h1 className={title({ size: "md", class: "mb-4 text-green-600" })}>
                Inscrição Realizada com Sucesso!
              </h1>
              
              <div className={subtitle({ class: "mb-6" })}>
                Parabéns! Sua inscrição na 1ª Corrida e Caminhada Outubro Rosa foi realizada com sucesso.
              </div>

              <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Próximos Passos:</h3>
                <div className="text-left space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Comprovante de pagamento enviado para análise</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-500 font-bold">⏳</span>
                    <span>Aguarde a confirmação via WhatsApp em até 24h</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 font-bold">📱</span>
                    <span>Você receberá informações sobre retirada do kit</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  color="secondary"
                  variant="solid"
                  onPress={handleNovaInscricao}
                  startContent={<RunnerIcon />}
                >
                  Nova Inscrição
                </Button>
                <Button
                  color="default"
                  variant="bordered"
                  onPress={() => window.location.href = '/'}
                >
                  Voltar ao Início
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent>
            <ModalHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <h2 className="text-xl font-bold">Inscrição Confirmada!</h2>
            </ModalHeader>
            <ModalBody className="p-6">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full inline-block mb-4">
                  <CheckIcon size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-green-600">
                  Dados da Inscrição Registrados
                </h3>
              </div>

              <div className="text-center text-sm text-default-600">
                <p>
                  Guarde essas informações para referência. 
                  Você receberá uma confirmação via WhatsApp em breve.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onPress={onClose}>
                Entendi
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <BackgroundWrapper intensity="strong" showAnimation={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Header da Página */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-full shadow-lg">
              <RunnerIcon size={64} className="text-white" />
            </div>
          </div>
          
          <h1 className={title({ size: "lg", class: "mb-4" })}>
            <span className={title({ color: "pink", size: "lg" })}>Inscrição</span> para a Corrida
          </h1>
          
          <div className={subtitle({ class: "max-w-2xl mx-auto" })}>
            Preencha todos os campos abaixo para realizar sua inscrição na 
            1ª Corrida e Caminhada Outubro Rosa - Projeto Jaíba
          </div>
        </div>

        {/* Informações Importantes */}
        <Card className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-300 dark:border-yellow-700">
          <CardBody className="p-6">
            <h3 className="font-bold text-lg mb-4 text-yellow-800 dark:text-yellow-300">
              ⚠️ Informações Importantes
            </h3>
            <div className="space-y-2 text-sm">
              <p>• <strong>Valor da inscrição:</strong> R$ 25,00</p>
              <p>• <strong>Pagamento:</strong> Apenas via PIX</p>
              <p>• <strong>Comprovante:</strong> Obrigatório upload da imagem no formulário</p>
              <p>• <strong>Confirmação:</strong> Será feita via WhatsApp em até 24 horas</p>
              <p>• <strong>Kit:</strong> Inclui camiseta oficial, medalha e mais itens</p>
            </div>
          </CardBody>
        </Card>

        {/* Seção do Kit de Participação */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2">
              🎁 Seu Kit de Participação
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Veja tudo que você vai receber com sua inscrição
            </p>
          </div>
          <KitSlider />
        </div>

        {/* Informações de Retirada do Kit */}
        <Card className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-300 dark:border-blue-700">
          <CardBody className="p-6">
            <div className="text-center mb-6">
              <h3 className="font-bold text-xl mb-2 text-blue-800 dark:text-blue-200">
                📦 RETIRADA DO KIT
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Confira onde e quando retirar seu kit de participação
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-blue-200 dark:border-blue-800 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-blue-800 dark:text-blue-200">
                      NS2 - Atletas da Região
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Retirada antecipada
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
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

              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-blue-200 dark:border-blue-800 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-indigo-800 dark:text-indigo-200">
                      Outras Regiões
                    </h4>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                      No dia do evento
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
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

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                <strong>⚠️ Importante:</strong> Leve um documento com foto para retirar o kit
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Formulário de Inscrição Completo */}
        <FormularioInscricao onSubmit={handleSubmitInscricao} />
      </div>
    </BackgroundWrapper>
  );
}
