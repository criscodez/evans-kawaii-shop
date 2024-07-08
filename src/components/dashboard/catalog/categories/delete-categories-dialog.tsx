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
import { Categoria } from "@/types";
import { deleteCategories } from "@/lib/dashboard/catalog/categories/queries";

interface DeleteCategoryDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  categories: Row<Categoria>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteCategoryDialog({
  categories,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteCategoryDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Borrar ({categories.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás absolutamente seguro?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente{" "}
            <span className="font-medium">{categories.length}</span>
            {categories.length === 1 ? " categoria" : " categorias"} de la base de
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
                const { error } = await deleteCategories({
                  ids: categories.map((categoria) => categoria.id),
                });

                if (error) {
                  toast.error(error);
                  return;
                }

                props.onOpenChange?.(false);
                toast.success(
                  categories.length === 1
                    ? "Categoria eliminada"
                    : "Categorias eliminadas"
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
