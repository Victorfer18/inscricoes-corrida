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
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdminStats } from "@/hooks/useAdminStats";
import { title } from "@/components/primitives";
import { formatarCPF, formatarCelular } from "@/lib/utils";
import { AdminGuard } from "@/components/admin-guard";

// Usando interfaces do componente InscricoesTable
type InscricaoAdmin = InscricaoTableData;
type PaginationInfo = PaginationData;

export default function AdminDashboardPage() {
  const { user, permissions, isAuthenticated, isLoading, logout } = useAuth();
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  const router = useRouter();


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


  const handleUpdateStatus = async () => {
    if (!selectedInscricao) return;

    try {
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      
      // Validar se está tentando confirmar sem comprovante
      if (editingStatus === "confirmado") {
        const hasExistingComprovante = selectedInscricao.comprovante_url && selectedInscricao.comprovante_url.trim() !== "";
        const hasNewFile = selectedFile !== null;
        
        if (!hasExistingComprovante && !hasNewFile) {
          // Usar uma notificação mais elegante
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md';
          notification.innerHTML = `
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-semibold">Comprovante necessário</p>
                <p class="text-sm">Para confirmar a inscrição é necessário ter um comprovante anexado.</p>
              </div>
            </div>
          `;
          document.body.appendChild(notification);
          
          // Remover após 5 segundos
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 5000);
          
          return;
        }
      }
      
      // Se há arquivo selecionado, fazer upload primeiro
      if (selectedFile) {
        setUploadingFile(true);
        
        const formData = new FormData();
        formData.append("comprovante", selectedFile);

        const uploadResponse = await fetch(`/api/admin/inscricoes/${selectedInscricao.id}/comprovante`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Erro ao fazer upload do arquivo");
        }
      }
      
      // Atualizar status
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
        refetchStats(); // Atualizar estatísticas globais
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        throw new Error("Erro ao atualizar status");
      }
    } catch (error) {
    } finally {
      setUploadingFile(false);
    }
  };

  const handleExport = async (format: "xlsx" | "csv" | "pdf") => {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Verificar se o blob não está vazio
      if (blob.size === 0) {
        throw new Error("Arquivo gerado está vazio");
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `inscricoes_${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Mostrar notificação de sucesso
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="font-semibold">Exportação concluída</p>
            <p class="text-sm">Arquivo ${format.toUpperCase()} baixado com sucesso.</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Remover após 3 segundos
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);

    } catch (error) {
      console.error('Erro na exportação:', error);
      
      // Mostrar notificação de erro
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="font-semibold">Erro na exportação</p>
            <p class="text-sm">${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Remover após 5 segundos
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 5000);
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
              <p className="text-2xl font-bold text-blue-600">
                {statsLoading ? "..." : stats?.total || 0}
              </p>
              <p className="text-sm text-gray-600">Total de Inscrições</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {statsLoading ? "..." : stats?.confirmados || 0}
              </p>
              <p className="text-sm text-gray-600">Confirmados</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {statsLoading ? "..." : stats?.pendentes || 0}
              </p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {statsLoading ? "..." : stats?.canceladas || 0}
              </p>
              <p className="text-sm text-gray-600">Canceladas</p>
            </CardBody>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                color="secondary"
                size="lg"
                className="flex-1"
                onPress={() => router.push("/admin/sorteios")}
              >
                🎲 Realizar Sorteios de Inscritos
              </Button>
              <Button
                color="default"
                variant="bordered"
                size="lg"
                className="flex-1"
                onPress={() => router.push("/admin/sorteios/historico")}
              >
                📋 Histórico de Sorteios
              </Button>
            </div>
          </CardBody>
        </Card>

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
                <>
                  {lotes.map((lote) => (
                    <SelectItem key={lote.id}>{lote.nome}</SelectItem>
                  ))}
                </>
              </Select>

              <Button
                color="default"
                variant="bordered"
                startContent={<ArrowPathIcon className="w-4 h-4" />}
                onPress={() => {
                  fetchInscricoes(pagination.page);
                  refetchStats();
                }}
                isLoading={loading}
                disabled={loading}
              >
                Recarregar
              </Button>

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
                    <DropdownItem key="pdf" onPress={() => handleExport("pdf")}>
                      PDF (.pdf)
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
                      
                      <div className="space-y-2">
                        <Select
                          label="Status"
                          selectedKeys={[editingStatus]}
                          onSelectionChange={(keys) => setEditingStatus(Array.from(keys)[0] as string)}
                        >
                          <SelectItem key="pendente">Pendente</SelectItem>
                          <SelectItem key="confirmado">Confirmado</SelectItem>
                          <SelectItem key="cancelada">Cancelada</SelectItem>
                        </Select>
                        
                        {editingStatus === "confirmado" && 
                         !selectedInscricao?.comprovante_url && 
                         !selectedFile && (
                          <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 p-2 rounded-lg">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>⚠️ Para confirmar é necessário anexar um comprovante</span>
                          </div>
                        )}
                      </div>

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
                            <span className="text-sm text-green-600">
                              ✓ Arquivo selecionado: {selectedFile.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose} disabled={uploadingFile}>
                    Cancelar
                  </Button>
                  <Button 
                    color="primary" 
                    onPress={handleUpdateStatus}
                    isLoading={uploadingFile}
                    disabled={uploadingFile}
                  >
                    {uploadingFile ? "Salvando..." : "Salvar"}
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
