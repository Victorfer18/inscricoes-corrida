"use client";

import { ReactNode } from "react";

interface BackgroundWrapperProps {
  children: ReactNode;
  intensity?: "light" | "medium" | "strong" | "ultra";
  showAnimation?: boolean;
  className?: string;
}

export function BackgroundWrapper({
  children,
  intensity = "medium",
  showAnimation = true,
  className = "",
}: BackgroundWrapperProps) {
  const getWhiteOverlayIntensity = () => {
    switch (intensity) {
      case "light":
        return "bg-white/70 dark:bg-gray-900/70";
      case "medium":
        return "bg-white/80 dark:bg-gray-900/80";
      case "strong":
        return "bg-white/85 dark:bg-gray-900/85";
      case "ultra":
        return "bg-white/90 dark:bg-gray-900/90";
      default:
        return "bg-white/80 dark:bg-gray-900/80";
    }
  };

  const whiteOverlay = getWhiteOverlayIntensity();

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${className}`}>
      {/* Background Image */}
      <div
        className={`fixed inset-0 z-0 blur-sm overflow-hidden`}
        style={{
          backgroundImage: "url('/imagens/pessoas-correndo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(1.1) contrast(1.1) saturate(1.2)",
        }}
      />

      {/* White Blur Overlay System */}
      <div className="fixed inset-0 z-1 overflow-hidden">
        {/* Principal White Blur Overlay */}
        <div className={`absolute inset-0 ${whiteOverlay} backdrop-blur-md`} />

        {/* Subtle Color Tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/20 via-transparent to-purple-50/20 dark:from-pink-900/10 dark:via-transparent dark:to-purple-900/10" />

        {/* Soft Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-gray-200/30 dark:to-gray-700/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 overflow-x-hidden">{children}</div>
    </div>
  );
}
