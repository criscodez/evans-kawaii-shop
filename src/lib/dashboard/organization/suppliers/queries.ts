"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type {
  CreateSupplierSchema,
  GetSuppliersSchema,
  UpdateSupplierSchema,
} from "./validations";
import { Proveedor } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { customAlphabet } from "nanoid";
import { Prisma } from "@prisma/client";

export async function getSuppliers(input: GetSuppliersSchema) {
  noStore();
  const {
    page,
    per_page,
    sort,
    id,
    ruc,
    nombre,
    email,
    telefono,
    direccion,
    operator,
  } = input;

  try {
    const offset = (page - 1) * per_page;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Proveedor | undefined, "asc" | "desc" | undefined];

    const where = {
      AND: [
        id && { id: { contains: id } },
        ruc && { ruc: { contains: ruc } },
        nombre && { nombre: { contains: nombre } },
        email && { email: { contains: email } },
        telefono && { telefono: { contains: telefono } },
        direccion && { direccion: { contains: direccion } },
      ].filter(Boolean) as any[],
    };

    const data = await db.proveedor.findMany({
      where,
      skip: offset,
      take: per_page,
      orderBy: {
        [column || "createdAt"]: order || "desc",
      },
    });

    const total = await db.proveedor.count({
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

export async function getSuppliersList() {
  noStore();
  try {
    const data = await db.proveedor.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });

    return { data, error: null };
  } catch (error) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function createSupplier(input: CreateSupplierSchema) {
  noStore();
  try {
    const proveedor = await db.proveedor.create({
      data: {
        id: `PV-${customAlphabet("0123456789", 5)()}`,
        nombre: input.nombre,
        ruc: input.ruc,
        email: input.email,
        telefono: input.telefono,
        direccion: input.direccion,
      },
    });

    revalidatePath("/");

    return { data: proveedor, error: null };
  } catch (error) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function updateSupplier(
  input: UpdateSupplierSchema & { id: string }
) {
  noStore();
  try {
    const proveedor = await db.proveedor.update({
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

    return { data: proveedor, error: null };
  } catch (error) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function deleteSuppliers(input: { ids: string[] }) {
  noStore();
  try {
    await db.proveedor.findMany({
      where: {
        id: {
          in: input.ids,
        },
      },
    });

    revalidatePath("/");

    return { data: null, error: null };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        return {
          data: null,
          error: "No se puede eliminar este proveedor.",
        };
      }
    }
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
