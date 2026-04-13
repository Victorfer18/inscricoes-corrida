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

import { AdminGuard } from "@/components/admin-guard";
import { title } from "@/components/primitives";
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Premio {
  id: string;
  evento_id: string;
  posicao: number;
  titulo: string | null;
  valor: number | null;
  descricao: string | null;
  icone: string | null;
  cor: string | null;
}

export default function PremiosPage() {
  const params = useParams();
  const router = useRouter();
  const eventoId = params.id as string;

  const [premios, setPremios] = useState<Premio[]>([]);
  const [nomeEvento, setNomeEvento] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<Premio>>({});
  const [saving, setSaving] = useState(false);

  const fetchPremios = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(
        localStorage.getItem("admin_session") || "{}",
      ).token;

      const response = await fetch(
        `/api/admin/premios?evento_id=${eventoId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setLoadError(null);
        setPremios(data.data?.premios || []);
      } else {
        setLoadError(
          typeof data.error === "string"
            ? data.error
            : typeof data.message === "string"
              ? data.message
              : `Erro ${response.status} ao carregar prêmios`,
        );
        setPremios([]);
      }
    } catch {
      setLoadError("Falha de rede ao carregar prêmios.");
      setPremios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!eventoId) return;

    const loadNome = async () => {
      try {
        const token = JSON.parse(
          localStorage.getItem("admin_session") || "{}",
        ).token;
        const r = await fetch("/api/admin/eventos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await r.json();
        const ev = (data.data?.eventos || []).find(
          (e: { id: string }) => e.id === eventoId,
        );
        if (ev?.nome) setNomeEvento(ev.nome);
      } catch {
        /* ignore */
      }
    };

    void loadNome();
    void fetchPremios();
  }, [eventoId]);

  const handleOpenModal = (p?: Premio) => {
    if (p) {
      setIsEditing(true);
      setCurrent(p);
    } else {
      setIsEditing(false);
      const nextPos =
        premios.length > 0
          ? Math.max(...premios.map((x) => x.posicao)) + 1
          : 1;
      setCurrent({
        evento_id: eventoId,
        posicao: nextPos,
        titulo: "",
        valor: null,
        descricao: "",
        icone: "🏅",
        cor: null,
      });
    }
    onOpen();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = JSON.parse(
        localStorage.getItem("admin_session") || "{}",
      ).token;

      const url =
        isEditing && current.id
          ? `/api/admin/premios/${current.id}`
          : `/api/admin/premios`;
      const method = isEditing && current.id ? "PUT" : "POST";

      const body =
        method === "POST"
          ? {
              evento_id: eventoId,
              posicao: current.posicao,
              titulo: current.titulo,
              valor: current.valor,
              descricao: current.descricao,
              icone: current.icone,
              cor: current.cor,
            }
          : {
              posicao: current.posicao,
              titulo: current.titulo,
              valor: current.valor,
              descricao: current.descricao,
              icone: current.icone,
              cor: current.cor,
            };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onClose();
        void fetchPremios();
      } else {
        const err = await response.json().catch(() => ({}));
        alert(
          typeof err.error === "string"
            ? err.error
            : "Erro ao salvar prêmio",
        );
      }
    } catch {
      alert("Erro ao salvar prêmio");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este prêmio da listagem pública?")) return;
    try {
      const token = JSON.parse(
        localStorage.getItem("admin_session") || "{}",
      ).token;
      const response = await fetch(`/api/admin/premios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) void fetchPremios();
      else alert("Erro ao excluir prêmio");
    } catch {
      alert("Erro ao excluir prêmio");
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
              <h1 className={title({ size: "lg" })}>Prêmios do evento</h1>
              <p className="text-gray-600 mt-1">
                {nomeEvento ? (
                  <>
                    <span className="font-medium">{nomeEvento}</span> — ordem e
                    valores exibidos na página inicial (classificação).
                  </>
                ) : (
                  "Defina posição (1º, 2º…), título, valor simbólico e ícone."
                )}
              </p>
            </div>
            <Button
              color="primary"
              startContent={<PlusIcon className="w-5 h-5" />}
              onPress={() => handleOpenModal()}
            >
              Novo prêmio
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
              <Table aria-label="Prêmios">
                <TableHeader>
                  <TableColumn>POS.</TableColumn>
                  <TableColumn>TÍTULO</TableColumn>
                  <TableColumn>VALOR (R$)</TableColumn>
                  <TableColumn>DESCRIÇÃO</TableColumn>
                  <TableColumn>ÍCONE</TableColumn>
                  <TableColumn>AÇÕES</TableColumn>
                </TableHeader>
                <TableBody>
                  {premios.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-semibold">{p.posicao}</TableCell>
                      <TableCell>{p.titulo}</TableCell>
                      <TableCell>
                        {p.valor != null
                          ? `R$ ${Number(p.valor).toFixed(2).replace(".", ",")}`
                          : "—"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-gray-600">
                        {p.descricao || "—"}
                      </TableCell>
                      <TableCell className="text-xl">{p.icone || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleOpenModal(p)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={() => handleDelete(p.id)}
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
            {premios.length === 0 && !loading && !loadError && (
              <div className="mt-4 text-center text-gray-500">
                Nenhum prêmio cadastrado. Use &quot;Novo prêmio&quot; ou insira
                linhas na tabela <code className="text-xs">premios</code> no
                Supabase.
              </div>
            )}
          </div>

          <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>
                    {isEditing ? "Editar prêmio" : "Novo prêmio"}
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col gap-4">
                      <Input
                        label="Posição (ordem na home)"
                        type="number"
                        value={String(current.posicao ?? 1)}
                        onChange={(e) =>
                          setCurrent({
                            ...current,
                            posicao: Number.parseInt(e.target.value, 10) || 1,
                          })
                        }
                        isRequired
                      />
                      <Input
                        label="Título"
                        placeholder="Ex.: 1º Lugar"
                        value={current.titulo ?? ""}
                        onChange={(e) =>
                          setCurrent({ ...current, titulo: e.target.value })
                        }
                        isRequired
                      />
                      <Input
                        label="Valor (R$) — opcional"
                        type="number"
                        placeholder="500"
                        value={
                          current.valor != null ? String(current.valor) : ""
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          setCurrent({
                            ...current,
                            valor:
                              v === ""
                                ? null
                                : (Number.parseFloat(v) as number),
                          });
                        }}
                      />
                      <Textarea
                        label="Descrição — opcional"
                        placeholder="Ex.: Troféu"
                        value={current.descricao ?? ""}
                        onChange={(e) =>
                          setCurrent({ ...current, descricao: e.target.value })
                        }
                      />
                      <Input
                        label="Ícone (emoji)"
                        placeholder="🥇"
                        value={current.icone ?? ""}
                        onChange={(e) =>
                          setCurrent({ ...current, icone: e.target.value })
                        }
                      />
                      <Input
                        label="Cor (hex) — opcional"
                        placeholder="#eab308"
                        value={current.cor ?? ""}
                        onChange={(e) =>
                          setCurrent({ ...current, cor: e.target.value || null })
                        }
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
