"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, PlusCircle, PlusIcon, Trash } from "lucide-react";

import { OrdenCompra, Producto, Proveedor } from "@/types";
import { getProductsList } from "@/lib/dashboard/catalog/products/queries";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type CreatePurchaseSchema,
  createPurchaseSchema,
} from "@/lib/dashboard/warehouse/purchases/validations";
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
import { useSession } from "next-auth/react";
import { createPurchase } from "@/lib/dashboard/warehouse/purchases/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AutoCompleteProductos } from "./products-autocomplete";
import { getSuppliersList } from "@/lib/dashboard/organization/suppliers/queries";
import { Checkbox } from "@/components/ui/checkbox";

export interface Items {
  [key: string]: any;
  nombre: string;
  costo: number;
  productoId: string;
  cantidad: number;
  subtotal: number;
}

export default function CreatePurchaseForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [productos, setProductos] = React.useState<Producto[]>([]);
  const [proveedores, setProveedores] = React.useState<Proveedor[]>([]);

  React.useEffect(() => {
    getSuppliersList().then((data) => {
      setProveedores(data.data as Proveedor[]);
    });
  }, []);

  const [productosSeleccionados, setProductosSeleccionados] = React.useState<
    Items[]
  >([]);
  const [igvEnabled, setIgvEnabled] = React.useState(false);
  const [igv, setIgv] = React.useState(0.0);
  const [subTotal, setSubTotal] = React.useState(0.0);
  const total = subTotal + igv;

  const [isCreatePending, startCreateTransition] = React.useTransition();

  const form = useForm<CreatePurchaseSchema>({
    resolver: zodResolver(createPurchaseSchema),
    defaultValues: {
      igv: 0.0,
    },
  });

  React.useEffect(() => {
    getProductsList().then((data) => {
      setProductos(data.data as Producto[]);
    });
  }, []);

  React.useEffect(() => {
    form.setValue("productos", productosSeleccionados);
    form.setValue("empleadoId", session?.user.empleadoId || "");

    let subTotal: number = 0;
    productosSeleccionados.forEach((item) => {
      subTotal += item.subtotal;
    });

    setSubTotal(formatToTwoDecimals(subTotal));
    if (igvEnabled) {
      setIgv(formatToTwoDecimals(subTotal * 0.18));
    } else {
      setIgv(0.0);
    }
  }, [productosSeleccionados]);

  React.useEffect(() => {
    if (igvEnabled) {
      setIgv(formatToTwoDecimals(subTotal * 0.18));
    } else {
      setIgv(0.0);
    }
  }, [igvEnabled]);

  React.useEffect(() => {
    form.setValue("total", total);
    form.setValue("igv", igv);
  }, [subTotal, igv]);

  function onSubmit(input: CreatePurchaseSchema) {
    console.log(input);
    startCreateTransition(async () => {
      const { error, data } = await createPurchase(input);

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      router.push("/dashboard/warehouse/purchases");
      toast.success("Orden de compra con id " + data?.id + " registrada");
    });
  }

  const handlerQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newItems = productosSeleccionados.map((item, i) => {
      if (i === index) {
        if (e.target.value === "") {
          return item;
        }
        if (parseInt(e.target.value) < 1) {
          return item;
        }

        if (item.costo === undefined) {
          return item;
        }

        return {
          ...item,
          cantidad: parseInt(e.target.value),
          subtotal: parseInt(e.target.value) * item.costo,
        };
      }
      return item;
    });
    setProductosSeleccionados(newItems);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Registrar Orden de Compra
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
            Registrar orden de compra
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
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="fecha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="place-content-center"
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) => {
                                  const dateString = e.target.value;
                                  const [year, month, day] =
                                    dateString.split("-");
                                  const date = new Date(
                                    parseInt(year),
                                    parseInt(month) - 1,
                                    parseInt(day)
                                  );
                                  form.setValue("fecha", date);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="proveedorId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proveedor</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={proveedores.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione proveedor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  {proveedores.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                      {item.id} - {item.nombre}
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
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Productos</CardTitle>
                  <CardDescription>
                    Agrega los productos que deseas registrar una orden de
                    comprar:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="productos"
                    render={({ field }) => (
                      <FormItem>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">
                                Producto
                              </TableHead>
                              <TableHead className="w-[100px]">Costo</TableHead>
                              <TableHead>Cantidad</TableHead>
                              <TableHead className="w-[100px]">
                                SubTotal
                              </TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {productosSeleccionados.map((item, index) => (
                              <TableRow key={item.productoId}>
                                <TableCell>{item.nombre}</TableCell>
                                <TableCell>S/. {item.costo}</TableCell>
                                <TableCell>
                                  <Input
                                    onChange={(e) =>
                                      handlerQuantityChange(e, index)
                                    }
                                    value={item.cantidad}
                                    min={1}
                                    type="number"
                                  />
                                </TableCell>
                                <TableCell>S/. {item.subtotal}</TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const newItems =
                                        productosSeleccionados.filter(
                                          (_, i) =>
                                            _.productoId !== item.productoId
                                        );
                                      setProductosSeleccionados(newItems);
                                    }}
                                  >
                                    <Trash className="h-3.5 w-3.5" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="border-t p-4">
                  <AutoCompleteProductos
                    placeholder="Busca un producto...."
                    emptyMessage="No se encontraron productos..."
                    productos={productos}
                    productosSeleccionados={productosSeleccionados}
                    setProductosSeleccionados={setProductosSeleccionados}
                  />
                </CardFooter>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Información del Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid">
                    <div className="flex space-x-2 mb-4">
                      <Checkbox
                        id="igv"
                        checked={igvEnabled}
                        onCheckedChange={(checked) => {
                          setIgvEnabled(checked ? true : false);
                        }}
                      />
                      <label className="text-sm">Aplicar IGV (18%)</label>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm">Subtotal</label>
                      <span className="text-sm">S/. {subTotal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm">IGV (18%)</label>
                      <span className="text-sm">S/. {igv}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t flex justify-between items-center">
                  <label className="text-sm">Total</label>
                  <span className="text-right">S/. {total}</span>
                </CardFooter>
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
          Registrar orden de compra
        </Button>
      </div>
    </>
  );
}

function formatToTwoDecimals(number: number) {
  return Number(number.toFixed(2));
}
