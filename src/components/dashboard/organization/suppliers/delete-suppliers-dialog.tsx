"use client";

import * as React from "react";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Proveedor } from "@/types";
import { deleteSuppliers } from "@/lib/dashboard/organization/suppliers/queries";

interface DeleteSupplierDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  proveedores: Row<Proveedor>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteSupplierDialog({
  proveedores,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteSupplierDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Borrar ({proveedores.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás absolutamente seguro?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente{" "}
            <span className="font-medium">{proveedores.length}</span>
            {proveedores.length === 1 ? " proveedor" : " proveedores"} de la base de
            datos.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            aria-label="Eliminar filas seleccionadas"
            variant="destructive"
            onClick={() => {
              startDeleteTransition(async () => {
                const { error } = await deleteSuppliers({
                  ids: proveedores.map((proveedor) => proveedor.id),
                });

                if (error) {
                  toast.error(error);
                  return;
                }

                props.onOpenChange?.(false);
                toast.success(
                  proveedores.length === 1
                    ? "Proveedor eliminado"
                    : "Proveedores eliminados"
                );
                onSuccess?.();
              });
            }}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Borrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
