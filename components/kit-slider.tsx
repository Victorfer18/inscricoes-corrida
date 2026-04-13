"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { formatarMoeda } from "@/lib/utils";
import { useLoteVigente } from "@/hooks/useLoteVigente";

export function KitSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { valor, loading, kitItems, homeConfig } = useLoteVigente();

  const footerLinha = homeConfig.kit.footerLinhaTemplate
    .replace("{count}", String(kitItems.length))
    .replace("{valor}", loading ? "…" : formatarMoeda(valor));
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || kitItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % kitItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, kitItems.length]);

  const nextSlide = () => {
    if (kitItems.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % kitItems.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    if (kitItems.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + kitItems.length) % kitItems.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center py-12">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "var(--event-gradient-from)" }}
          />
          <p className="text-gray-600 dark:text-gray-400">
            Carregando itens do kit...
          </p>
        </div>
      </div>
    );
  }

  if (kitItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Kit em Preparação
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Os itens do kit serão divulgados em breve
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/25 dark:to-indigo-950/30 border-2 border-violet-200 dark:border-indigo-800 shadow-2xl">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
              <div className="flex justify-center order-1 md:order-none">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-2xl blur-lg opacity-25 animate-pulse"
                    style={{
                      background: `linear-gradient(to right, var(--event-gradient-from), var(--event-gradient-to))`,
                    }}
                  />
                  <div className="relative bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-violet-200/60 dark:border-indigo-700/50">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
                      <Image
                        alt={kitItems[currentIndex]?.name || "Item do kit"}
                        className="object-contain w-full h-full"
                        fallbackSrc={`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="%23f3f4f6"/><text x="90" y="110" text-anchor="middle" font-size="60">${kitItems[currentIndex]?.icon || "📦"}</text></svg>`}
                        height={180}
                        src={
                          kitItems[currentIndex]?.image || "/kit/kit-all.png"
                        }
                        width={180}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left space-y-3 sm:space-y-4 order-2 md:order-none">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">
                  {kitItems[currentIndex]?.icon || "📦"}
                </div>
                <h3
                  className="text-xl sm:text-2xl md:text-3xl font-bold"
                  style={{ color: "var(--event-gradient-from)" }}
                >
                  {kitItems[currentIndex]?.name || "Item do Kit"}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed px-2 md:px-0">
                  {kitItems[currentIndex]?.description ||
                    "Descrição não disponível"}
                </p>

                <div className="flex items-center justify-center md:justify-start gap-2 mt-4 sm:mt-6">
                  <span
                    className="text-xs sm:text-sm font-semibold"
                    style={{ color: "var(--event-primary)" }}
                  >
                    {currentIndex + 1} de {kitItems.length}
                  </span>
                  <div className="flex gap-1">
                    {kitItems.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "w-4 sm:w-6"
                            : "w-2 bg-violet-200 dark:bg-violet-800"
                        }`}
                        style={
                          index === currentIndex
                            ? {
                                background: `linear-gradient(to right, var(--event-gradient-from), var(--event-gradient-to))`,
                              }
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            isIconOnly
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-violet-200 dark:border-indigo-700 hover:bg-violet-50 dark:hover:bg-indigo-950/30 z-10"
            size="sm"
            variant="flat"
            onPress={prevSlide}
          >
            <ChevronLeftIcon
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: "var(--event-primary)" }}
            />
          </Button>

          <Button
            isIconOnly
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-violet-200 dark:border-indigo-700 hover:bg-violet-50 dark:hover:bg-indigo-950/30 z-10"
            size="sm"
            variant="flat"
            onPress={nextSlide}
          >
            <ChevronRightIcon
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: "var(--event-primary)" }}
            />
          </Button>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 px-2">
          {kitItems.map((item, index) => (
            <button
              key={item.id}
              className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 border-2 ${
                index === currentIndex
                  ? "bg-violet-100 dark:bg-violet-900/30 border-violet-500 dark:border-violet-500 scale-105 sm:scale-110"
                  : "bg-white/60 dark:bg-gray-800/60 border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/20"
              }`}
              onClick={() => goToSlide(index)}
            >
              <div className="text-lg sm:text-2xl">{item.icon}</div>
              <div
                className={`text-xs font-semibold mt-1 hidden sm:block ${
                  index === currentIndex
                    ? ""
                    : "text-gray-600 dark:text-gray-400"
                }`}
                style={
                  index === currentIndex
                    ? { color: "var(--event-primary)" }
                    : undefined
                }
              >
                {item.name.split(" ")[0]}
              </div>
            </button>
          ))}
        </div>

        <Card className="mt-6 sm:mt-8 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/25 dark:to-indigo-950/30 border-2 border-violet-200/80 dark:border-indigo-700/60">
          <CardBody className="text-center p-4 sm:p-6">
            <h4
              className="text-lg sm:text-xl font-bold mb-3"
              style={{ color: "var(--event-gradient-from)" }}
            >
              {homeConfig.kit.footerTitulo}
            </h4>
            <p
              className="text-sm sm:text-base font-semibold px-2"
              style={{ color: "var(--event-primary)" }}
            >
              {footerLinha}
            </p>
            <div
              className="text-2xl sm:text-3xl font-bold mt-2"
              style={{ color: "var(--event-primary)" }}
            >
              Tudo por apenas {loading ? "Carregando..." : formatarMoeda(valor)}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
