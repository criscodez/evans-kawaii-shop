"use client";

import * as React from "react";
import type { Proveedor, DataTableFilterField } from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getColumns } from "./suppliers-table-columns";
import { useDataTable } from "@/hooks/useDataTable";
import { SuppliersTableFloatingBar } from "./suppliers-table-floating-bar";
import { SuppliersTableToolbarActions } from "./suppliers-table-toolbar-actions";
import { getSuppliers } from "@/lib/dashboard/organization/suppliers/queries";

export function SuppliersTable({
  suppliersPromise,
}: {
  suppliersPromise: ReturnType<typeof getSuppliers>;
}) {
  const { data, pageCount } = React.use(suppliersPromise);

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<Proveedor>[] = [
    {
        label: "Nombre",
        value: "nombre",
        placeholder: "Filtrar por nombre...",
      },
      {
        label: "RUC",
        value: "ruc",
        placeholder: "Filtrar por ruc...",
      },
    ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    // optional props
    filterFields,
    enableAdvancedFilter: false,
    defaultPerPage: 10,
    defaultSort: "createdAt.desc",
  });

  return (
    <DataTable
      table={table}
      floatingBar={<SuppliersTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <SuppliersTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
