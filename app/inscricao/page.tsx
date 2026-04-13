"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

import { FormularioInscricao } from "@/components/formulario-inscricao";
import { BackgroundWrapper } from "@/components/background-wrapper";
import { title, subtitle } from "@/components/primitives";
import { RunnerIcon, CheckIcon } from "@/components/icons";
import { useLoteVigente } from "@/hooks/useLoteVigente";
import { useInscricao } from "@/hooks/useInscricao";

export default function InscricaoPage() {
  const router = useRouter();
  const { evento, loteVigente, loading: loteLoading } = useLoteVigente();
  const { submitInscricao, isLoading: isSubmitting, error } = useInscricao();

  const [isSuccess, setIsSuccess] = useState(false);

  const dataApresentavel =
    typeof evento?.data_evento === "string"
      ? new Date(evento.data_evento + "T00:00:00").toLocaleDateString("pt-BR")
      : "Data a definir";
  const localApresentavel =
    typeof evento?.local === "string" ? evento.local : "Local a definir";

  const handleFormSubmit = async (formData: any, file: File) => {
    try {
      await submitInscricao(formData, file);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      // O erro já é tratado e exibido pelo componente através da prop error
      console.error(err);
    }
  };

  if (loteLoading) {
    return (
      <BackgroundWrapper intensity="strong" showAnimation={false}>
        <div className="container mx-auto px-4 py-16 text-center text-white">Carregando inscrições...</div>
      </BackgroundWrapper>
    );
  }

  // Se já foi cadastrado com sucesso
  if (isSuccess) {
    return (
      <BackgroundWrapper intensity="strong" showAnimation={true}>
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-green-500">
            <CardBody className="p-8 sm:p-12 text-center text-green-700 dark:text-green-400">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckIcon size={48} />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4">Inscrição Enviada!</h1>
              <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                Sua inscrição foi recebida com sucesso. <br />
                Verifique seu e-mail para acompanhar a aprovação.
              </p>
              <Button
                color="success"
                size="lg"
                onPress={() => router.push("/")}
              >
                Voltar para a Página Inicial
              </Button>
            </CardBody>
          </Card>
        </div>
      </BackgroundWrapper>
    );
  }

  // Se não tem evento ativo ou lote aberto
  if (!evento || !loteVigente) {
    return (
      <BackgroundWrapper intensity="strong" showAnimation={false}>
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="text-center">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700">
              <CardBody className="p-12">
                <div className="text-6xl mb-6">🏃‍♀️</div>
                <h1 className={title({ size: "lg", class: "mb-6" })}>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Inscrições Encerradas / Não Iniciadas
                  </span>
                </h1>
                <p
                  className={subtitle({
                    class: "mb-6 text-blue-600 dark:text-blue-400",
                  })}
                >
                  Neste momento, as inscrições não estão abertas. Volte em breve!
                </p>

                {evento && (
                  <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
                    <h3 className="font-bold text-lg mb-2 text-blue-800 dark:text-blue-200">
                      📅 Informações do Evento:{" "}
                      {typeof evento.nome === "string" ? evento.nome : ""}
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      <strong>Data:</strong> {dataApresentavel}
                      <br />
                      <strong>Local:</strong> {localApresentavel}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <Button
                    as={Link}
                    className="font-semibold"
                    color="primary"
                    href="/"
                    size="lg"
                    startContent={<RunnerIcon />}
                  >
                    Início
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

  // Se tem evento ativo e lote aberto
  return (
    <BackgroundWrapper intensity="strong" showAnimation={true}>
      <div className="container mx-auto py-12">
        <FormularioInscricao
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </BackgroundWrapper>
  );
}
