"use client";

import { useState } from "react";
import { Image } from "@heroui/image";

import { LogoPlaceholder } from "./logo-placeholder";

interface EventLogoProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: "rosa" | "branca" | "auto";
  imageUrl?: string | null;
  alt?: string;
}

export function EventLogo({
  width = 300,
  height = 300,
  className = "",
  variant = "rosa",
  imageUrl,
  alt = "Logo do Evento - Corrida Solidária Outubro Rosa",
}: EventLogoProps) {
  const [customFailed, setCustomFailed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  if (imageUrl && !customFailed) {
    return (
      <Image
        alt={alt}
        className={className}
        height={height}
        src={imageUrl}
        width={width}
        onError={() => setCustomFailed(true)}
      />
    );
  }

  if (imageError && fallbackError) {
    return (
      <LogoPlaceholder className={className} height={height} width={width} />
    );
  }

  if (imageError) {
    const fallbackSrc =
      variant === "rosa" ? "/logo-branca.png" : "/logo-rosa.png";

    return (
      <Image
        alt={alt}
        className={className}
        height={height}
        src={fallbackSrc}
        width={width}
        onError={() => setFallbackError(true)}
      />
    );
  }

  const primarySrc = variant === "rosa" ? "/logo-rosa.png" : "/logo-branca.png";

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      src={primarySrc}
      width={width}
      onError={() => setImageError(true)}
    />
  );
}
