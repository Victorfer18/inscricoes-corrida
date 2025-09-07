"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { RadioGroup, Radio } from "@heroui/radio";
import { Divider } from "@heroui/divider";
import { Spacer } from "@heroui/spacer";
import { CheckIcon } from "@/components/icons";
import { PixComponent } from "../components/pix-component";
import { UploadComprovante } from "@/components/upload-comprovante";
import { 
  TAMANHOS_BLUSA, 
  SEXO_OPTIONS 
} from "@/types/inscricao";
import { 
  formatarCPF, 
  formatarCelular 
} from "@/lib/utils";

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
  onSubmit: (data: any) => void;
  className?: string;
}

export function FormularioInscricao({ onSubmit, className }: FormularioInscricaoProps) {
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: '',
    cpf: '',
    tamanhoBlusa: 'M',
    sexo: 'Feminino',
    idade: 0,
    celular: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatarCPF(value);
    handleInputChange('cpf', formatted);
  };

  const handleCelularChange = (value: string) => {
    const formatted = formatarCelular(value);
    handleInputChange('celular', formatted);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.celular.trim()) {
      newErrors.celular = 'Celular é obrigatório';
    }

    if (formData.idade < 12) {
      newErrors.idade = 'Idade mínima é 12 anos';
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

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        comprovanteFile,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className || ''}`}>
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-white/50 dark:border-gray-700/50">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <CheckIcon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Formulário de Inscrição</h2>
              <p className="text-pink-100">Preencha todos os campos obrigatórios</p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-8 space-y-6">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400">
              📋 Dados Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome Completo *"
                placeholder="Digite seu nome completo"
                value={formData.nomeCompleto}
                onValueChange={(value) => handleInputChange('nomeCompleto', value)}
                isInvalid={!!errors.nomeCompleto}
                errorMessage={errors.nomeCompleto}
                variant="bordered"
                autoComplete="name"
              />

              <Input
                label="CPF *"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onValueChange={handleCPFChange}
                isInvalid={!!errors.cpf}
                errorMessage={errors.cpf}
                variant="bordered"
                maxLength={14}
              autoComplete="off"
              />

              <Input
                label="Idade *"
                placeholder="Digite sua idade"
                type="number"
                value={formData.idade.toString()}
                onValueChange={(value) => handleInputChange('idade', parseInt(value) || 0)}
                isInvalid={!!errors.idade}
                errorMessage={errors.idade}
                variant="bordered"
                min={12}
                max={100}
                autoComplete="age"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Sexo *</label>
                <RadioGroup
                  value={formData.sexo}
                  onValueChange={(value) => handleInputChange('sexo', value)}
                  orientation="horizontal"
                >
                  {SEXO_OPTIONS.map((sexo) => (
                    <Radio key={sexo} value={sexo}>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Celular/WhatsApp *"
                placeholder="(31) 99999-9999"
                value={formData.celular}
                onValueChange={handleCelularChange}
                isInvalid={!!errors.celular}
                errorMessage={errors.celular}
                variant="bordered"
                maxLength={15}
                autoComplete="tel"
              />

              <Input
                label="E-mail (opcional)"
                placeholder="seu@email.com"
                type="email"
                value={formData.email}
                onValueChange={(value) => handleInputChange('email', value)}
                variant="bordered"
                autoComplete="email"
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
              label="Tamanho da Blusa *"
              placeholder="Selecione o tamanho"
              selectedKeys={[formData.tamanhoBlusa]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                handleInputChange('tamanhoBlusa', selected);
              }}
              variant="bordered"
              className="max-w-xs"
            >
              {TAMANHOS_BLUSA.map((tamanho) => (
                <SelectItem key={tamanho}>
                  {tamanho}
                </SelectItem>
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
              onFileSelect={setComprovanteFile}
              selectedFile={comprovanteFile}
            />
          </div>

          <Divider />

          {/* Botão de Envio */}
          <div className="text-center pt-4">
            <Button
              color="secondary"
              size="lg"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={!comprovanteFile}
              className="min-w-48 font-bold"
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar Inscrição'}
            </Button>
            
            <p className="text-sm text-default-600 mt-4">
              * Campos obrigatórios
            </p>
            
            {!comprovanteFile && (
              <p className="text-sm text-warning mt-2">
                ⚠️ É necessário enviar o comprovante de pagamento
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
