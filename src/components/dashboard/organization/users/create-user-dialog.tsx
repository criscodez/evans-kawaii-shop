"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createUser } from "@/lib/dashboard/organization/users/queries";
import {
  createUserSchema,
  type CreateUserSchema,
} from "@/lib/dashboard/organization/users/validations";
import { Input } from "@/components/ui/input";
import { Empleado } from "@/types";
import { getEmployeesList } from "@/lib/dashboard/organization/employees/queries";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const rolesList = [
  {
    id: "ADMIN",
    label: "Admin",
  },
  {
    id: "GERENTE",
    label: "Gerente",
  },
  {
    id: "EMPLEADO_DE_VENTAS",
    label: "Empleado de ventas",
  },
  {
    id: "EMPLEADO_DE_INVENTARIO",
    label: "Empleado de inventario",
  },
] as const;

export function CreateUserDialog() {
  const [open, setOpen] = React.useState(false);
  const [empleados, setEmpleados] = React.useState<Empleado[]>([]);
  const [isCreatePending, startCreateTransition] = React.useTransition();

  React.useEffect(() => {
    getEmployeesList().then((data) => {
      setEmpleados(data.data as Empleado[]);
    });
  }, []);

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  });

  function onSubmit(input: CreateUserSchema) {
    startCreateTransition(async () => {
      const { error, data } = await createUser(input);

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      setOpen(false);
      toast.success(
        "Usuario " + data?.username + " con id " + data?.id + " creado"
      );
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          Nuevo usuario
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Usuario</DialogTitle>
          <DialogDescription>
            Complete los detalles a continuación para crear un nuevo usuario.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="Username sin espacios..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="empleadoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empleado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={empleados.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un empleado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {empleados.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.nombres} {item.apellidos}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  {rolesList.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="roles"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={
                                  Array.isArray(field.value) &&
                                  field.value.includes(item.id)
                                }
                                onCheckedChange={(checked) => {
                                  const updatedValue = Array.isArray(
                                    field.value
                                  )
                                    ? [...field.value]
                                    : [];
                                  if (checked) {
                                    updatedValue.push(item.id);
                                  } else {
                                    const index = updatedValue.indexOf(item.id);
                                    if (index !== -1) {
                                      updatedValue.splice(index, 1);
                                    }
                                  }
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 pt-2 sm:space-x-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button disabled={isCreatePending}>
                {isCreatePending && (
                  <ReloadIcon
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Crear
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
