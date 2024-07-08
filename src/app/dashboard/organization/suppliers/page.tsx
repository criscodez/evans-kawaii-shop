import { DashboardBreadCrumb } from "@/components/breadcrumb";
import { SuppliersTable } from "@/components/dashboard/organization/suppliers/suppliers-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getSuppliers } from "@/lib/dashboard/organization/suppliers/queries";
import { searchParamsSchema } from "@/lib/dashboard/organization/suppliers/validations";
import { SearchParams } from "@/types";
import React from "react";

const breadcrumbItems = [
  { title: "Organización", link: "/dashboard/organization" },
  { title: "Proveedores", link: "/dashboard/organization/suppliers" },
];

export default function SuppliersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParamsSchema.parse(searchParams);

  const suppliersPromise = getSuppliers(search);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <DashboardBreadCrumb items={breadcrumbItems} />
      <Heading
        title="Proveedores"
        description="Gestionar los proveedores de tu organización (Funcionalidades de la tabla auxiliar de proveedores)."
      />
      <Separator />
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            searchableColumnCount={3}
            shrinkZero
          />
        }
      >
        <SuppliersTable suppliersPromise={suppliersPromise} />
      </React.Suspense>
    </div>
  );
}