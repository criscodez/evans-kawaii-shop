"use client";

import * as React from "react";
import type { Categoria, DataTableFilterField } from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getColumns } from "./categories-table-columns";
import { useDataTable } from "@/hooks/useDataTable";
import { CategoriesTableFloatingBar } from "./categories-table-floating-bar";
import { CategoriesTableToolbarActions } from "./categories-table-toolbar-actions";
import { getCategories } from "@/lib/dashboard/catalog/categories/queries";

export function CategoriesTable({
  categoriesPromise,
}: {
  categoriesPromise: ReturnType<typeof getCategories>;
}) {
  const { data, pageCount } = React.use(categoriesPromise);

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<Categoria>[] = [
    {
      label: "Nombre",
      value: "nombre",
      placeholder: "Filtrar por nombre...",
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
      floatingBar={<CategoriesTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <CategoriesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
