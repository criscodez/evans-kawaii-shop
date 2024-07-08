"use client";

import * as React from "react";
import type { Venta, DataTableFilterField } from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getColumns } from "./sales-table-columns";
import { useDataTable } from "@/hooks/useDataTable";
import { SalesTableFloatingBar } from "./sales-table-floating-bar";
import { SalesTableToolbarActions } from "./sales-table-toolbar-actions";
import { getSales } from "@/lib/dashboard/transactions/sales/queries";

export function SalesTable({
  salesPromise,
  history = false,
}: {
  salesPromise: ReturnType<typeof getSales>,
  history?: boolean
}) {
  const { data, pageCount } = React.use(salesPromise);

  const columns = React.useMemo(() => getColumns({ history: history}), []);

  const filterFields: DataTableFilterField<Venta>[] = [
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
      floatingBar={<SalesTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <SalesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
