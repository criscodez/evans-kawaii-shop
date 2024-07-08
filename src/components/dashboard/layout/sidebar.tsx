"use client";

import React, { useState } from "react";
import { DashboardNav } from "@/components/dashboard/layout/dashboard-nav";
import { navItems } from "@/config/dashboard";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import Image from "next/image";

export default function Sidebar({ className }: { className?: string }) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  return (
    <nav
      className={cn(
        `relative hidden h-screen flex-none border-r pt-[4rem] md:block`,
        status && "duration-500",
        !isMinimized ? "w-72" : "w-[72px]",
        className
      )}
    >
      <ChevronLeft
        className={cn(
          "absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4 h-full overflow-y-auto scrollbar-hidden">
      <div className="flex items-center justify-center">
          <Image alt="evanskawaiishop logo" src="/evanskawaiishop.png" width={200} height={50} />
        </div>
        <div className="px-3 py-2">
          <DashboardNav items={navItems} />
        </div>
      </div>
    </nav>
  );
}
