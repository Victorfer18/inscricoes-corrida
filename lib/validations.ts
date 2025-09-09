import { z } from "zod";

// Função para validar CPF
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Schema para validação do formulário de inscrição
export const inscricaoSchema = z.object({
  nomeCompleto: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine(validarCPF, "CPF inválido"),

  idade: z
    .number()
    .min(12, "Idade mínima é 12 anos")
    .max(100, "Idade máxima é 100 anos"),

  sexo: z.enum(["Feminino", "Masculino"], {
    message: "Sexo é obrigatório",
  }),

  celular: z
    .string()
    .min(1, "Celular é obrigatório")
    .regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Formato de celular inválido"),

  email: z.string().email("Email inválido").optional().or(z.literal("")),

  tamanhoBlusa: z.enum(["P", "M", "G", "GG"], {
    message: "Tamanho da blusa é obrigatório",
  }),

  comprovanteFile: z
    .instanceof(File, { message: "Comprovante de pagamento é obrigatório" })
    .refine((file) => file.size > 0, "Comprovante de pagamento é obrigatório")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Arquivo deve ter no máximo 5MB",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          file.type,
        ),
      "Apenas arquivos de imagem são aceitos (JPG, PNG, GIF)",
    ),
});

export type InscricaoFormData = z.infer<typeof inscricaoSchema>;

// Schema para dados do PIX
export const pixSchema = z.object({
  chavePix: z.string().min(1, "Chave PIX é obrigatória"),
  valor: z.number().positive("Valor deve ser positivo"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  whatsapp: z.string().min(1, "WhatsApp é obrigatório"),
});

export type PixData = z.infer<typeof pixSchema>;
