"use client";

import * as React from "react";
import type { User, DataTableFilterField } from "@/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getColumns } from "./users-table-columns";
import { useDataTable } from "@/hooks/useDataTable";
import { UsersTableFloatingBar } from "./users-table-floating-bar";
import { UsersTableToolbarActions } from "./users-table-toolbar-actions";
import { getUsers } from "@/lib/dashboard/organization/users/queries";

export function UsersTable({
  usersPromise,
}: {
  usersPromise: ReturnType<typeof getUsers>;
}) {
  const { data, pageCount } = React.use(usersPromise);

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<User>[] = [
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
      floatingBar={<UsersTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <UsersTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
