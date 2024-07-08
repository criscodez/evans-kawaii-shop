"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type {
  CreateEmployeeSchema,
  GetEmployeesSchema,
  UpdateEmployeeSchema,
} from "./validations";
import { Empleado } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { customAlphabet } from "nanoid";
import { Prisma, Sexo } from "@prisma/client";

export async function getEmployees(input: GetEmployeesSchema) {
  noStore();
  const {
    page,
    per_page,
    sort,
    id,
    dni,
    apellidos,
    nombres,
    sexo,
    direccion,
    email,
    operator,
    telefono,
  } = input;

  try {
    const offset = (page - 1) * per_page;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Empleado | undefined, "asc" | "desc" | undefined];

    const where = {
      AND: [
        id && { id: { contains: id } },
        dni && { dni: { contains: dni } },
        apellidos && { apellidos: { contains: apellidos } },
        nombres && { nombres: { contains: nombres } },
        sexo && { sexo: { contains: sexo } },
        direccion && { direccion: { contains: direccion } },
        email && { email: { contains: email } },
        telefono && { telefono: { contains: telefono } },
      ].filter(Boolean) as any[],
    };

    const data = await db.empleado.findMany({
      where,
      skip: offset,
      take: per_page,
      orderBy: {
        [column || "createdAt"]: order || "desc",
      },
    });

    const total = await db.empleado.count({
      where,
    });

    const pageCount = Math.ceil(total / per_page);

    return {
      data,
      pageCount,
    };
  } catch (error) {
    return { data: [], pageCount: 0 };
  }
}

export async function getEmployeesList() {
  noStore();
  try {
    const data = await db.empleado.findMany({
      select: {
        id: true,
        nombres: true,
        apellidos: true,
      },
    });

    return {
      data,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: null,
    };
  }
}

export async function createEmployee(input: CreateEmployeeSchema) {
  noStore();
  try {
    const empleado = await db.empleado.create({
      data: {
        id: `EM-${customAlphabet("0123456789", 5)()}`,
        dni: input.dni,
        apellidos: input.apellidos,
        nombres: input.nombres,
        fechaNacimiento: input.fechaNacimiento,
        sexo: input.sexo as Sexo,
        email: input.email,
        telefono: input.telefono,
        direccion: input.direccion,
      },
    });

    revalidatePath("/");

    return { data: empleado, error: null };
  } catch (error) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function updateEmployee(
  input: UpdateEmployeeSchema & { id: string }
) {
  noStore();
  try {
    const empleado = await db.empleado.update({
      where: { id: input.id },
      data: {
        dni: input.dni,
        apellidos: input.apellidos,
        nombres: input.nombres,
        fechaNacimiento: input.fechaNacimiento,
        sexo: input.sexo as Sexo,
        email: input.email,
        telefono: input.telefono,
        direccion: input.direccion,
      },
    });

    revalidatePath("/");

    return {
      data: empleado,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    };
  }
}

export async function deleteEmployees(input: { ids: string[] }) {
  noStore();
  try {
    await db.empleado.deleteMany({
      where: {
        id: {
          in: input.ids,
        },
      },
    });

    await db.user.deleteMany({
      where: {
        empleadoId: {
          in: input.ids,
        },
      },
    });

    revalidatePath("/");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        return {
          data: null,
          error: "No se puede eliminar este empleado.",
        };
      }
    }
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}