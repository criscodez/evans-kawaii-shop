"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { MovimientoProducto } from "@/types";

export function getColumns(): ColumnDef<MovimientoProducto>[] {
  return [
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
        accessorKey: "descripcion",
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Descripcion" />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <span className="max-w-[31.25rem] truncate font-medium">
                {row.getValue("descripcion")}
              </span>
            </div>
          );
        },
      },
    {
      accessorKey: "tipo",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
                {row.getValue("tipo")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "stockAnterior",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock Anterior" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
                {row.getValue("stockAnterior")}
            </span>
          </div>
        );
      },
    },
    {
        accessorKey: "stockNuevo",
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Stock Nuevo" />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <span className="max-w-[31.25rem] truncate font-medium">
                  {row.getValue("stockNuevo")}
              </span>
            </div>
          );
        },
      },
    {
      accessorKey: "producto",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Producto" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.original.producto.id} - {row.original.producto.nombre}
            </span>
          </div>
        );
      },
    },
  ];
}
