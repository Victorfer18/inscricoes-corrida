"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface KitItem {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
}

const kitItems: KitItem[] = [
  {
    id: "camiseta",
    name: "Camiseta Oficial",
    description: "Camiseta exclusiva do evento com design Outubro Rosa em tecido dry-fit de alta qualidade",
    image: "/kit/camiseta.png",
    icon: "👕"
  },
  {
    id: "medalha",
    name: "Medalha de Participação",
    description: "Medalha comemorativa personalizada para todos os participantes da corrida",
    image: "/kit/medalha.png",
    icon: "🏅"
  },
  {
    id: "bolsa",
    name: "Bolsa Esportiva",
    description: "Bolsa prática e resistente para carregar seus pertences durante o evento",
    image: "/kit/bolsa.png",
    icon: "🎒"
  },
  {
    id: "garrafa",
    name: "Garrafa de Água",
    description: "Garrafa reutilizável com logo do evento para hidratação durante a corrida",
    image: "/kit/garrafa.png",
    icon: "💧"
  },
  {
    id: "barra",
    name: "Barra Energética",
    description: "Barra nutritiva para dar energia antes ou depois da corrida",
    image: "/kit/barra.png",
    icon: "🍫"
  }
];

export function KitSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % kitItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % kitItems.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + kitItems.length) % kitItems.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="relative">
        {/* Slide Principal */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-2 border-pink-200 dark:border-pink-800 shadow-2xl">
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Imagem do Item */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
                  <div className="relative bg-white/90 dark:bg-gray-800/90 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-pink-200/50 dark:border-pink-700/50">
                    <div className="w-48 h-48 flex items-center justify-center">
                      <Image
                        src={kitItems[currentIndex].image}
                        alt={kitItems[currentIndex].name}
                        width={180}
                        height={180}
                        className="object-contain"
                        fallbackSrc={`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="%23f3f4f6"/><text x="90" y="110" text-anchor="middle" font-size="60">${kitItems[currentIndex].icon}</text></svg>`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Item */}
              <div className="text-center md:text-left space-y-4">
                <div className="text-6xl mb-4">{kitItems[currentIndex].icon}</div>
                <h3 className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                  {kitItems[currentIndex].name}
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {kitItems[currentIndex].description}
                </p>
                
                {/* Indicador de Item */}
                <div className="flex items-center justify-center md:justify-start gap-2 mt-6">
                  <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                    {currentIndex + 1} de {kitItems.length}
                  </span>
                  <div className="flex gap-1">
                    {kitItems.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-pink-500 w-6' 
                            : 'bg-pink-200 dark:bg-pink-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Navegação */}
          <Button
            isIconOnly
            variant="flat"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-pink-200 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20"
            onPress={prevSlide}
          >
            <ChevronLeftIcon className="w-5 h-5 text-pink-600" />
          </Button>

          <Button
            isIconOnly
            variant="flat"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-pink-200 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20"
            onPress={nextSlide}
          >
            <ChevronRightIcon className="w-5 h-5 text-pink-600" />
          </Button>
        </div>

        {/* Indicadores de Slide */}
        <div className="flex justify-center gap-3 mt-6">
          {kitItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              className={`p-3 rounded-xl transition-all duration-300 border-2 ${
                index === currentIndex
                  ? 'bg-pink-100 dark:bg-pink-900/30 border-pink-400 dark:border-pink-600 scale-110'
                  : 'bg-white/60 dark:bg-gray-800/60 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20'
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <div className={`text-xs font-semibold mt-1 ${
                index === currentIndex 
                  ? 'text-pink-600 dark:text-pink-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {item.name.split(' ')[0]}
              </div>
            </button>
          ))}
        </div>

        {/* Resumo do Kit */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700">
          <CardBody className="text-center p-6">
            <h4 className="text-xl font-bold text-green-700 dark:text-green-300 mb-3">
              🎁 Kit Completo Incluso na Inscrição
            </h4>
            <p className="text-green-600 dark:text-green-400 font-semibold">
              Todos os {kitItems.length} itens acima + hidratação durante o percurso + apoio médico
            </p>
            <div className="text-3xl font-bold text-green-600 mt-2">
              Tudo por apenas R$ 25,00
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
