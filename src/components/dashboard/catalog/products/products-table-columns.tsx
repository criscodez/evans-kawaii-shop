"use client";

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Producto } from "@/types";
import { UpdateProductSheet } from "./update-product-sheet";
import { EstadoInventario } from "@prisma/client";
import { getProductStatusIcon } from "@/lib/utils";
import { DeleteProductDialog } from "./delete-products-dialog";

export function getColumns(): ColumnDef<Producto>[] {
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
      accessorKey: "nombre",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Producto" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("nombre")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "categoria.nombre",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoria" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.original.categoria.nombre}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "costo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Costo" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              S/{row.getValue("costo")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "utilidad",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Utilidad" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              S/{row.getValue("utilidad")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "precio",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Precio" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              S/{row.getValue("precio")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "stockTotal",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("stockTotal")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "estado",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => {
        const status = Object.values(EstadoInventario).find(
          (status) => status === row.original.estado
        )

        if (!status) return null

        const Icon = getProductStatusIcon(status)

        return (
          <Badge variant="secondary" className="ml-auto sm:ml-0">
            <Icon
              className="mr-2 size-4"
              aria-hidden="true"
            />
          {status}
        </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const [showUpdateProductSheet, setShowUpdateProductSheet] = React.useState(false);
        const [showDeleteProductDialog, setShowDeleteProductDialog] = React.useState(false)

        return (
          <>
            <UpdateProductSheet
              open={showUpdateProductSheet}
              onOpenChange={setShowUpdateProductSheet}
              producto={row.original}
            />
            <DeleteProductDialog
              open={showDeleteProductDialog}
              onOpenChange={setShowDeleteProductDialog}
              products={[row.original]}
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
                <DropdownMenuItem onClick={() => setShowUpdateProductSheet(true)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteProductDialog(true)}
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ];
}
