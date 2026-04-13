"use client";

import type { ReactNode } from "react";

import { Navbar } from "@/components/navbar";
import { EventoPublicProvider } from "@/context/evento-public-context";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <EventoPublicProvider>
      <div className="relative flex flex-col h-screen overflow-x-hidden">
        <Navbar />
        <main className="container mx-auto max-w-7xl pt-16 px-4 sm:px-6 flex-grow overflow-x-hidden">
          {children}
        </main>
      </div>
    </EventoPublicProvider>
  );
}
