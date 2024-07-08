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
import { OrdenCompra } from "@/types";

export function getColumns(): ColumnDef<OrdenCompra>[] {
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
      accessorKey: "fecha",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {(row.getValue("fecha") as Date).toLocaleDateString()}
            </span>
          </div>
        );
      },
    },
    {
        accessorKey: "empleado",
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Empleado" />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <span className="max-w-[31.25rem] truncate font-medium">
              {row.original.empleado.apellidos}, {row.original.empleado.nombres}
              </span>
            </div>
          );
        },
      },
    {
      accessorKey: "total",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              S/. {row.getValue("total")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "IGV",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="IGV" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              S/. {row.getValue("IGV")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "proveedor",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Proveedor" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.original.proveedor.nombre}
            </span>
          </div>
        );
      },
    },
  ];
}
