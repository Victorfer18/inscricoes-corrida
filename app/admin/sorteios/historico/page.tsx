"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import {
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useAuth } from "@/hooks/useAuth";
import { AdminPageLayout } from "@/components/admin/admin-page-layout";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminNavButtons } from "@/components/admin/admin-nav-buttons";
import { formatarCPF } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { Sorteio, SorteioParticipante } from "@/types/sorteio";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function HistoricoSorteiosPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Estados
  const [sorteios, setSorteios] = useState<Sorteio[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loteFilter, setLoteFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [lotes, setLotes] = useState<Array<{ id: string; nome: string }>>([]);

  // Detalhes do sorteio
  const [sorteioSelecionado, setSorteioSelecionado] = useState<Sorteio | null>(null);
  const [participantes, setParticipantes] = useState<SorteioParticipante[]>([]);
  const [loadingSorteioId, setLoadingSorteioId] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const debouncedSearchTerm = useDebounce(searchTerm, 800);

  // Buscar lotes
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await fetch("/api/lotes");
        if (response.ok) {
          const data = await response.json();
          setLotes(data.data.lotes || []);
        }
      } catch (error) {
        console.error("Erro ao buscar lotes:", error);
      }
    };

    fetchLotes();
  }, []);

  // Buscar sorteios
  const fetchSorteios = async (page = 1) => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
      if (statusFilter !== "todos") params.append("status", statusFilter);
      if (loteFilter !== "todos") params.append("lote_id", loteFilter);

      const response = await fetch(`/api/admin/sorteios?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSorteios(data.data.sorteios);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Erro ao buscar sorteios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSorteios();
  }, [debouncedSearchTerm, statusFilter, loteFilter]);

  // Buscar detalhes do sorteio
  const fetchDetalhesSorteio = async (sorteioId: string) => {
    try {
      setLoadingSorteioId(sorteioId);
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;

      const response = await fetch(`/api/admin/sorteios/${sorteioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSorteioSelecionado(data.data.sorteio);
        setParticipantes(data.data.participantes);
        onOpen();
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    } finally {
      setLoadingSorteioId(null);
    }
  };

  // Exportar PDF
  const exportarPDF = (sorteio: Sorteio, participantesList: SorteioParticipante[]) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Título
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Sorteio - Corrida Solidária", 105, 20, { align: "center" });
    
    // Informações do sorteio
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(sorteio.titulo, 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // Box com informações
    const infoY = 40;
    doc.setDrawColor(220, 20, 60); // Rosa
    doc.setLineWidth(0.5);
    doc.rect(15, infoY, 180, 30);
    
    doc.text(`Lote: ${sorteio.lote_nome}`, 20, infoY + 8);
    doc.text(`Total de Inscritos: ${sorteio.total_inscritos}`, 20, infoY + 15);
    doc.text(`Total Sorteados: ${sorteio.total_sorteados}`, 20, infoY + 22);
    
    doc.text(`Realizado por: ${sorteio.realizado_por_nome}`, 110, infoY + 8);
    doc.text(`Data: ${new Date(sorteio.created_at).toLocaleString("pt-BR")}`, 110, infoY + 15);
    
    if (sorteio.descricao) {
      doc.setFontSize(9);
      doc.text(`Descrição: ${sorteio.descricao}`, 20, infoY + 27);
    }

    // Preparar dados da tabela - apenas informações relevantes
    const tableData = participantesList.map(p => [
      p.rodada.toString(),
      p.nome_completo || "",
      formatarCPF(p.cpf || ""),
      p.email || "",
    ]);

    // Criar tabela
    autoTable(doc, {
      head: [["Rodada", "Nome Completo", "CPF", "Email"]],
      body: tableData,
      startY: 75,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [220, 20, 60], // Rosa
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" }, // Rodada
        1: { cellWidth: 60 }, // Nome
        2: { cellWidth: 35, halign: "center" }, // CPF
        3: { cellWidth: 65 }, // Email
      },
      alternateRowStyles: {
        fillColor: [250, 240, 245],
      },
      margin: { left: 15, right: 15 },
    });

    // Rodapé
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(
        `Página ${i} de ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Salvar PDF
    doc.save(`sorteio_${sorteio.titulo.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handlePageChange = (page: number) => {
    fetchSorteios(page);
  };

  return (
    <AdminPageLayout>
      <AdminHeader
        titulo="Histórico de Sorteios"
        descricao="Visualize todos os sorteios realizados"
      >
        <AdminNavButtons currentPage="historico" />
      </AdminHeader>

      {/* Filtros */}
      <Card className="mb-4 md:mb-6">
        <CardBody>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:items-end">
            <Input
              placeholder="Buscar por título, lote ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
              className="w-full md:flex-1"
              size="sm"
            />
            
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-4">
              <Select
                placeholder="Lote"
                selectedKeys={[loteFilter]}
                onSelectionChange={(keys) => setLoteFilter(Array.from(keys)[0] as string)}
                className="w-full md:w-40"
                size="sm"
                items={[{ id: "todos", nome: "Todos os Lotes" }, ...lotes]}
              >
                {(lote) => (
                  <SelectItem key={lote.id}>
                    {lote.nome}
                  </SelectItem>
                )}
              </Select>

              <Select
                placeholder="Status"
                selectedKeys={[statusFilter]}
                onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                className="w-full md:w-40"
                size="sm"
              >
                <SelectItem key="todos">Todos</SelectItem>
                <SelectItem key="finalizado">Finalizado</SelectItem>
                <SelectItem key="cancelado">Cancelado</SelectItem>
              </Select>

              <Button
                color="default"
                variant="bordered"
                size="sm"
                className="col-span-2 md:col-span-1"
                startContent={<ArrowPathIcon className="w-4 h-4" />}
                onPress={() => fetchSorteios(pagination.page)}
                isLoading={loading}
              >
                <span className="hidden sm:inline">Recarregar</span>
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Lista de Sorteios */}
      <Card>
            <CardBody>
              {loading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando sorteios...</p>
                </div>
              ) : sorteios.length === 0 ? (
                <div className="py-12 text-center">
                  <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Nenhum sorteio encontrado
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
              {sorteios.map((sorteio) => (
                <div
                  key={sorteio.id}
                  className="p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {sorteio.titulo}
                        </h3>
                        <Chip
                          color={sorteio.status === "finalizado" ? "success" : "danger"}
                          size="sm"
                          variant="flat"
                        >
                          {sorteio.status === "finalizado" ? "Finalizado" : "Cancelado"}
                        </Chip>
                      </div>
                      
                      {sorteio.descricao && (
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {sorteio.descricao}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-xs md:text-sm">
                            <div>
                              <span className="text-gray-500">Lote:</span>
                              <p className="font-medium">{sorteio.lote_nome}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Sorteados:</span>
                              <p className="font-medium text-green-600">{sorteio.total_sorteados}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Total Inscritos:</span>
                              <p className="font-medium">{sorteio.total_inscritos}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Realizado por:</span>
                              <p className="font-medium">{sorteio.realizado_por_nome}</p>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(sorteio.created_at).toLocaleString("pt-BR")}
                          </p>
                        </div>

                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="w-full md:w-auto"
                      startContent={<EyeIcon className="w-4 h-4" />}
                      onPress={() => fetchDetalhesSorteio(sorteio.id)}
                      isLoading={loadingSorteioId === sorteio.id}
                      isDisabled={loadingSorteioId !== null && loadingSorteioId !== sorteio.id}
                    >
                      <span className="hidden sm:inline">Ver Detalhes</span>
                      <span className="sm:hidden">Detalhes</span>
                    </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Paginação */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    total={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                  />
                </div>
              )}
        </CardBody>
      </Card>

      {/* Modal de Detalhes */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>
                    <div>
                      <h3 className="text-xl font-bold">{sorteioSelecionado?.titulo}</h3>
                      <p className="text-sm text-gray-500 font-normal mt-1">
                        {sorteioSelecionado?.lote_nome} • {sorteioSelecionado?.total_sorteados} sorteados
                      </p>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    {sorteioSelecionado?.descricao && (
                      <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm">{sorteioSelecionado.descricao}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Inscritos</p>
                        <p className="text-2xl font-bold text-blue-600">{sorteioSelecionado?.total_inscritos}</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sorteados</p>
                        <p className="text-2xl font-bold text-green-600">{sorteioSelecionado?.total_sorteados}</p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Realizado por</p>
                        <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                          {sorteioSelecionado?.realizado_por_nome}
                        </p>
                      </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                          <tr>
                            <th className="p-2 text-left">Rodada</th>
                            <th className="p-2 text-left">Nome</th>
                            <th className="p-2 text-left">CPF</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Celular</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participantes.map((participante) => (
                            <tr key={participante.id} className="border-b dark:border-gray-700">
                              <td className="p-2">{participante.rodada}</td>
                              <td className="p-2">{participante.nome_completo}</td>
                              <td className="p-2">{formatarCPF(participante.cpf)}</td>
                              <td className="p-2 text-xs">{participante.email}</td>
                              <td className="p-2">{participante.celular}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                      Fechar
                    </Button>
                    <Button
                      color="primary"
                      startContent={<DocumentTextIcon className="w-4 h-4" />}
                      onPress={() => {
                        if (sorteioSelecionado) {
                          exportarPDF(sorteioSelecionado, participantes);
                        }
                      }}
                    >
                      Exportar PDF
                    </Button>
                  </ModalFooter>
                </>
              )}
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}

