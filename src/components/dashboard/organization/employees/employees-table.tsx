"use client";

import * as React from "react";
import type { Empleado, DataTableFilterField } from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getColumns } from "./employees-table-columns";
import { useDataTable } from "@/hooks/useDataTable";
import { EmployeesTableFloatingBar } from "./employees-table-floating-bar";
import { EmployeesTableToolbarActions } from "./employees-table-toolbar-actions";
import { getEmployees } from "@/lib/dashboard/organization/employees/queries";

export function EmployeesTable({
  employeesPromise,
}: {
  employeesPromise: ReturnType<typeof getEmployees>;
}) {
  const { data, pageCount } = React.use(employeesPromise);

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<Empleado>[] = [
    {
        label: "Nombres",
        value: "nombres",
        placeholder: "Filtrar por nombres...",
      },
      {
        label: "Apellidos",
        value: "apellidos",
        placeholder: "Filtrar por apellidos...",
      },
      {
        label: "DNI",
        value: "dni",
        placeholder: "Filtrar por dni...",
      },
    ];

  const { table } = useDataTable({
    // @ts-ignore
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
      floatingBar={<EmployeesTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <EmployeesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
