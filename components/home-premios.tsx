"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";

import { formatarMoeda } from "@/lib/utils";
import type { PremioPublic } from "@/types/evento-home";

const VARIANTS = [
  {
    header: "bg-gradient-to-r from-yellow-500 to-amber-600",
    body: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-300 dark:border-yellow-700",
    val: "text-yellow-600",
    icon: "text-4xl",
    valSize: "text-3xl",
  },
  {
    header: "bg-gradient-to-r from-gray-500 to-slate-600",
    body: "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-300 dark:border-gray-700",
    val: "text-gray-600",
    icon: "text-4xl",
    valSize: "text-3xl",
  },
  {
    header: "bg-gradient-to-r from-orange-500 to-red-600",
    body: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-300 dark:border-orange-700",
    val: "text-orange-600",
    icon: "text-4xl",
    valSize: "text-3xl",
  },
  {
    header: "bg-gradient-to-r from-purple-500 to-indigo-600",
    body: "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-300 dark:border-purple-700",
    val: "text-purple-600",
    icon: "text-3xl",
    valSize: "text-2xl",
  },
  {
    header: "bg-gradient-to-r from-teal-500 to-cyan-600",
    body: "bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-300 dark:border-teal-700",
    val: "text-teal-600",
    icon: "text-3xl",
    valSize: "text-2xl",
  },
];

export function HomePremiosGrid({ premios }: { premios: PremioPublic[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
      {premios.map((p, i) => {
        const v = VARIANTS[i % VARIANTS.length];
        const titulo = p.titulo || `Posição ${p.posicao}`;
        const icon = p.icone || "🏅";

        return (
          <Card
            key={p.id}
            className={`${v.body} border-2 hover:scale-105 transition-transform duration-300`}
          >
            <CardHeader className={`${v.header} text-white text-center`}>
              <div className="w-full">
                <div className={`${v.icon} mb-2`}>{icon}</div>
                <h3 className="text-lg sm:text-xl font-bold">{titulo}</h3>
              </div>
            </CardHeader>
            <CardBody className="text-center p-6">
              {p.valor != null && (
                <div
                  className={`${v.valSize} font-bold ${v.val} mb-2`}
                >
                  {formatarMoeda(Number(p.valor))}
                </div>
              )}
              {p.descricao && (
                <div className="text-lg text-default-700 dark:text-default-200">
                  {p.descricao}
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
