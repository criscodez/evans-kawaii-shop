"use client";

import React, { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth"

interface ProvidersProps {
  children: ReactNode;
  session: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </SessionProvider>
  );
};