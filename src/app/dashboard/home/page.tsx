"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Empleado } from "@/types";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getEmpleadoById } from "@/lib/auth/queries";

export default function Home() {
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
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            ¡Hola{" "}
            <span className="text-primary">
              {empleado
                ? `${empleado.nombres}, ${empleado.apellidos}`
                : session?.user.username}
            </span>
            , bienvenido a tu panel de control!
          </h2>
        </div>
      </div>
    </ScrollArea>
  );
}
