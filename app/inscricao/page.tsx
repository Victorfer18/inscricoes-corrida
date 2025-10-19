"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

import { BackgroundWrapper } from "@/components/background-wrapper";
import { eventConfig } from "@/config/event";
import { title, subtitle } from "@/components/primitives";
import { RunnerIcon } from "@/components/icons";

export default function InscricaoPage() {
  return (
    <BackgroundWrapper intensity="strong" showAnimation={false}>
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700">
            <CardBody className="p-12">
              <div className="text-6xl mb-6">🏃‍♀️</div>
              
              <h1 className={title({ size: "lg", class: "mb-6" })}>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Inscrições Encerradas
                </span>
              </h1>
              
              <p className={subtitle({ class: "mb-6 text-blue-600 dark:text-blue-400" })}>
                {eventConfig.mensagemInscricoesFinalizadas}
              </p>
              
              <div className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
                <h3 className="font-bold text-lg mb-2 text-blue-800 dark:text-blue-200">
                  📅 Informações do Evento
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  <strong>Data:</strong> {eventConfig.dataEvento}<br />
                  <strong>Local:</strong> {eventConfig.local}<br />
                  <strong>Concentração:</strong> {eventConfig.horarioConcentracao}
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                <Button
                  as={Link}
                  href="/"
                  color="primary"
                  size="lg"
                  className="font-semibold"
                  startContent={<RunnerIcon />}
                >
                  Início
                </Button>
                
                <Button
                  as={Link}
                  href="/regulamento"
                  variant="bordered"
                  color="primary"
                  size="lg"
                  className="font-semibold"
                >
                  Ver Regulamento
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </BackgroundWrapper>
  );
}