"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signInSchema, SignInSchema } from "@/lib/auth/validations";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const [error, setError] = React.useState(null);
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  function onSubmit(input: SignInSchema) {
    startTransition(async () => {
      const res: any = await signIn("credentials", {
        ...input,
        redirect: false,
      });

      if (res.error) {
        setError(res.error);
      } else {
        router.push("/dashboard/home");
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <Card className="w-9/12">
        <CardHeader>
          <CardTitle>Ingresar al Sistema</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-12">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 justify-center"
          >
            {error && (
              <p className="bg-red-500 text-xs text-white p-2 rounded mb-2">
                {error}
              </p>
            )}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="tu-usuario" {...field} />
                  </FormControl>
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
          </form>
          <div className="w-full flex justify-center">
            <Image
              src={"/inventario.png"}
              alt="Sign In"
              width={200}
              height={200}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {isPending && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Ingresar
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
