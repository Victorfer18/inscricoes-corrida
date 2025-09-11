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
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Link } from "@heroui/link";
import { InscricoesTable, type InscricaoTableData, type PaginationData } from "@/components/admin/inscricoes-table";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon,
  DocumentIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { title } from "@/components/primitives";
import { formatarCPF, formatarCelular } from "@/lib/utils";
import { AdminGuard } from "@/components/admin-guard";

// Usando interfaces do componente InscricoesTable
type InscricaoAdmin = InscricaoTableData;
type PaginationInfo = PaginationData;

export default function AdminDashboardPage() {
  const { user, permissions, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  console.log("Dashboard carregado - user:", user?.email, "isAuthenticated:", isAuthenticated);

  const [inscricoes, setInscricoes] = useState<InscricaoAdmin[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [loteFilter, setLoteFilter] = useState("todos");

  // Debounce do termo de busca (800ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 800);

  // Modal de edição
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInscricao, setSelectedInscricao] = useState<InscricaoAdmin | null>(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Lotes disponíveis
  const [lotes, setLotes] = useState<Array<{ id: string; nome: string }>>([]);

  // Lógica de autenticação agora é gerenciada pelo AdminGuard

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

  // Buscar inscrições
  const fetchInscricoes = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
      if (statusFilter !== "todos") params.append("status", statusFilter);
      if (loteFilter !== "todos") params.append("lote_id", loteFilter);

      const response = await fetch(`/api/admin/inscricoes?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInscricoes(data.data.inscricoes);
        setPagination(data.data.pagination);
      } else {
        throw new Error("Erro ao carregar dados");
      }
    } catch (error) {
      setError("Erro ao carregar inscrições");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInscricoes();
    }
  }, [isAuthenticated, debouncedSearchTerm, statusFilter, loteFilter]);

  const handlePageChange = (page: number) => {
    fetchInscricoes(page);
  };

  const handleEditInscricao = (inscricao: InscricaoAdmin) => {
    setSelectedInscricao(inscricao);
    setEditingStatus(inscricao.status);
    setSelectedFile(null);
    onOpen();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUploadComprovante = async () => {
    if (!selectedInscricao || !selectedFile) return;

    try {
      setUploadingFile(true);
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      
      const formData = new FormData();
      formData.append("comprovante", selectedFile);

      const response = await fetch(`/api/admin/inscricoes/${selectedInscricao.id}/comprovante`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchInscricoes(pagination.page);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        throw new Error("Erro ao fazer upload");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedInscricao) return;

    try {
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      
      const response = await fetch(`/api/admin/inscricoes/${selectedInscricao.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: editingStatus,
        }),
      });

      if (response.ok) {
        onClose();
        fetchInscricoes(pagination.page);
      } else {
        throw new Error("Erro ao atualizar status");
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  const handleExport = async (format: "xlsx" | "csv") => {
    try {
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      const params = new URLSearchParams({ format });

      if (statusFilter !== "todos") params.append("status", statusFilter);
      if (loteFilter !== "todos") params.append("lote_id", loteFilter);

      const response = await fetch(`/api/admin/export?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `inscricoes_${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Erro ao exportar:", error);
    }
  };

  // Funções de status movidas para o componente InscricoesTable

  // Loading e autenticação são gerenciados pelo AdminGuard

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={title({ size: "lg" })}>Painel Administrativo</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Bem-vindo, {user?.nome}
            </p>
          </div>
          <Button
            color="danger"
            variant="light"
            startContent={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
            onPress={logout}
          >
            Sair
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardBody className="text-center">
              <p className="text-2xl font-bold text-blue-600">{pagination.total}</p>
              <p className="text-sm text-gray-600">Total de Inscrições</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {inscricoes.filter(i => i.status === "confirmado").length}
              </p>
              <p className="text-sm text-gray-600">Confirmados</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {inscricoes.filter(i => i.status === "pendente").length}
              </p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {inscricoes.filter(i => i.status === "cancelada").length}
              </p>
              <p className="text-sm text-gray-600">Canceladas</p>
            </CardBody>
          </Card>
        </div>

        {/* Filtros e Ações */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <Input
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
                className="flex-1"
              />
              
              <Select
                placeholder="Status"
                selectedKeys={[statusFilter]}
                onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                className="w-full md:w-48"
              >
                <SelectItem key="todos">Todos os Status</SelectItem>
                <SelectItem key="pendente">Pendente</SelectItem>
                <SelectItem key="confirmado">Confirmado</SelectItem>
                <SelectItem key="cancelada">Cancelada</SelectItem>
              </Select>

              <Select
                placeholder="Lote"
                selectedKeys={[loteFilter]}
                onSelectionChange={(keys) => setLoteFilter(Array.from(keys)[0] as string)}
                className="w-full md:w-48"
              >
                <SelectItem key="todos">Todos os Lotes</SelectItem>
                {lotes.map((lote) => (
                  <SelectItem key={lote.id}>{lote.nome}</SelectItem>
                ))}
              </Select>

              {permissions?.can_export_data && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      color="primary"
                      startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
                    >
                      Exportar
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="xlsx" onPress={() => handleExport("xlsx")}>
                      Excel (.xlsx)
                    </DropdownItem>
                    <DropdownItem key="csv" onPress={() => handleExport("csv")}>
                      CSV (.csv)
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Tabela de Inscrições */}
        <Card>
          <CardBody className="p-0">
            <InscricoesTable
              inscricoes={inscricoes}
              pagination={pagination}
              loading={loading}
              error={error}
              canEdit={permissions?.can_edit_inscricoes || false}
              onEdit={handleEditInscricao}
              onPageChange={handlePageChange}
            />
          </CardBody>
        </Card>

        {/* Modal de Edição */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <h3>Editar Inscrição</h3>
                </ModalHeader>
                <ModalBody>
                  {selectedInscricao && (
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold">{selectedInscricao.nome_completo}</p>
                        <p className="text-sm text-gray-500">{selectedInscricao.email}</p>
                        <p className="text-sm text-gray-500">CPF: {formatarCPF(selectedInscricao.cpf)}</p>
                      </div>
                      
                      <Select
                        label="Status"
                        selectedKeys={[editingStatus]}
                        onSelectionChange={(keys) => setEditingStatus(Array.from(keys)[0] as string)}
                      >
                        <SelectItem key="pendente">Pendente</SelectItem>
                        <SelectItem key="confirmado">Confirmado</SelectItem>
                        <SelectItem key="cancelada">Cancelada</SelectItem>
                      </Select>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Comprovante Atual:</p>
                        {selectedInscricao.comprovante_url ? (
                          <Link
                            href={selectedInscricao.comprovante_url}
                            target="_blank"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            {selectedInscricao.comprovante_url.includes('.pdf') ? (
                              <DocumentIcon className="w-4 h-4" />
                            ) : (
                              <PhotoIcon className="w-4 h-4" />
                            )}
                            Ver comprovante atual
                          </Link>
                        ) : (
                          <span className="text-gray-400">Nenhum arquivo anexado</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Anexar Novo Comprovante:</p>
                        <input
                          id="file-input"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                        {selectedFile && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-600">
                              Arquivo selecionado: {selectedFile.name}
                            </span>
                            <Button
                              size="sm"
                              color="primary"
                              onPress={handleUploadComprovante}
                              isLoading={uploadingFile}
                              disabled={uploadingFile}
                            >
                              {uploadingFile ? "Enviando..." : "Enviar"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button color="primary" onPress={handleUpdateStatus}>
                    Salvar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        </div>
      </div>
    </AdminGuard>
  );
}
