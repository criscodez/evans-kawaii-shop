"use client";

import * as React from "react";
import type { Cliente, DataTableFilterField } from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getColumns } from "./companies-table-columns";
import { useDataTable } from "@/hooks/useDataTable";
import { CustomersTableFloatingBar } from "../customers-table-floating-bar";
import { CustomersTableToolbarActions } from "../customers-table-toolbar-actions";
import { getCompanies } from "@/lib/dashboard/customers/companies/queries";

export function CompaniesTable({
  companiesPromise,
}: {
  companiesPromise: ReturnType<typeof getCompanies>;
}) {
  const { data, pageCount } = React.use(companiesPromise);

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<Cliente>[] = [
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
        <CustomersTableToolbarActions table={table} type="EMPRESA" />
      </DataTableToolbar>
    </DataTable>
  );
}
