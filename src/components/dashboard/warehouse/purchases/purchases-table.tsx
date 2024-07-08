"use client";

import * as React from "react";
import type { OrdenCompra, DataTableFilterField } from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getColumns } from "./purchases-table-columns";
import { useDataTable } from "@/hooks/useDataTable";
import { PurchasesTableFloatingBar } from "./purchases-table-floating-bar";
import { PurchasesTableToolbarActions } from "./purchases-table-toolbar-actions";
import { getPurchases } from "@/lib/dashboard/warehouse/purchases/queries";

export function PurchasesTable({
  purchasesPromise,
}: {
  purchasesPromise: ReturnType<typeof getPurchases>
}) {
  const { data, pageCount } = React.use(purchasesPromise);

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<OrdenCompra>[] = [
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
      floatingBar={<PurchasesTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <PurchasesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
