"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { Textarea } from "@heroui/input";

import { AVAILABLE_KIT_ITEMS } from "@/constants/kits";

import { AdminGuard } from "@/components/admin-guard";
import { title } from "@/components/primitives";
import { ArrowLeftIcon, PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface Lote {
  id: string;
  nome: string;
  valor: number;
  total_vagas: number;
  status: boolean;
  evento_id: string;
  kit_items?: string[];
  requisitos_especiais?: string;
  created_at?: string;
}

export default function LotesPage() {
  const params = useParams();
  const router = useRouter();
  const eventoId = params.id as string;
  
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [currentLote, setCurrentLote] = useState<Partial<Lote>>({});
  const [saving, setSaving] = useState(false);

  const fetchLotes = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      
      const response = await fetch(`/api/admin/lotes?evento_id=${eventoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setLoadError(null);
        setLotes(data.data?.lotes || []);
      } else {
        setLoadError(
          typeof data.error === "string"
            ? data.error
            : typeof data.message === "string"
              ? data.message
              : `Erro ${response.status} ao carregar lotes`,
        );
        setLotes([]);
      }
    } catch (error) {
      console.error("Erro ao carregar lotes", error);
      setLoadError("Falha de rede ao carregar lotes.");
      setLotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventoId) {
      fetchLotes();
    }
  }, [eventoId]);

  const handleOpenModal = (lote?: Lote) => {
    if (lote) {
      setIsEditing(true);
      setCurrentLote(lote);
    } else {
      setIsEditing(false);
      setCurrentLote({ status: false, evento_id: eventoId, kit_items: ["camiseta", "medalha", "bolsa", "garrafa", "barra"] });
    }
    onOpen();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      
      const url = isEditing && currentLote.id 
        ? `/api/admin/lotes/${currentLote.id}` 
        : `/api/admin/lotes`;
        
      const method = isEditing && currentLote.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...currentLote, evento_id: eventoId }),
      });

      if (response.ok) {
        onClose();
        fetchLotes();
      } else {
        alert("Erro ao salvar lote");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente deletar este lote?")) return;
    
    try {
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      const response = await fetch(`/api/admin/lotes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchLotes();
      } else {
        alert("Erro ao deletar lote. Existem inscrições amarradas a este lote.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetVigente = async (id: string) => {
    try {
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      // Chamamos PUT mudando apenas status pra true. O backend cuida de desativar os outros do mesmo evento.
      const loteObj = lotes.find(l => l.id === id);
      if(!loteObj) return;

      await fetch(`/api/admin/lotes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...loteObj, status: true }),
      });
      fetchLotes();
    } catch (error) {
      console.error("Erro ao ativar lote", error);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="light"
            startContent={<ArrowLeftIcon className="w-4 h-4" />}
            onPress={() => router.push("/admin/eventos")}
            className="mb-4"
          >
            Voltar para Eventos
          </Button>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={title({ size: "lg" })}>Lotes do Evento</h1>
              <p className="text-gray-600 mt-1">Gerencie os preços e vagas de cada lote desta corrida</p>
            </div>
            <Button
              color="primary"
              startContent={<PlusIcon className="w-5 h-5" />}
              onPress={() => handleOpenModal()}
            >
              Novo Lote
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            {loadError ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                {loadError}
              </div>
            ) : null}
            {loading ? (
              <div className="p-8 text-center">Carregando...</div>
            ) : (
              <Table aria-label="Lotes">
                <TableHeader>
                  <TableColumn>NOME DO LOTE</TableColumn>
                  <TableColumn>VALOR</TableColumn>
                  <TableColumn>VAGAS TOTAIS</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>AÇÕES</TableColumn>
                </TableHeader>
                <TableBody>
                  {lotes.map((lote) => (
                    <TableRow key={lote.id}>
                      <TableCell className="font-semibold">{lote.nome}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-semibold">
                          R$ {Number(lote.valor).toFixed(2).replace(".", ",")}
                        </span>
                      </TableCell>
                      <TableCell>{lote.total_vagas}</TableCell>
                      <TableCell>
                        <Chip
                          color={lote.status ? "success" : "default"}
                          variant="flat"
                        >
                          {lote.status ? "Vigente (Aberto)" : "Fechado"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!lote.status && (
                            <Button
                              size="sm"
                              color="success"
                              variant="flat"
                              startContent={<CheckCircleIcon className="w-4 h-4" />}
                              onPress={() => handleSetVigente(lote.id)}
                            >
                              Tornar Vigente
                            </Button>
                          )}
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleOpenModal(lote)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={() => handleDelete(lote.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {lotes.length === 0 && !loading && !loadError && (
              <div className="mt-4 text-center text-gray-500">
                Nenhum lote criado para este evento. Use &quot;Novo Lote&quot; para
                cadastrar.
              </div>
            )}
          </div>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {isEditing ? "Editar Lote" : "Novo Lote"}
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col gap-4">
                      <Input
                        label="Nome do Lote"
                        placeholder="Ex: 1º Lote"
                        value={currentLote.nome || ""}
                        onChange={(e) => setCurrentLote({ ...currentLote, nome: e.target.value })}
                        isRequired
                      />
                      <Input
                        label="Valor (R$)"
                        type="number"
                        placeholder="79.90"
                        value={currentLote.valor?.toString() || ""}
                        onChange={(e) => setCurrentLote({ ...currentLote, valor: e.target.value as any })}
                        isRequired
                      />
                      <Input
                        label="Total de Vagas"
                        type="number"
                        placeholder="100"
                        value={currentLote.total_vagas?.toString() || ""}
                        onChange={(e) => setCurrentLote({ ...currentLote, total_vagas: e.target.value as any })}
                        isRequired
                      />
                      
                      <div className="space-y-4 pt-2 border-t mt-2">
                        <label className="text-sm font-semibold">Itens do Kit para este Lote</label>
                        <CheckboxGroup
                          orientation="horizontal"
                          value={currentLote.kit_items || []}
                          onChange={(values) => setCurrentLote({...currentLote, kit_items: values as string[]})}
                        >
                          {Object.values(AVAILABLE_KIT_ITEMS).map(item => (
                            <Checkbox key={item.id} value={item.id}>
                              {item.icon} {item.name}
                            </Checkbox>
                          ))}
                        </CheckboxGroup>
                      </div>

                      <Textarea
                        label="Requisitos Especiais (Aviso em destaque)"
                        placeholder="Ex: Para retirar o kit é necessário trazer 1kg de alimento..."
                        value={currentLote.requisitos_especiais || ""}
                        onChange={(e) => setCurrentLote({ ...currentLote, requisitos_especiais: e.target.value })}
                      />

                      <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
                        Após criado, você poderá torná-lo "Vigente" na lista, o que fechará os outros lotes automaticamente e disponibilizará a compra.
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="primary" onPress={handleSave} isLoading={saving}>
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
