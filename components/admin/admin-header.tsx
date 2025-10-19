"use client";

import { Button } from "@heroui/button";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { title } from "@/components/primitives";
import { useAuth } from "@/hooks/useAuth";

interface AdminHeaderProps {
  titulo: string;
  descricao: string;
  children?: React.ReactNode;
}

export function AdminHeader({ titulo, descricao, children }: AdminHeaderProps) {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
      <div className="flex-1">
        <h1 className={title({ size: "lg" })}>{titulo}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
          {descricao}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {children}
        <Button
          color="danger"
          variant="light"
          size="sm"
          className="md:size-md"
          startContent={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
          onPress={logout}
        >
          Sair
        </Button>
      </div>
    </div>
  );
}

