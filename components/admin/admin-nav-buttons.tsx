"use client";

import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

interface AdminNavButtonsProps {
  currentPage?: "dashboard" | "sorteios" | "historico";
}

export function AdminNavButtons({ currentPage }: AdminNavButtonsProps) {
  const router = useRouter();

  return (
    <>
      {currentPage !== "dashboard" && (
        <Button
          className="md:size-md"
          color="default"
          size="sm"
          variant="bordered"
          onPress={() => router.push("/admin/dashboard")}
        >
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">🏠</span>
        </Button>
      )}

      {currentPage !== "sorteios" && currentPage !== "historico" && (
        <>
          <Button
            className="md:size-md"
            color="secondary"
            size="sm"
            variant="flat"
            onPress={() => router.push("/admin/sorteios")}
          >
            <span className="hidden sm:inline">Sorteios</span>
            <span className="sm:hidden">🎲</span>
          </Button>
          <Button
            className="md:size-md"
            color="default"
            size="sm"
            variant="flat"
            onPress={() => router.push("/admin/sorteios/historico")}
          >
            <span className="hidden sm:inline">Histórico</span>
            <span className="sm:hidden">📋</span>
          </Button>
        </>
      )}

      {currentPage === "historico" && (
        <Button
          className="md:size-md"
          color="primary"
          size="sm"
          variant="flat"
          onPress={() => router.push("/admin/sorteios")}
        >
          <span className="hidden sm:inline">Novo Sorteio</span>
          <span className="sm:hidden">➕ Sorteio</span>
        </Button>
      )}

      {currentPage === "sorteios" && (
        <Button
          className="md:size-md"
          color="primary"
          size="sm"
          variant="flat"
          onPress={() => router.push("/admin/sorteios/historico")}
        >
          <span className="hidden sm:inline">Ver Histórico</span>
          <span className="sm:hidden">📋 Histórico</span>
        </Button>
      )}
    </>
  );
}
