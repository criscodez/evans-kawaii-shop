"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type {
  CreateCompanySchema,
  GetCompaniesSchema,
  UpdateCompanySchema,
} from "./validations";
import { Cliente } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { customAlphabet } from "nanoid";
import { Prisma } from "@prisma/client";

export async function getCompanies(input: GetCompaniesSchema) {
  noStore();
  const {
    page,
    per_page,
    sort,
    id,
    nombre,
    ruc,
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
        { tipo: { equals: "EMPRESA" } },
        id && { id: { contains: id } },
        nombre && { nombre: { contains: nombre } },
        ruc && { ruc: { contains: ruc } },
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

export async function updateCompany(
  input: UpdateCompanySchema & { id: string }
) {
  noStore();
  try {
    const cliente = await db.cliente.update({
      where: { id: input.id },
      data: {
        nombre: input.nombre,
        ruc: input.ruc,
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

export async function createCompany(input: CreateCompanySchema) {
  noStore();
  try {
    const cliente = await db.cliente.create({
      data: {
        id: `CE-${customAlphabet("0123456789", 5)()}`,
        tipo: "EMPRESA",
        nombre: input.nombre,
        ruc: input.ruc,
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