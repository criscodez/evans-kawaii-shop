"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, PlusIcon } from "lucide-react";

import { Categoria } from "@/types";
import {
  createProduct,
  getCategoriasList,
} from "@/lib/dashboard/catalog/products/queries";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  type CreateProductSchema,
  createProductSchema,
} from "@/lib/dashboard/catalog/products/validations";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function CreateProductForm() {
  const router = useRouter();
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [precio, setPrecio] = React.useState(0.0);

  const [isCreatePending, startCreateTransition] = React.useTransition();

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      nombre: "",
      costo: 0.0,
      utilidad: 0.0,
      unidadMayor: "",
      unidadMenor: "",
      stockTotal: 0,
      stockMinimo: 0,
      categoria: "",
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

  React.useEffect(() => {
    getCategoriasList().then((data) => {
      setCategorias(data.data as Categoria[]);
    });
  }, []);

  function onSubmit(input: CreateProductSchema) {
    startCreateTransition(async () => {
      const { error, data } = await createProduct(input);

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      router.push("/dashboard/catalog/products");
      toast.success(
        "Producto " + data?.nombre + " con id " + data?.id + " creado"
      );
    });
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Crear Producto
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button
            disabled={isCreatePending}
            variant="default"
            size="sm"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isCreatePending ? (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <PlusIcon className="mr-2 size-4" aria-hidden="true" />
            )}
            Crear producto
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>
                    Sección para configurar información básica del producto como
                    nombre, stock y unidades.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre Producto</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nombre del producto"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
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
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
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
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <FormField
                          control={form.control}
                          name="unidadMayor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unidad Mayor</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Unidad mayor del producto"
                                  className="w-full"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="unidadMenor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unidad Menor</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Unidad menor del producto"
                                  className="w-full"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Información de Valor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
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
                      </div>
                      <div>
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
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-2">
                <CardHeader>
                  <CardTitle>Organización</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button
          variant="default"
          size="sm"
          onClick={form.handleSubmit(onSubmit)}
        >
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          Crear producto
        </Button>
      </div>
    </>
  );
}
