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
import { Venta } from "@/types";
import { deleteSales } from "@/lib/dashboard/transactions/sales/queries";

interface DeleteSaleDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  ventas: Row<Venta>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteSaleDialog({
  ventas,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteSaleDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Borrar ({ventas.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás absolutamente seguro?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente{" "}
            <span className="font-medium">{ventas.length}</span>
            {ventas.length === 1 ? " venta" : "  ventas"} de la base de
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
                const { error } = await deleteSales({
                  ids: ventas.map((venta) => venta.id),
                });

                if (error) {
                  toast.error(error);
                  return;
                }

                props.onOpenChange?.(false);
                toast.success(
                  ventas.length === 1
                    ? "Venta eliminada"
                    : "Ventas eliminadas"
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
