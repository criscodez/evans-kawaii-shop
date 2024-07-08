"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItemWithTitle } from "@/types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useSidebar } from "@/hooks/useSidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";

import { isAuthorized } from "@/lib/auth/roles";

interface DashboardNavProps {
  items: NavItemWithTitle[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  const { data: session } = useSession();
  const path = usePathname();
  const { isMinimized } = useSidebar();

  return (
    <div className="h-full overflow-y-auto">
      {items.filter((a) => {
        return a.items.some((b) => {
          return isAuthorized(b.href || "", session?.user.roles || []);
        });
      }).map((item, index) => {
        return (
          <div key={index}>
            {item.title &&
              (isMobileNav || (!isMinimized && !isMobileNav) ? (
                <h2 className="mt-4 mb-2 px-4 text-lg font-semibold tracking-tight">
                  {item.title}
                </h2>
              ) : (
                ""
              ))}
            <div className="space-y-1 mb-2">
              <nav className="grid items-start gap-2">
                <TooltipProvider>
                  {item.items.map((subItem, index) => {
                    if (!isAuthorized(subItem.href || "", session?.user.roles || [])) {
                      return null;
                    }

                    const Icon = Icons[subItem.icon || "arrowRight"];

                    return (
                      subItem.href && (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <Link
                              href={subItem.disabled ? "/" : subItem.href}
                              className={cn(
                                "flex subItems-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                path === subItem.href
                                  ? "bg-accent"
                                  : "transparent",
                                subItem.disabled &&
                                  "cursor-not-allowed opacity-80"
                              )}
                              onClick={() => {
                                if (setOpen) setOpen(false);
                              }}
                            >
                              <Icon className={`ml-3 size-5`} />

                              {isMobileNav || (!isMinimized && !isMobileNav) ? (
                                <span className="mr-2 truncate">
                                  {subItem.title}
                                </span>
                              ) : (
                                ""
                              )}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            align="center"
                            side="right"
                            sideOffset={8}
                            className={!isMinimized ? "hidden" : "inline-block"}
                          >
                            {item.title ? item.title + " > " : ""}
                            {subItem.title}
                          </TooltipContent>
                        </Tooltip>
                      )
                    );
                  })}
                </TooltipProvider>
              </nav>
            </div>
          </div>
        );
      })}
    </div>
  );
}
