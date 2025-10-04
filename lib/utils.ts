import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Validação de CPF
export function validarCPF(cpf: string): boolean {
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

// Formatação de CPF
export function formatarCPF(cpf: string | null | undefined): string {
  if (!cpf) return "";
  
  cpf = cpf.replace(/[^\d]/g, "");

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Formatação de celular
export function formatarCelular(celular: string | null | undefined): string {
  if (!celular) return "";
  
  celular = celular.replace(/[^\d]/g, "");

  return celular.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

// Validação de email
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
}

// Copiar texto para clipboard
export async function copiarParaClipboard(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);

    return true;
  } catch (err) {
    console.error("Erro ao copiar para clipboard:", err);

    return false;
  }
}

// Limpar CPF (remover formatação)
export function limparCPF(cpf: string): string {
  return cpf.replace(/[^\d]/g, "");
}

// Limpar celular (remover formatação)
export function limparCelular(celular: string): string {
  return celular.replace(/[^\d]/g, "");
}

// Formatação de moeda (Real brasileiro)
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

// Formatação de arquivo para preview
export function formatarTamanhoArquivo(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
