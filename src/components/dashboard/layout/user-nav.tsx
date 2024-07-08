"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empleado } from "@/types";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getEmpleadoById } from "@/lib/auth/queries";
import { Badge } from "@/components/ui/badge";

export function UserNav() {
  const { data: session } = useSession();
  const [empleado, setEmpleado] = useState<Empleado>();

  useEffect(() => {
    if (session) {
      getEmpleadoById(session.user.empleadoId).then((data) => {
        setEmpleado(data.data as Empleado);
      });
    }
  }, [session]);

  return (
    <DropdownMenu>
      <p className="text-sm font-medium leading-none">
        {empleado
          ? `${empleado.nombres}, ${empleado.apellidos}`
          : session?.user.username}
      </p>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {
              <AvatarImage
                src={session?.user.image ?? ""}
                alt={session?.user.username ?? ""}
              />
            }
            <AvatarFallback>{session?.user.username?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {empleado
                ? `${empleado.nombres}, ${empleado.apellidos}`
                : session?.user.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {(session?.user.roles || []).map((role) => (
            <DropdownMenuItem className="focus:bg-transparent" key={role}>
              {getRoleBadge(role)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Cerrar sesión
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getRoleBadge(role: string) {
  switch (role) {
    case "ADMIN":
      return (
        <Badge variant="destructive" className="text-xs">
          Admin
        </Badge>
      );
    case "GERENTE":
      return <Badge className="text-xs">Gerente</Badge>;
    case "EMPLEADO_DE_VENTAS":
      return (
        <Badge variant="secondary" className="text-xs">
          Empleado de ventas
        </Badge>
      );
    case "EMPLEADO_DE_INVENTARIO":
      return (
        <Badge variant="secondary" className="text-xs">
          Empleado de inventario
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-xs">
          {role}
        </Badge>
      );
  }
}
