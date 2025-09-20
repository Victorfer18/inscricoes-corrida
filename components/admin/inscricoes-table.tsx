"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { useDisclosure } from "@heroui/modal";
import {
  PencilIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import { ComprovanteViewer } from "./comprovante-viewer";

import { formatarCPF } from "@/lib/utils";

export interface InscricaoTableData {
  id: string;
  nome_completo: string;
  cpf: string;
  email: string;
  celular: string;
  idade: number;
  sexo: string;
  tamanho_blusa: string;
  status: string;
  comprovante_url?: string;
  lote_nome?: string;
  lote_valor?: number;
  created_at: string;
  updated_at: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface InscricoesTableProps {
  inscricoes: InscricaoTableData[];
  pagination: PaginationData;
  loading: boolean;
  error?: string;
  canEdit?: boolean;
  onEdit?: (inscricao: InscricaoTableData) => void;
  onPageChange?: (page: number) => void;
}

export function InscricoesTable({
  inscricoes,
  pagination,
  loading,
  error,
  canEdit = false,
  onEdit,
  onPageChange,
}: InscricoesTableProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedComprovante, setSelectedComprovante] = useState<{
    url: string;
    nome: string;
  } | null>(null);

  const handleViewComprovante = (comprovanteUrl: string, nomeCompleto: string) => {
    setSelectedComprovante({
      url: comprovanteUrl,
      nome: nomeCompleto,
    });
    onOpen();
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "success";
      case "pendente":
        return "warning";
      case "cancelada":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmado":
        return "Confirmado";
      case "pendente":
        return "Pendente";
      case "cancelada":
        return "Cancelada";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando inscrições...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Table aria-label="Tabela de inscrições">
        <TableHeader>
          <TableColumn>NOME</TableColumn>
          <TableColumn>CPF</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>LOTE</TableColumn>
          <TableColumn>VALOR</TableColumn>
          <TableColumn>COMPROVANTE</TableColumn>
          <TableColumn>DATA</TableColumn>
          <>
            {canEdit && <TableColumn>AÇÕES</TableColumn>}
          </>
        </TableHeader>
        <TableBody>
          {inscricoes.map((inscricao) => (
            <TableRow key={inscricao.id}>
              <TableCell>
                <div>
                  <p className="font-semibold">{inscricao.nome_completo}</p>
                  <p className="text-sm text-gray-500">
                    {inscricao.idade} anos • {inscricao.sexo}
                  </p>
                </div>
              </TableCell>
              <TableCell>{formatarCPF(inscricao.cpf)}</TableCell>
              <TableCell>{inscricao.email}</TableCell>
              <TableCell>
                <Chip
                  color={getStatusColor(inscricao.status)}
                  size="sm"
                  variant="flat"
                >
                  {getStatusLabel(inscricao.status)}
                </Chip>
              </TableCell>
              <TableCell>{inscricao.lote_nome}</TableCell>
              <TableCell>
                {inscricao.lote_valor ? (
                  <span className="font-semibold text-green-600">
                    R$ {inscricao.lote_valor.toFixed(2).replace('.', ',')}
                  </span>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {inscricao.comprovante_url ? (
                  <div className="flex justify-center">
                    <Button
                      isIconOnly
                      size="md"
                      variant="light"
                      color="primary"
                      onPress={() => handleViewComprovante(inscricao.comprovante_url!, inscricao.nome_completo)}
                      title="Visualizar comprovante"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-gray-400">Sem arquivo</span>
                )}
              </TableCell>
              <TableCell>
                {new Date(inscricao.created_at).toLocaleDateString("pt-BR")}
              </TableCell>
              <>
                {canEdit && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onEdit?.(inscricao)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginação */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center p-4">
          <Pagination
            total={pagination.totalPages}
            page={pagination.page}
            onChange={onPageChange}
          />
        </div>
      )}

      {/* Modal de Visualização de Comprovante */}
      {selectedComprovante && (
        <ComprovanteViewer
          isOpen={isOpen}
          onClose={onClose}
          comprovanteUrl={selectedComprovante.url}
          nomeParticipante={selectedComprovante.nome}
        />
      )}
    </>
  );
}
