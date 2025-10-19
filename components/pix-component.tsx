"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Snippet } from "@heroui/snippet";

import { CopyIcon, CheckIcon } from "@/components/icons";
import { PIX_INFO } from "@/types/inscricao";
import { formatarMoeda } from "@/lib/utils";
import { useLoteVigente } from "@/hooks/useLoteVigente";

export function PixComponent() {
  const [copied, setCopied] = useState(false);
  const { valor, loading } = useLoteVigente();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_INFO.chavePix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-300 dark:border-green-700">
      <CardBody className="p-4 sm:p-6">
        <div className="text-center mb-6">
          <div className="bg-green-100 dark:bg-green-900 p-3 sm:p-4 rounded-full inline-block mb-4">
            <span className="text-2xl sm:text-3xl">💳</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-200 mb-2">
            Pagamento via PIX
          </h3>
          <p className="text-green-600 dark:text-green-400 text-base sm:text-lg">
            Valor:{" "}
            <strong>{loading ? "Carregando..." : formatarMoeda(valor)}</strong>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <span className="block text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
              Beneficiário:
            </span>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 border border-green-200 dark:border-green-800 mb-3">
              <p className="font-semibold text-green-800 dark:text-green-200 text-sm sm:text-base break-words">
                {PIX_INFO.nome}
              </p>
            </div>

            <span className="block text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
              Chave PIX (Copie e cole no seu app):
            </span>
            <div className="w-full overflow-hidden mb-3">
              <Snippet
                className="w-full"
                classNames={{
                  base: "w-full max-w-full",
                  content:
                    "text-xs sm:text-sm break-all overflow-hidden text-ellipsis max-w-full",
                }}
                color="success"
                symbol=""
                variant="bordered"
              >
                {PIX_INFO.chavePix}
              </Snippet>
            </div>

            <Button
              className="w-full font-semibold"
              color="success"
              size="lg"
              startContent={copied ? <CheckIcon /> : <CopyIcon />}
              variant="solid"
              onPress={handleCopy}
            >
              {copied ? "Copiado!" : "Copiar Chave PIX"}
            </Button>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 sm:p-4 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 text-sm sm:text-base">
              📋 Instruções:
            </h4>
            <ol className="text-xs sm:text-sm text-green-700 dark:text-green-300 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Clique no botão &ldquo;Copiar Chave PIX&rdquo; acima</li>
              <li>Abra seu app bancário</li>
              <li>Escolha &ldquo;PIX&rdquo; e &ldquo;Pagar&rdquo;</li>
              <li>Cole a chave PIX copiada</li>
              <li>
                Confirme o valor:{" "}
                {loading ? "Carregando..." : formatarMoeda(valor)}
              </li>
              <li>Faça o pagamento</li>
              <li>Compartilhe ou Tire print do comprovante</li>
              <li>Envie o comprovante no campo abaixo</li>
            </ol>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 sm:p-4 border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
              <strong>⚠️ Importante:</strong> Após o pagamento, envie o
              comprovante no formulário abaixo. Sua inscrição só será confirmado
              após a verificação do pagamento.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
