"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import { AdminGuard } from "@/components/admin-guard";
import { title } from "@/components/primitives";
import { AdminNavButtons } from "@/components/admin/admin-nav-buttons";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  LinkIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

interface Evento {
  id: string;
  nome: string;
  descricao: string;
  data_evento: string | null;
  local: string;
  status: string;
  created_at?: string;
}

export default function EventosPage() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvento, setCurrentEvento] = useState<Partial<Evento>>({});
  const [saving, setSaving] = useState(false);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      
      const response = await fetch("/api/admin/eventos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEventos(data.data.eventos || []);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleOpenModal = (evento?: Evento) => {
    if (evento) {
      setIsEditing(true);
      setCurrentEvento(evento);
    } else {
      setIsEditing(false);
      setCurrentEvento({ status: "inativo" });
    }
    onOpen();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      
      const url = isEditing && currentEvento.id 
        ? `/api/admin/eventos/${currentEvento.id}` 
        : `/api/admin/eventos`;
        
      const method = isEditing && currentEvento.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentEvento),
      });

      if (response.ok) {
        onClose();
        fetchEventos();
      } else {
        alert("Erro ao salvar evento");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente deletar este evento?")) return;
    
    try {
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      const response = await fetch(`/api/admin/eventos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchEventos();
      } else {
        alert("Erro ao deletar evento. Talvez existam inscrições vinculadas a ele.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <AdminNavButtons />

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={title({ size: "lg" })}>Gestão de Corridas / Eventos</h1>
              <p className="text-gray-600 mt-1">Crie eventos e modere status de inscrição</p>
            </div>
            <Button
              color="primary"
              startContent={<PlusIcon className="w-5 h-5" />}
              onPress={() => handleOpenModal()}
            >
              Novo Evento
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            {loading ? (
              <div className="p-8 text-center">Carregando...</div>
            ) : (
              <Table aria-label="Eventos">
                <TableHeader>
                  <TableColumn>NOME / DESCRIÇÃO</TableColumn>
                  <TableColumn>DATA</TableColumn>
                  <TableColumn>LOCAL</TableColumn>
                  <TableColumn>STATUS GERAL</TableColumn>
                  <TableColumn>AÇÕES</TableColumn>
                </TableHeader>
                <TableBody>
                  {eventos.map((ev) => (
                    <TableRow key={ev.id}>
                      <TableCell>
                        <p className="font-semibold">{ev.nome}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{ev.descricao}</p>
                      </TableCell>
                      <TableCell>
                        {ev.data_evento ? new Date(ev.data_evento + "T00:00:00").toLocaleDateString("pt-BR") : "N/A"}
                      </TableCell>
                      <TableCell>{ev.local}</TableCell>
                      <TableCell>
                        <Chip
                          color={ev.status === "ativo" ? "success" : "default"}
                          variant="flat"
                        >
                          {ev.status === "ativo" ? "Inscrições Abertas" : "Inativo / Fechado"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            title="Gerenciar Lotes"
                            variant="flat"
                            color="secondary"
                            startContent={<LinkIcon className="w-4 h-4" />}
                            onPress={() => router.push(`/admin/eventos/${ev.id}/lotes`)}
                          >
                            Lotes
                          </Button>
                          <Button
                            size="sm"
                            title="Prêmios exibidos na home (classificação)"
                            variant="flat"
                            color="warning"
                            startContent={<TrophyIcon className="w-4 h-4" />}
                            onPress={() => router.push(`/admin/eventos/${ev.id}/premios`)}
                          >
                            Prêmios
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleOpenModal(ev)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={() => handleDelete(ev.id)}
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
          </div>

          <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {isEditing ? "Editar Evento" : "Novo Evento"}
                  </ModalHeader>
                  <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nome da Corrida/Evento"
                        placeholder="Ex: 1ª Corrida Solidária"
                        value={currentEvento.nome || ""}
                        onChange={(e) => setCurrentEvento({ ...currentEvento, nome: e.target.value })}
                        isRequired
                        className="md:col-span-2"
                      />
                      <Input
                        label="Data do Evento"
                        type="date"
                        value={currentEvento.data_evento || ""}
                        onChange={(e) => setCurrentEvento({ ...currentEvento, data_evento: e.target.value })}
                      />
                      <Select
                        label="Status do Evento"
                        placeholder="Selecione o status"
                        selectedKeys={[currentEvento.status || "inativo"]}
                        onSelectionChange={(keys) => {
                          setCurrentEvento({ ...currentEvento, status: Array.from(keys)[0] as string });
                        }}
                      >
                        <SelectItem key="ativo">Ativo</SelectItem>
                        <SelectItem key="inativo">Inativo</SelectItem>
                      </Select>
                      <Input
                        label="Local"
                        placeholder="Ex: Quadra Central NS2"
                        value={currentEvento.local || ""}
                        onChange={(e) => setCurrentEvento({ ...currentEvento, local: e.target.value })}
                        className="md:col-span-2"
                      />
                      <Textarea
                        label="Descrição"
                        placeholder="Informações adicionais do evento..."
                        value={currentEvento.descricao || ""}
                        onChange={(e) => setCurrentEvento({ ...currentEvento, descricao: e.target.value })}
                        className="md:col-span-2"
                      />
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
