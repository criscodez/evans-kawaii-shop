"use client";

import * as React from "react";
import type { MovimientoProducto, DataTableFilterField } from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getColumns } from "./movements-table-columns";
import { useDataTable } from "@/hooks/useDataTable";
import { getMovements } from "@/lib/dashboard/warehouse/movements/queries";

export function MovementsTable({
  movementsPromise,
}: {
  movementsPromise: ReturnType<typeof getMovements>;
}) {
  const { data, pageCount } = React.use(movementsPromise);

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<MovimientoProducto>[] = [];

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
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
}
