"use client";

import { useState } from "react";
import { Image } from "@heroui/image";
import { LogoPlaceholder } from "./logo-placeholder";

interface EventLogoProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: "rosa" | "branca" | "auto";
}

export function EventLogo({ 
  width = 300, 
  height = 300, 
  className = "",
  variant = "rosa" 
}: EventLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFallbackError = () => {
    setFallbackError(true);
  };

  // Se ambas as imagens falharam, mostrar placeholder
  if (imageError && fallbackError) {
    return (
      <LogoPlaceholder 
        width={width} 
        height={height} 
        className={className}
      />
    );
  }

  // Se a imagem principal falhou, tentar a alternativa
  if (imageError) {
    const fallbackSrc = variant === "rosa" ? "/logo-branca.png" : "/logo-rosa.png";
    
    return (
      <Image
        src={fallbackSrc}
        alt="Logo do Evento - Corrida Solidária Outubro Rosa"
        width={width}
        height={height}
        className={className}
        onError={handleFallbackError}
      />
    );
  }

  // Tentar carregar a imagem principal
  const primarySrc = variant === "rosa" ? "/logo-rosa.png" : "/logo-branca.png";
  
  return (
    <Image
      src={primarySrc}
      alt="Logo do Evento - Corrida Solidária Outubro Rosa"
      width={width}
      height={height}
      className={className}
      onError={handleImageError}
    />
  );
}
