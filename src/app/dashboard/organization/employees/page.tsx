import { DashboardBreadCrumb } from "@/components/breadcrumb";
import { EmployeesTable } from "@/components/dashboard/organization/employees/employees-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getEmployees } from "@/lib/dashboard/organization/employees/queries";
import { searchParamsSchema } from "@/lib/dashboard/organization/employees/validations";
import { SearchParams } from "@/types";
import React from "react";

const breadcrumbItems = [
  { title: "Organización", link: "/dashboard/organization" },
  { title: "Empleados", link: "/dashboard/organization/employees" },
];

export default function EmployeesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParamsSchema.parse(searchParams);

  const employeesPromise = getEmployees(search);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <DashboardBreadCrumb items={breadcrumbItems} />
      <Heading
        title="Empleados"
        description="Gestionar los empleados de tu organización (Funcionalidades de la tabla auxiliar de empleados)."
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
        <EmployeesTable employeesPromise={employeesPromise} />
      </React.Suspense>
    </div>
  );
}
