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
import { Producto } from "@/types";
import { deleteProducts } from "@/lib/dashboard/catalog/products/queries";

interface DeleteProductDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  products: Row<Producto>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteProductDialog({
  products,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteProductDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Borrar ({products.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás absolutamente seguro?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente{" "}
            <span className="font-medium">{products.length}</span>
            {products.length === 1 ? " producto" : " productos"} de la base de
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
                const { error } = await deleteProducts({
                  ids: products.map((producto) => producto.id),
                });

                if (error) {
                  toast.error(error);
                  return;
                }

                props.onOpenChange?.(false);
                toast.success(
                  products.length === 1
                    ? "Producto eliminado"
                    : "Productos eliminados"
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
