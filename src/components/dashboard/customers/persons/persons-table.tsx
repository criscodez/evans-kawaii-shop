"use client";

import * as React from "react";
import type { Cliente, DataTableFilterField } from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getColumns } from "./persons-table-columns";
import { useDataTable } from "@/hooks/useDataTable";
import { CustomersTableFloatingBar } from "../customers-table-floating-bar";
import { CustomersTableToolbarActions } from "../customers-table-toolbar-actions";
import { getPersons } from "@/lib/dashboard/customers/persons/queries";

export function PersonsTable({
  personsPromise,
}: {
  personsPromise: ReturnType<typeof getPersons>;
}) {
  const { data, pageCount } = React.use(personsPromise);

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<Cliente>[] = [
    {
      label: "Nombres",
      value: "nombres",
      placeholder: "Filtrar por nombres...",
    },
    {
      label: "Apellidos",
      value: "apellidos",
      placeholder: "Filtrar por apellidos...",
    },
    {
      label: "DNI",
      value: "dni",
      placeholder: "Filtrar por dni...",
    },
  ];

  const { table } = useDataTable({
    // @ts-ignore
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
      floatingBar={<CustomersTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CustomersTableToolbarActions table={table} type="PERSONA" />
      </DataTableToolbar>
    </DataTable>
  );
}
