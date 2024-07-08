"use client";

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Empleado } from "@/types";
import { UpdateEmployeeSheet } from "./update-employee-sheet";
import { DeleteEmployeeDialog } from "./delete-employees-dialog";

export function getColumns(): ColumnDef<Empleado>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "dni",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="DNI" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("dni")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "apellidos",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Apellidos" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("apellidos")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "nombres",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombres" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("nombres")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "fechaNacimiento",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cumpleaños" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {(row.getValue("fechaNacimiento") as Date).toLocaleDateString()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("email")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "telefono",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Telefono" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("telefono")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "direccion",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dirección" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("direccion")}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();
        const [showUpdateEmployeeSheet, setShowUpdateEmployeeSheet] =
          React.useState(false);
        const [showDeleteEmployeeDialog, setShowDeleteEmployeeDialog] =
          React.useState(false);

        return (
          <>
            <UpdateEmployeeSheet
              open={showUpdateEmployeeSheet}
              onOpenChange={setShowUpdateEmployeeSheet}
              empleado={row.original}
            />
            <DeleteEmployeeDialog
              open={showDeleteEmployeeDialog}
              onOpenChange={setShowDeleteEmployeeDialog}
              empleados={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => setShowUpdateEmployeeSheet(true)}
                >
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteEmployeeDialog(true)}
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
}
