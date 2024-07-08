import { DashboardBreadCrumb } from "@/components/breadcrumb";
import { CompaniesTable } from "@/components/dashboard/customers/companies/companies-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getCompanies } from "@/lib/dashboard/customers/companies/queries";
import { searchParamsSchema } from "@/lib/dashboard/customers/companies/validations";
import { SearchParams } from "@/types";
import React from "react";

const breadcrumbItems = [
  { title: "Clientes", link: "/dashboard/customers" },
  { title: "Empresas", link: "/dashboard/customers/companies" },
];

export default function CompaniesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParamsSchema.parse(searchParams);

  const companiesPromise = getCompanies(search);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <DashboardBreadCrumb items={breadcrumbItems} />
      <Heading
        title="Empresas"
        description="Gestionar clientes del tipo empresa (Funcionalidades de la tabla auxiliar de clientes)."
      />
      <Separator />
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={2}
            shrinkZero
          />
        }
      >
        <CompaniesTable companiesPromise={companiesPromise} />
      </React.Suspense>
    </div>
  );
}
