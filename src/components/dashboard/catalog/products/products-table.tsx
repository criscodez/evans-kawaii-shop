"use client";

import * as React from "react";
import type { DataTableFilterField, Producto } from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getColumns } from "./products-table-columns";
import { useDataTable } from "@/hooks/useDataTable";
import { ProductsTableFloatingBar } from "./products-table-floating-bar";
import { ProductsTableToolbarActions } from "./products-table-toolbar-actions";
import { getProducts } from "@/lib/dashboard/catalog/products/queries";
import { EstadoInventario } from "@prisma/client";
import { getProductStatusIcon } from "@/lib/utils";

export function ProductsTable({
  productsPromise,
}: {
  productsPromise: ReturnType<typeof getProducts>;
}) {
  const { data, pageCount } = React.use(productsPromise);

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<Producto>[] = [
    {
      label: "Nombre",
      value: "nombre",
      placeholder: "Filtrar por nombre...",
    },
    {
      label: "Estado",
      value: "estado",
      options: Object.values(EstadoInventario).map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        icon: getProductStatusIcon(status),
        withCount: true,
      })),
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
      floatingBar={<ProductsTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ProductsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
