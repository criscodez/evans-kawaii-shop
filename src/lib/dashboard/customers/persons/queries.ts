"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type {
  CreatePersonSchema,
  GetPersonsSchema,
  UpdatePersonSchema,
} from "./validations";
import { Cliente } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { customAlphabet } from "nanoid";
import { Prisma } from "@prisma/client";

export async function getPersons(input: GetPersonsSchema) {
  noStore();
  const {
    page,
    per_page,
    sort,
    id,
    dni,
    apellidos,
    nombres,
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
    ]) as [keyof Cliente | undefined, "asc" | "desc" | undefined];

    const where = {
      AND: [
        { tipo: { equals: "PERSONA" } },
        id && { id: { contains: id } },
        dni && { dni: { contains: dni } },
        apellidos && { apellidos: { contains: apellidos } },
        nombres && { nombres: { contains: nombres } },
        direccion && { direccion: { contains: direccion } },
        email && { email: { contains: email } },
        telefono && { telefono: { contains: telefono } },
      ].filter(Boolean) as any[],
    };

    const data = await db.cliente.findMany({
      where,
      skip: offset,
      take: per_page,
      orderBy: {
        [column || "createdAt"]: order || "desc",
      },
    });

    const total = await db.cliente.count({
      where,
    });

    const pageCount = Math.ceil(total / per_page);

    return { data: data, pageCount };
  } catch (err) {
    return { data: [], pageCount: 0 };
  }
}

export async function updatePerson(
  input: UpdatePersonSchema & { id: string }
) {
  noStore();
  try {
    const cliente = await db.cliente.update({
      where: { id: input.id },
      data: {
        dni: input.dni,
        apellidos: input.apellidos,
        nombres: input.nombres,
        email: input.email,
        telefono: input.telefono,
        direccion: input.direccion,
      },
    });

    revalidatePath("/");

    return {
      data: cliente,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function createPerson(input: CreatePersonSchema) {
  noStore();
  try {
    const cliente = await db.cliente.create({
      data: {
        id: `CP-${customAlphabet("0123456789", 5)()}`,
        tipo: "PERSONA",
        dni: input.dni,
        apellidos: input.apellidos,
        nombres: input.nombres,
        email: input.email,
        telefono: input.telefono,
        direccion: input.direccion,
      },
    });

    revalidatePath("/");

    return {
      data: cliente,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
