"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Categoria, Producto } from "@/types";
import {
  type UpdateProductSchema,
  updateProductSchema,
} from "@/lib/dashboard/catalog/products/validations";
import {
  getCategoriasList,
  updateProduct,
} from "@/lib/dashboard/catalog/products/queries";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";

interface UpdateProductSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  producto: Producto;
}

export function UpdateProductSheet({
  producto,
  ...props
}: UpdateProductSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition();
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [precio, setPrecio] = React.useState(0.0);

  React.useEffect(() => {
    getCategoriasList().then((data) => setCategorias(data.data as Categoria[]));
  }, [producto]);

  const form = useForm<UpdateProductSchema>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      nombre: producto.nombre,
      costo: producto.costo,
      utilidad: producto.utilidad,
      stockTotal: producto.stockTotal,
      unidad: producto.unidad,
      stockMinimo: producto.stockMinimo,
      categoria: producto.categoria.id,
    },
  });

  const costo = useWatch({
    control: form.control,
    name: "costo",
  });

  const utilidad = useWatch({
    control: form.control,
    name: "utilidad",
  });

  React.useEffect(() => {
    const calculatedPrice =
      parseFloat(costo.toString()) + parseFloat(utilidad.toString());
    setPrecio(parseFloat(calculatedPrice.toFixed(2)));
  }, [costo, utilidad]);

  function onSubmit(input: UpdateProductSchema) {
    startUpdateTransition(async () => {
      const { error, data } = await updateProduct({
        id: producto.id,
        ...input,
      });

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      props.onOpenChange?.(false);
      toast.success(
        "Producto " + data?.nombre + " con id " + data?.id + " actualizado"
      );
    });
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Actualizar Producto</SheetTitle>
          <SheetDescription>
            Actualice los detalles del producto y guarde los cambios.
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
                  <FormLabel>Nombre Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stockTotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Stock del producto"
                        type="number"
                        className="w-full"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stockMinimo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Mínimo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Stock mínimo del producto"
                        type="number"
                        className="w-full"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="unidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad</FormLabel>
                  <FormDescription>
                    Unidad del producto (ej: unit., kg., g., box., dozen., m.,
                    cm.)
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="ej: unit., kg., etc"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="costo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="0.00"
                          min={0.0}
                          type="number"
                          className="w-full pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="utilidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Utilidad</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="0.00"
                          min={0.0}
                          type="number"
                          className="w-full pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <Label>Precio</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="0.00"
                  value={precio}
                  type="number"
                  className="w-full pl-8"
                  disabled
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={categorias.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {categorias.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.nombre}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
