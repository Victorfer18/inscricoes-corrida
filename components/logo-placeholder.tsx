import React from "react";

interface LogoPlaceholderProps {
  width?: number;
  height?: number;
  className?: string;
}

export function LogoPlaceholder({ 
  width = 300, 
  height = 300, 
  className = "" 
}: LogoPlaceholderProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 300"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="150" cy="150" r="140" fill="url(#logoGradient)" opacity="0.1" />
      
      {/* Runner silhouette */}
      <path
        d="M120 80 C130 70, 140 70, 150 80 C160 70, 170 70, 180 80 L180 100 C175 110, 165 115, 150 115 C135 115, 125 110, 120 100 Z"
        fill="url(#logoGradient)"
      />
      
      {/* Body */}
      <ellipse cx="150" cy="140" rx="25" ry="35" fill="url(#logoGradient)" />
      
      {/* Arms */}
      <ellipse cx="125" cy="130" rx="8" ry="20" fill="url(#logoGradient)" transform="rotate(-30 125 130)" />
      <ellipse cx="175" cy="130" rx="8" ry="20" fill="url(#logoGradient)" transform="rotate(30 175 130)" />
      
      {/* Legs */}
      <ellipse cx="140" cy="180" rx="8" ry="25" fill="url(#logoGradient)" transform="rotate(-15 140 180)" />
      <ellipse cx="160" cy="180" rx="8" ry="25" fill="url(#logoGradient)" transform="rotate(15 160 180)" />
      
      {/* Ribbon (Outubro Rosa) */}
      <path
        d="M200 60 C210 50, 220 55, 225 65 C230 75, 225 85, 215 90 C205 95, 195 90, 190 80 C185 70, 190 60, 200 60"
        fill="#ec4899"
      />
      
      {/* Text */}
      <text x="150" y="240" textAnchor="middle" fontSize="16" fontWeight="bold" fill="url(#logoGradient)">
        CORRIDA SOLIDÁRIA
      </text>
      <text x="150" y="260" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ec4899">
        OUTUBRO ROSA
      </text>
      <text x="150" y="280" textAnchor="middle" fontSize="12" fill="url(#logoGradient)">
        PROJETO JAÍBA
      </text>
    </svg>
  );
}
