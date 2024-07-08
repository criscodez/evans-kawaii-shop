import { DashboardBreadCrumb } from "@/components/breadcrumb";
import { PersonsTable } from "@/components/dashboard/customers/persons/persons-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getPersons } from "@/lib/dashboard/customers/persons/queries";
import { searchParamsSchema } from "@/lib/dashboard/customers/persons/validations";
import { SearchParams } from "@/types";
import React from "react";

const breadcrumbItems = [
  { title: "Clientes", link: "/dashboard/customers" },
  { title: "Personas", link: "/dashboard/customers/persons" },
];

export default function PersonsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParamsSchema.parse(searchParams);

  const personsPromise = getPersons(search);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <DashboardBreadCrumb items={breadcrumbItems} />
      <Heading
        title="Personas"
        description="Gestionar clientes del tipo persona (Funcionalidades de la tabla auxiliar de clientes)."
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
        <PersonsTable personsPromise={personsPromise} />
      </React.Suspense>
    </div>
  );
}
