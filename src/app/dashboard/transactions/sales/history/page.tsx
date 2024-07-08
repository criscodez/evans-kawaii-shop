import { DashboardBreadCrumb } from "@/components/breadcrumb";
import { SalesTable } from "@/components/dashboard/transactions/sales/sales-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getSales } from "@/lib/dashboard/transactions/sales/queries";
import { searchParamsSchema } from "@/lib/dashboard/transactions/sales/validations";
import { SearchParams } from "@/types";
import React from "react";

const breadcrumbItems = [
    { title: "Transacciones", link: "/dashboard/transactions" },
    { title: "Historial de Ventas", link: "/dashboard/transactions/sales/history" },
];

export default function SalesHistoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParamsSchema.parse(searchParams);

  const salesPromise = getSales(search);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <DashboardBreadCrumb items={breadcrumbItems} />
      <Heading title="Historial de Ventas" description="Gestionar las ventas (Funcionalidades de la tabla auxiliar de ventas)." />
      <Separator />
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={1}
            filterableColumnCount={1}
            shrinkZero
          />
        }
      >
        <SalesTable history salesPromise={salesPromise} />
      </React.Suspense>
    </div>
  );
}
