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
  const { valor, loading, kitItems } = useLoteVigente();
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando itens do kit...</p>
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
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-2 border-pink-200 dark:border-pink-800 shadow-2xl">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
              <div className="flex justify-center order-1 md:order-none">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl blur-lg opacity-20 animate-pulse" />
                  <div className="relative bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-pink-200/50 dark:border-pink-700/50">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
                      <Image
                        alt={kitItems[currentIndex]?.name || "Item do kit"}
                        className="object-contain w-full h-full"
                        fallbackSrc={`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="%23f3f4f6"/><text x="90" y="110" text-anchor="middle" font-size="60">${kitItems[currentIndex]?.icon || "📦"}</text></svg>`}
                        height={180}
                        src={kitItems[currentIndex]?.image || "/kit/kit-all.png"}
                        width={180}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Item */}
              <div className="text-center md:text-left space-y-3 sm:space-y-4 order-2 md:order-none">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">
                  {kitItems[currentIndex]?.icon || "📦"}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-600 dark:text-pink-400">
                  {kitItems[currentIndex]?.name || "Item do Kit"}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed px-2 md:px-0">
                  {kitItems[currentIndex]?.description || "Descrição não disponível"}
                </p>

                <div className="flex items-center justify-center md:justify-start gap-2 mt-4 sm:mt-6">
                  <span className="text-xs sm:text-sm font-semibold text-pink-600 dark:text-pink-400">
                    {currentIndex + 1} de {kitItems.length}
                  </span>
                  <div className="flex gap-1">
                    {kitItems.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "bg-pink-500 w-4 sm:w-6"
                            : "bg-pink-200 dark:bg-pink-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            isIconOnly
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-pink-200 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 z-10"
            size="sm"
            variant="flat"
            onPress={prevSlide}
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
          </Button>

          <Button
            isIconOnly
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-pink-200 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20 z-10"
            size="sm"
            variant="flat"
            onPress={nextSlide}
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 px-2">
          {kitItems.map((item, index) => (
            <button
              key={item.id}
              className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 border-2 ${
                index === currentIndex
                  ? "bg-pink-100 dark:bg-pink-900/30 border-pink-400 dark:border-pink-600 scale-105 sm:scale-110"
                  : "bg-white/60 dark:bg-gray-800/60 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20"
              }`}
              onClick={() => goToSlide(index)}
            >
              <div className="text-lg sm:text-2xl">{item.icon}</div>
              <div
                className={`text-xs font-semibold mt-1 hidden sm:block ${
                  index === currentIndex
                    ? "text-pink-600 dark:text-pink-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {item.name.split(" ")[0]}
              </div>
            </button>
          ))}
        </div>

        {/* Resumo do Kit */}
        <Card className="mt-6 sm:mt-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700">
          <CardBody className="text-center p-4 sm:p-6">
            <h4 className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-300 mb-3">
              🎁 Kit Completo Incluso na Inscrição
            </h4>
            <p className="text-sm sm:text-base text-green-600 dark:text-green-400 font-semibold px-2">
              Todos os {kitItems.length} itens acima + hidratação durante o
              percurso + apoio médico
            </p>
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
              Tudo por apenas {loading ? "Carregando..." : formatarMoeda(valor)}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
