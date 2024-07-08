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
import { Venta } from "@/types";
import { DeleteSaleDialog } from "./delete-sales-dialog";

export function getColumns({ history } : { history: boolean}): ColumnDef<Venta>[] {
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
      accessorKey: "numVenta",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Num. Venta" />
      ),
      //
      cell: ({ row }) => <div className="w-20">{row.getValue("numVenta")}</div>,
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
    ...(history ? [{
      accessorKey: "empleado",
      enableHiding: false,
      // @ts-ignore
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vendedor" />
      ),
      // @ts-ignore
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.original.empleado.nombres}
            </span>
          </div>
        );
      },
    }] : []),
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
      accessorKey: "cliente",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cliente" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.original.cliente ?
                (row.original.cliente.tipo === "PERSONA"
                  ? row.original.cliente.apellidos +
                    " " +
                    row.original.cliente.nombres
                  : row.original.cliente.nombre) : "No asignado"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "comprobante",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("comprobante")}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();
        const [showDeleteSaleDialog, setShowDeleteSaleDialog] =
          React.useState(false);

        return (
          <>
            <DeleteSaleDialog
              open={showDeleteSaleDialog}
              onOpenChange={setShowDeleteSaleDialog}
              ventas={[row.original]}
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
                  onSelect={() => setShowDeleteSaleDialog(true)}
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
