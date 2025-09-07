"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { useDisclosure } from "@heroui/modal";

interface KitItem {
  id: string;
  name: string;
  description: string;
  image: string;
  fallbackImage?: string;
  icon: string;
}

const kitItems: KitItem[] = [
  {
    id: "camiseta",
    name: "Camiseta Oficial",
    description: "Camiseta exclusiva do evento com design Outubro Rosa",
    image: "/kit/barra.png",
    fallbackImage: "/kit/barra.png",
    icon: "🎽"
  },
  {
    id: "medalha",
    name: "Medalha de Participação",
    description: "Medalha comemorativa para todos os participantes",
    image: "/kit/medalha.png",
    fallbackImage: "/kit/medalha.png",
    icon: "🏅"
  }
];

interface KitShowcaseProps {
  showTitle?: boolean;
  layout?: "grid" | "horizontal";
  size?: "small" | "medium" | "large";
}

export function KitShowcase({ 
  showTitle = true, 
  layout = "grid",
  size = "medium" 
}: KitShowcaseProps) {
  const [selectedItem, setSelectedItem] = useState<KitItem | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleItemClick = (item: KitItem) => {
    setSelectedItem(item);
    onOpen();
  };

  const getImageSize = () => {
    switch (size) {
      case "small": return { width: 120, height: 120 };
      case "large": return { width: 200, height: 200 };
      default: return { width: 150, height: 150 };
    }
  };

  const { width, height } = getImageSize();

  return (
    <>
      <div className="w-full">
        {showTitle && (
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">
              🎁 O que você recebe
            </h3>
            <p className="text-default-600">
              Kit completo de participação incluso na inscrição
            </p>
          </div>
        )}

        <div className={`
          ${layout === "grid" 
            ? "grid grid-cols-1 md:grid-cols-3 gap-6" 
            : "flex flex-wrap justify-center gap-4"
          }
        `}>
          {kitItems.map((item) => (
            <Card 
              key={item.id}
              className="cursor-pointer hover:scale-105 transition-transform duration-200 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-pink-200 dark:border-pink-800"
              onPress={() => handleItemClick(item)}
            >
              <CardBody className="text-center p-4">
                <div className="flex justify-center mb-3">
                  <KitItemImage 
                    item={item} 
                    width={width} 
                    height={height}
                  />
                </div>
                <h4 className="font-semibold text-lg mb-1">{item.name}</h4>
                <p className="text-small text-default-600">{item.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Kit Completo (se existir imagem) */}
        <div className="mt-8 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-2 border-pink-300 dark:border-pink-700">
            <CardBody className="p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-4xl">📦</div>
                <div>
                  <h4 className="font-bold text-xl">Kit Completo</h4>
                  <p className="text-small text-default-600">
                    Todos os itens organizados em embalagem especial
                  </p>
                </div>
              </div>
              <KitCompleteImage />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal para visualização ampliada */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedItem?.icon}</span>
              <span>{selectedItem?.name}</span>
            </div>
          </ModalHeader>
          <ModalBody className="p-6">
            {selectedItem && (
              <div className="text-center">
                <KitItemImage 
                  item={selectedItem} 
                  width={300} 
                  height={300}
                />
                <div className="mt-4">
                  <p className="text-default-600">{selectedItem.description}</p>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

// Componente para imagem individual do kit
function KitItemImage({ item, width, height }: { item: KitItem; width: number; height: number }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div 
        className="flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-800 dark:to-purple-800 rounded-lg border-2 border-dashed border-pink-300 dark:border-pink-600"
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">{item.icon}</div>
          <div className="text-sm font-semibold text-pink-700 dark:text-pink-300">
            {item.name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={item.image}
      alt={item.name}
      width={width}
      height={height}
      className="rounded-lg object-cover"
      fallbackSrc={item.fallbackImage}
      onError={handleImageError}
    />
  );
}

// Componente para imagem do kit completo
function KitCompleteImage() {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-800 dark:to-purple-800 rounded-xl border-2 border-dashed border-pink-300 dark:border-pink-600 h-48 w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="text-4xl mb-2">📦</div>
          <div className="text-lg font-semibold text-pink-700 dark:text-pink-300 mb-1">
            Kit Completo
          </div>
          <div className="text-sm text-pink-600 dark:text-pink-400">
            Camiseta + Medalha + Número + Extras
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-md mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl blur-sm opacity-20"></div>
      <div className="relative bg-white/90 dark:bg-gray-800/90 p-2 rounded-xl shadow-lg">
        <Image
          src="/kit/kit-all.png"
          alt="Kit Completo de Participação - Camiseta Rosa, Medalha e Extras"
          width={400}
          height={250}
          className="rounded-lg object-contain w-full h-auto"
          fallbackSrc="/kit/kit-all.png"
          onError={handleImageError}
        />
      </div>
    </div>
  );
}
