"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { OrdenCompra } from "@/types";
import { exportTableToCSV } from "@/lib/export";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function PurchasesTableToolbarActions({ table }: { table: Table<OrdenCompra> }) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/dashboard/warehouse/purchases/new`}>
        <Button variant="default" size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          Nueva orden de compra
        </Button>
      </Link>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "ordenes-de-compra",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Exportar
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
