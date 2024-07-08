"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Cliente } from "@/types";
import { exportTableToCSV } from "@/lib/export";
import { CreatePersonDialog } from "./persons/create-person-dialog";
import { CreateCompanyDialog } from "./companies/create-company-dialog";
import { DeleteCustomerDialog } from "./delete-customers-dialog";

export function CustomersTableToolbarActions({
  table,
  type,
}: {
  table: Table<Cliente>,
  type: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteCustomerDialog
          clientes={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      {type === "PERSONA" ? (<CreatePersonDialog/>) : <CreateCompanyDialog/>}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "clientes",
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
