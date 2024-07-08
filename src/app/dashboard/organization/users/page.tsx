import { DashboardBreadCrumb } from "@/components/breadcrumb";
import { UsersTable } from "@/components/dashboard/organization/users/users-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getUsers } from "@/lib/dashboard/organization/users/queries";
import { searchParamsSchema } from "@/lib/dashboard/organization/users/validations";
import { SearchParams } from "@/types";
import React from "react";

const breadcrumbItems = [
  { title: "Organización", link: "/dashboard/organization" },
  { title: "Usuarios", link: "/dashboard/organization/users" },
];

export default function UsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParamsSchema.parse(searchParams);

  const usersPromise = getUsers(search);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <DashboardBreadCrumb items={breadcrumbItems} />
      <Heading
        title="Usuarios"
        description="Gestionar los usuarios de tu organización (Funcionalidades de la tabla auxiliar de usuarios)."
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
        <UsersTable usersPromise={usersPromise} />
      </React.Suspense>
    </div>
  );
}
