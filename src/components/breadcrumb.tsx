import { cn } from "@/lib/utils";
import { BreadCrumb } from "@/types";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

export function DashboardBreadCrumb({
  items,
  className,
}: {
  items: BreadCrumb[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
        <Link
          href={"/dashboard"}
          className="overflow-hidden text-ellipsis whitespace-nowrap"
        >
          Dashboard
        </Link>
        {items?.map((item: BreadCrumb, index: number) => (
          <React.Fragment key={item.title}>
            <ChevronRightIcon className="h-4 w-4" />
            <Link
              href={item.link}
              className={cn(
                "font-medium",
                index === items.length - 1
                  ? "pointer-events-none text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
