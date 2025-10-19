"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
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
import {
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useAuth } from "@/hooks/useAuth";
import { AdminPageLayout } from "@/components/admin/admin-page-layout";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminNavButtons } from "@/components/admin/admin-nav-buttons";
import { formatarCPF } from "@/lib/utils";

interface InscricaoConfirmada {
  id: string;
  nome_completo: string;
  cpf: string;
  email: string;
  celular: string;
  idade: number;
  sexo: string;
  tamanho_blusa: string;
  lote_nome: string;
  lote_valor: number;
  created_at: string;
}

interface Sorteado extends InscricaoConfirmada {
  rodada: number;
}

export default function SorteiosPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Estados
  const [lotes, setLotes] = useState<Array<{ id: string; nome: string }>>([]);
  const [loteId, setLoteId] = useState("");
  const [loteNome, setLoteNome] = useState("");
  const [inscricoes, setInscricoes] = useState<InscricaoConfirmada[]>([]);
  const [inscricoesDisponiveis, setInscricoesDisponiveis] = useState<InscricaoConfirmada[]>([]);
  const [sorteados, setSorteados] = useState<Sorteado[]>([]);
  const [loading, setLoading] = useState(false);
  const [sorteando, setSorteando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [rodadaAtual, setRodadaAtual] = useState(0);
  const [ultimoSorteado, setUltimoSorteado] = useState<Sorteado | null>(null);
  const [tituloSorteio, setTituloSorteio] = useState("");
  const [descricaoSorteio, setDescricaoSorteio] = useState("");

  // Modal de resumo
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenFinalizar, onOpen: onOpenFinalizar, onClose: onCloseFinalizar } = useDisclosure();

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

  // Buscar inscrições confirmadas do lote
  const buscarInscricoes = async () => {
    if (!loteId) {
      return;
    }

    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      
      const response = await fetch(`/api/admin/sorteios/inscricoes-confirmadas?lote_id=${loteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInscricoes(data.data.inscricoes);
        setInscricoesDisponiveis(data.data.inscricoes);
        setSorteados([]);
        setRodadaAtual(0);
        setUltimoSorteado(null);
        
        // Guardar nome do lote
        if (loteId === "todos") {
          setLoteNome("Todos os Lotes");
        } else {
          const lote = lotes.find(l => l.id === loteId);
          setLoteNome(lote?.nome || "");
        }
        
        // Limpar títulos anteriores
        setTituloSorteio("");
        setDescricaoSorteio("");
      } else {
        throw new Error("Erro ao carregar inscrições");
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Realizar sorteio
  const realizarSorteio = () => {
    if (inscricoesDisponiveis.length === 0) {
      return;
    }

    setSorteando(true);

    // Animação de sorteio (2 segundos)
    let contador = 0;
    const intervalo = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * inscricoesDisponiveis.length);
      setUltimoSorteado({
        ...inscricoesDisponiveis[randomIndex],
        rodada: rodadaAtual + 1,
      });
      contador++;
      
      if (contador >= 20) {
        clearInterval(intervalo);
        
        // Sortear de verdade
        const indiceAleatorio = Math.floor(Math.random() * inscricoesDisponiveis.length);
        const sorteado: Sorteado = {
          ...inscricoesDisponiveis[indiceAleatorio],
          rodada: rodadaAtual + 1,
        };

        setUltimoSorteado(sorteado);
        setSorteados((prev) => [...prev, sorteado]);
        setInscricoesDisponiveis((prev) => 
          prev.filter((insc) => insc.id !== sorteado.id)
        );
        setRodadaAtual((prev) => prev + 1);
        setSorteando(false);
      }
    }, 100);
  };

  // Resetar sorteio
  const resetarSorteio = () => {
    setInscricoesDisponiveis(inscricoes);
    setSorteados([]);
    setRodadaAtual(0);
    setUltimoSorteado(null);
  };

  // Salvar sorteio no banco
  const salvarSorteio = async () => {
    if (sorteados.length === 0) {
      return;
    }

    if (!tituloSorteio.trim()) {
      alert("Por favor, insira um título para o sorteio");
      return;
    }

    try {
      setSalvando(true);
      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;

      const payload = {
        titulo: tituloSorteio,
        descricao: descricaoSorteio,
        lote_id: loteId === "todos" ? null : loteId, // Null para "todos os lotes"
        lote_nome: loteNome,
        total_inscritos: inscricoes.length,
        sorteados: sorteados.map((s) => ({
          inscricao_id: s.id,
          rodada: s.rodada,
        })),
      };

      const response = await fetch("/api/admin/sorteios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Notificação de sucesso
        const notification = document.createElement("div");
        notification.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md";
        notification.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="font-semibold">Sorteio salvo com sucesso!</p>
              <p class="text-sm">Os dados foram armazenados no banco de dados.</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 5000);

        onCloseFinalizar();
        
        // Opcionalmente redirecionar para histórico
        setTimeout(() => {
          router.push("/admin/sorteios/historico");
        }, 2000);
      } else {
        throw new Error("Erro ao salvar sorteio");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar sorteio. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  // Exportar resumo em PDF
  const exportarResumo = () => {
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
    doc.text(tituloSorteio || "Sorteio de Inscritos", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // Box com informações
    const infoY = 40;
    doc.setDrawColor(220, 20, 60);
    doc.setLineWidth(0.5);
    doc.rect(15, infoY, 180, 20);
    
    doc.text(`Lote: ${loteNome}`, 20, infoY + 8);
    doc.text(`Total Sorteados: ${sorteados.length}`, 20, infoY + 15);
    doc.text(`Data: ${new Date().toLocaleString("pt-BR")}`, 110, infoY + 8);

    // Preparar dados da tabela
    const tableData = sorteados.map(s => [
      s.rodada.toString(),
      s.nome_completo,
      formatarCPF(s.cpf),
      s.email,
    ]);

    // Criar tabela
    autoTable(doc, {
      head: [["Rodada", "Nome Completo", "CPF", "Email"]],
      body: tableData,
      startY: 65,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [220, 20, 60],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },
        1: { cellWidth: 60 },
        2: { cellWidth: 35, halign: "center" },
        3: { cellWidth: 65 },
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

    // Salvar
    doc.save(`sorteio_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <AdminPageLayout>
      <AdminHeader
        titulo="Sorteios de Inscritos"
        descricao="Realize sorteios dos inscritos confirmados por lote"
      >
        <AdminNavButtons currentPage="sorteios" />
      </AdminHeader>

      {/* Seleção de Lote */}
      <Card className="mb-4 md:mb-6">
        <CardBody>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:items-end">
            <Select
              label="Selecione o Lote"
              placeholder="Escolha um lote"
              selectedKeys={loteId ? [loteId] : []}
              onSelectionChange={(keys) => setLoteId(Array.from(keys)[0] as string)}
              className="w-full md:flex-1"
              isDisabled={sorteando}
              items={[{ id: "todos", nome: "🎯 Todos os Lotes (Todos os Inscritos Confirmados)" }, ...lotes]}
            >
              {(lote) => (
                <SelectItem key={lote.id}>
                  {lote.nome}
                </SelectItem>
              )}
            </Select>

            <div className="flex gap-2">
              <Button
                color="primary"
                className="flex-1 md:flex-none"
                onPress={buscarInscricoes}
                isLoading={loading}
                isDisabled={!loteId || sorteando}
              >
                <span className="hidden sm:inline">Buscar Inscritos</span>
                <span className="sm:hidden">Buscar</span>
              </Button>

              {inscricoes.length > 0 && (
                <Button
                  color="warning"
                  variant="flat"
                  className="flex-1 md:flex-none"
                  startContent={<ArrowPathIcon className="w-4 h-4" />}
                  onPress={resetarSorteio}
                  isDisabled={sorteando || sorteados.length === 0}
                >
                  <span className="hidden sm:inline">Resetar</span>
                  <span className="sm:hidden">↻</span>
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Informações */}
      {inscricoes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
              <Card>
                <CardBody className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {inscricoes.length}
                  </p>
                  <p className="text-sm text-gray-600">Total de Inscritos</p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {sorteados.length}
                  </p>
                  <p className="text-sm text-gray-600">Já Sorteados</p>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {inscricoesDisponiveis.length}
                  </p>
                  <p className="text-sm text-gray-600">Disponíveis para Sorteio</p>
          </CardBody>
        </Card>
      </div>
      )}

      {/* Área de Sorteio */}
      {inscricoes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Card de Sorteio */}
          <Card className="h-fit">
            <CardHeader>
              <h3 className="text-lg md:text-xl font-bold">Realizar Sorteio</h3>
            </CardHeader>
            <CardBody className="p-3 md:p-4">
                  {inscricoesDisponiveis.length > 0 ? (
                    <>
                      {ultimoSorteado && (
                        <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                          <div className="flex items-center gap-2 mb-3">
                            <SparklesIcon className="w-6 h-6 text-purple-600" />
                            <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100">
                              {sorteando ? "Sorteando..." : `Rodada ${ultimoSorteado.rodada}`}
                            </h4>
                          </div>
                          <div className={sorteando ? "animate-pulse" : ""}>
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                              {ultimoSorteado.nome_completo}
                            </p>
                            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              <p><strong>CPF:</strong> {formatarCPF(ultimoSorteado.cpf)}</p>
                              <p><strong>Email:</strong> {ultimoSorteado.email}</p>
                              <p><strong>Idade:</strong> {ultimoSorteado.idade} anos • {ultimoSorteado.sexo}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        color="primary"
                        size="lg"
                        className="w-full"
                        startContent={<SparklesIcon className="w-5 h-5" />}
                        onPress={realizarSorteio}
                        isLoading={sorteando}
                        isDisabled={sorteando}
                      >
                        {sorteando ? "Sorteando..." : "Sortear Inscrito"}
                      </Button>

                      {sorteados.length > 0 && (
                        <Button
                          color="success"
                          variant="flat"
                          className="w-full mt-4"
                          startContent={<CheckCircleIcon className="w-5 h-5" />}
                          onPress={onOpenFinalizar}
                        >
                          Finalizar e Salvar Sorteio
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Todos os inscritos foram sorteados!
                      </p>
                      <Button
                        color="success"
                        className="mt-4"
                        startContent={<CheckCircleIcon className="w-5 h-5" />}
                        onPress={onOpenFinalizar}
                      >
                        Finalizar e Salvar Sorteio
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>

          {/* Lista de Sorteados */}
          <Card>
            <CardHeader>
              <h3 className="text-lg md:text-xl font-bold">
                Sorteados ({sorteados.length})
              </h3>
            </CardHeader>
            <CardBody className="p-3 md:p-4">
              <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto space-y-2">
                {sorteados.length === 0 ? (
                  <p className="text-center text-gray-500 py-8 text-sm md:text-base">
                    Nenhum sorteio realizado ainda
                  </p>
                ) : (
                  sorteados.map((sorteado, index) => (
                    <div
                      key={sorteado.id}
                      className="p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Chip size="sm" color="primary" variant="flat">
                                  Rodada {sorteado.rodada}
                                </Chip>
                                <span className="text-xs text-gray-500">#{index + 1}</span>
                              </div>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {sorteado.nome_completo}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                CPF: {formatarCPF(sorteado.cpf)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {sorteado.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
          </CardBody>
        </Card>
      </div>
      )}

      {/* Mensagem inicial */}
      {inscricoes.length === 0 && !loading && (
        <Card>
              <CardBody className="text-center py-12">
                <SparklesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Selecione um lote e clique em "Buscar Inscritos" para começar
                </p>
          </CardBody>
        </Card>
      )}

      {/* Modal de Finalizar Sorteio */}
      <Modal isOpen={isOpenFinalizar} onClose={onCloseFinalizar} size="3xl">
            <ModalContent>
              {(onCloseFinalizar) => (
                <>
                  <ModalHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                      <h3>Finalizar e Salvar Sorteio</h3>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                          Total de sorteados: {sorteados.length}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Lote: {loteNome}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Título do Sorteio *
                          </label>
                          <input
                            type="text"
                            value={tituloSorteio}
                            onChange={(e) => setTituloSorteio(e.target.value)}
                            placeholder="Ex: Sorteio de Brindes - Outubro Rosa"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Descrição (opcional)
                          </label>
                          <textarea
                            value={descricaoSorteio}
                            onChange={(e) => setDescricaoSorteio(e.target.value)}
                            placeholder="Descreva o propósito do sorteio..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="max-h-[300px] overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                            <tr>
                              <th className="p-2 text-left">Rodada</th>
                              <th className="p-2 text-left">Nome</th>
                              <th className="p-2 text-left">CPF</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sorteados.map((sorteado) => (
                              <tr key={sorteado.id} className="border-b dark:border-gray-700">
                                <td className="p-2">{sorteado.rodada}</td>
                                <td className="p-2">{sorteado.nome_completo}</td>
                                <td className="p-2">{formatarCPF(sorteado.cpf)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="light" onPress={onCloseFinalizar} isDisabled={salvando}>
                      Cancelar
                    </Button>
                    <Button
                      color="success"
                      startContent={<CheckCircleIcon className="w-4 h-4" />}
                      onPress={salvarSorteio}
                      isLoading={salvando}
                      isDisabled={salvando || !tituloSorteio.trim()}
                    >
                      {salvando ? "Salvando..." : "Salvar"}
                    </Button>
                  </ModalFooter>
                </>
              )}
        </ModalContent>
      </Modal>

      {/* Modal de Visualização Rápida */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                      <h3>Lista de Sorteados</h3>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="max-h-[400px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                          <tr>
                            <th className="p-2 text-left">Rodada</th>
                            <th className="p-2 text-left">Nome</th>
                            <th className="p-2 text-left">Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sorteados.map((sorteado) => (
                            <tr key={sorteado.id} className="border-b dark:border-gray-700">
                              <td className="p-2">{sorteado.rodada}</td>
                              <td className="p-2">{sorteado.nome_completo}</td>
                              <td className="p-2 text-xs">{sorteado.email}</td>
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
                  </ModalFooter>
                </>
              )}
        </ModalContent>
      </Modal>
    </AdminPageLayout>
  );
}

