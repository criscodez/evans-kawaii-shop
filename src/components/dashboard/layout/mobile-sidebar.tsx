"use client";

import { DashboardNav } from "@/components/dashboard/layout/dashboard-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/config/dashboard";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4 h-full overflow-y-auto scrollbar-hidden">
            <div className="px-3 py-2">
              <DashboardNav
                items={navItems}
                isMobileNav={true}
                setOpen={setOpen}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
