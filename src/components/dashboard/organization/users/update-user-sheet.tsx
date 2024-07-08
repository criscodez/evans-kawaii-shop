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
  import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types";
import {
  type UpdateUserSchema,
  updateUserSchema,
} from "@/lib/dashboard/organization/users/validations";
import { updateUser } from "@/lib/dashboard/organization/users/queries";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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

interface UpdateUserSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  usuario: User;
}

export function UpdateUserSheet({
  usuario,
  ...props
}: UpdateUserSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition();

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: usuario.username,
      empleadoId: usuario.empleado.id,
      roles: usuario.roles.map((role) => role.role),
    },
  });

  function onSubmit(input: UpdateUserSchema) {
    startUpdateTransition(async () => {
      const { error, data } = await updateUser({
        id: usuario.id,
        ...input,
      });

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      props.onOpenChange?.(false);
      toast.success(
        "Usuario " + data?.username + " con id " + data?.id + " actualizado"
      );
    });
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Actualizar Usuario</SheetTitle>
          <SheetDescription>Actualice los datos de usuario del empleado: {usuario.empleado.apellidos}, {usuario.empleado.nombres}</SheetDescription>
        </SheetHeader>
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
