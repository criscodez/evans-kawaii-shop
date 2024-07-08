import { DashboardBreadCrumb } from "@/components/breadcrumb";
import { PurchasesTable } from "@/components/dashboard/warehouse/purchases/purchases-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getPurchases } from "@/lib/dashboard/warehouse/purchases/queries";
import { searchParamsSchema } from "@/lib/dashboard/warehouse/purchases/validations";
import { SearchParams } from "@/types";
import React from "react";

const breadcrumbItems = [
    { title: "Almacén", link: "/dashboard/warehouse" },
    { title: "Ordenes de Compra", link: "/dashboard/warehouse/purchases" },
];

export default function PurchasesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParamsSchema.parse(searchParams);

  const purchasesPromise = getPurchases(search);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <DashboardBreadCrumb items={breadcrumbItems} />
      <Heading title="Ordenes de Compra" description="Gestionar las Ordenes de Compra (Funcionalidades de la tabla auxiliar de compras)." />
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
        <PurchasesTable purchasesPromise={purchasesPromise} />
      </React.Suspense>
    </div>
  );
}
