"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Producto } from "@/types";
import { exportTableToCSV } from "@/lib/export";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { DeleteProductDialog } from "./delete-products-dialog";

export function ProductsTableToolbarActions({
  table,
}: {
  table: Table<Producto>;
}) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteProductDialog
          products={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Link href={`/dashboard/catalog/products/new`}>
        <Button variant="default" size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          Nuevo producto
        </Button>
      </Link>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "productos",
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
