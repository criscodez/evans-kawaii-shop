"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Categoria } from "@/types";
import {
  type UpdateCategorySchema,
  updateCategorySchema,
} from "@/lib/dashboard/catalog/categories/validations";
import { updateCategory } from "@/lib/dashboard/catalog/categories/queries";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface UpdateCategorySheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  categoria: Categoria;
}

export function UpdateCategorySheet({
  categoria,
  ...props
}: UpdateCategorySheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition();

  const form = useForm<UpdateCategorySchema>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      nombre: categoria.nombre,
    },
  });

  function onSubmit(input: UpdateCategorySchema) {
    startUpdateTransition(async () => {
      const { error, data } = await updateCategory({
        id: categoria.id,
        ...input,
      });

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      props.onOpenChange?.(false);
      toast.success(
        "Categoria " + data?.nombre + " con id " + data?.id + " actualizada"
      );
    });
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Actualizar Categoria</SheetTitle>
          <SheetDescription>
            Actualice los detalles de la categoria y guarde los cambios.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </SheetClose>
              <Button disabled={isUpdatePending}>
                {isUpdatePending && (
                  <ReloadIcon
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Guardar
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
