import { DashboardBreadCrumb } from "@/components/breadcrumb";
import { MovementsTable } from "@/components/dashboard/warehouse/movements/movements-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getMovements} from "@/lib/dashboard/warehouse/movements/queries";
import { searchParamsSchema } from "@/lib/dashboard/warehouse/movements/validations";
import { SearchParams } from "@/types";
import React from "react";

const breadcrumbItems = [
    { title: "Almacén", link: "/dashboard/warehouse" },
    { title: "Historial de Movimientos", link: "/dashboard/warehouse/movements" },
];

export default function MovementsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParamsSchema.parse(searchParams);

  const movementsPromise = getMovements(search);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <DashboardBreadCrumb items={breadcrumbItems} />
      <Heading title="Historial de Movimientos" description="Ver el historial de movimientos (Funcionalidades de la tabla auxiliar de movimientos de producto)." />
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
        <MovementsTable movementsPromise={movementsPromise} />
      </React.Suspense>
    </div>
  );
}
