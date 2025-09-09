"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { RadioGroup, Radio } from "@heroui/radio";
import { Divider } from "@heroui/divider";
import { Spacer } from "@heroui/spacer";

import { PixComponent } from "../components/pix-component";

import { CheckIcon } from "@/components/icons";
import { UploadComprovante } from "@/components/upload-comprovante";
import { TAMANHOS_BLUSA, SEXO_OPTIONS } from "@/types/inscricao";
import { formatarCPF, formatarCelular } from "@/lib/utils";

interface FormData {
  nomeCompleto: string;
  cpf: string;
  tamanhoBlusa: string;
  sexo: string;
  idade: number;
  celular: string;
  email: string;
}

interface FormularioInscricaoProps {
  onSubmit: (data: any, file: File) => void;
  className?: string;
  isSubmitting?: boolean;
  error?: string | null;
}

export function FormularioInscricao({
  onSubmit,
  className,
  isSubmitting: externalSubmitting = false,
  error: externalError,
}: FormularioInscricaoProps) {
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    cpf: "",
    tamanhoBlusa: "M",
    sexo: "Feminino",
    idade: 0,
    celular: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);

  const isSubmitting = externalSubmitting;

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatarCPF(value);

    handleInputChange("cpf", formatted);
  };

  const handleCelularChange = (value: string) => {
    const formatted = formatarCelular(value);

    handleInputChange("celular", formatted);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = "Nome completo é obrigatório";
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    }

    if (!formData.celular.trim()) {
      newErrors.celular = "Celular é obrigatório";
    }

    if (formData.idade < 12) {
      newErrors.idade = "Idade mínima é 12 anos";
    }

    if (!comprovanteFile) {
      // Adicionar erro de comprovante se necessário
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!comprovanteFile) {
      return;
    }

    try {
      await onSubmit(formData, comprovanteFile);
    } catch (error) {
      // Erro tratado pelo componente pai
    }
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 ${className || ""}`}>
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-white/50 dark:border-gray-700/50">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <CheckIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Formulário de Inscrição
              </h2>
              <p className="text-pink-100 text-sm sm:text-base">
                Preencha todos os campos obrigatórios
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
              📋 Dados Pessoais
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  autoComplete="name"
                  errorMessage={errors.nomeCompleto}
                  isInvalid={!!errors.nomeCompleto}
                  label="Nome Completo *"
                  placeholder="Digite seu nome completo"
                  size="lg"
                  value={formData.nomeCompleto}
                  variant="bordered"
                  onValueChange={(value) =>
                    handleInputChange("nomeCompleto", value)
                  }
                />
              </div>

              <Input
                autoComplete="off"
                errorMessage={errors.cpf}
                isInvalid={!!errors.cpf}
                label="CPF *"
                maxLength={14}
                placeholder="000.000.000-00"
                size="lg"
                value={formData.cpf}
                variant="bordered"
                onValueChange={handleCPFChange}
              />

              <Input
                autoComplete="age"
                errorMessage={errors.idade}
                isInvalid={!!errors.idade}
                label="Idade *"
                max={100}
                min={12}
                placeholder="Digite sua idade"
                size="lg"
                type="number"
                value={formData.idade.toString()}
                variant="bordered"
                onValueChange={(value) =>
                  handleInputChange("idade", parseInt(value) || 0)
                }
              />

              <div className="sm:col-span-2">
                <span className="block text-sm font-medium mb-3">Sexo *</span>
                <RadioGroup
                  className="flex gap-6"
                  orientation="horizontal"
                  value={formData.sexo}
                  onValueChange={(value) => handleInputChange("sexo", value)}
                >
                  {SEXO_OPTIONS.map((sexo) => (
                    <Radio key={sexo} size="lg" value={sexo}>
                      {sexo}
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          <Divider />

          {/* Contato */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
              📱 Contato
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                autoComplete="tel"
                errorMessage={errors.celular}
                isInvalid={!!errors.celular}
                label="Celular/WhatsApp *"
                maxLength={15}
                placeholder="(31) 99999-9999"
                size="lg"
                value={formData.celular}
                variant="bordered"
                onValueChange={handleCelularChange}
              />

              <Input
                autoComplete="email"
                label="E-mail (opcional)"
                placeholder="seu@email.com"
                size="lg"
                type="email"
                value={formData.email}
                variant="bordered"
                onValueChange={(value) => handleInputChange("email", value)}
              />
            </div>
          </div>

          <Divider />

          {/* Kit */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
              👕 Tamanho da Camiseta
            </h3>

            <Select
              className="max-w-full sm:max-w-xs"
              label="Tamanho da Blusa *"
              placeholder="Selecione o tamanho"
              selectedKeys={[formData.tamanhoBlusa]}
              size="lg"
              variant="bordered"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;

                handleInputChange("tamanhoBlusa", selected);
              }}
            >
              {TAMANHOS_BLUSA.map((tamanho) => (
                <SelectItem key={tamanho}>{tamanho}</SelectItem>
              ))}
            </Select>
          </div>

          <Divider />

          {/* Pagamento */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
              💳 Pagamento
            </h3>

            <PixComponent />

            <Spacer y={4} />

            <UploadComprovante
              selectedFile={comprovanteFile}
              onFileSelect={setComprovanteFile}
            />
          </div>

          <Divider />

          {/* Botão de Envio */}
          <div className="text-center pt-4">
            {externalError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  <strong>❌ Erro:</strong> {externalError}
                </p>
              </div>
            )}

            <Button
              className="w-full sm:w-auto sm:min-w-48 font-bold text-lg py-6"
              color="secondary"
              isDisabled={!comprovanteFile || isSubmitting}
              isLoading={isSubmitting}
              size="lg"
              onPress={handleSubmit}
            >
              {isSubmitting ? "Enviando..." : "Finalizar Inscrição"}
            </Button>

            <p className="text-sm text-default-600 mt-4">
              * Campos obrigatórios
            </p>

            {!comprovanteFile && (
              <p className="text-sm text-warning mt-2 px-4">
                ⚠️ É necessário enviar o comprovante de pagamento
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
