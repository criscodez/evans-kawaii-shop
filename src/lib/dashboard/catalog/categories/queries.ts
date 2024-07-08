"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type {
  CreateCategorySchema,
  GetCategoriesSchema,
  UpdateCategorySchema,
} from "./validations";
import { Categoria } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { customAlphabet } from "nanoid";
import { Prisma } from "@prisma/client";

export async function getCategories(input: GetCategoriesSchema) {
  noStore();
  const { page, per_page, id, nombre, operator, sort } = input;

  try {
    const offset = (page - 1) * per_page;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Categoria | undefined, "asc" | "desc" | undefined];

    const where = {
      AND: [
        id && { id: { contains: id } },
        nombre && { nombre: { contains: nombre } },
      ].filter(Boolean) as any[],
    };

    const data = await db.categoria.findMany({
      where,
      skip: offset,
      take: per_page,
      orderBy: {
        [column || "createdAt"]: order || "desc",
      },
    });

    const total = await db.categoria.count({
      where,
    });

    const pageCount = Math.ceil(total / per_page);

    return { data: data, pageCount };
  } catch (err) {
    return { data: [], pageCount: 0 };
  }
}

export async function updateCategory(
  input: UpdateCategorySchema & { id: string }
) {
  noStore();
  try {
    const categoria = await db.categoria.update({
      where: { id: input.id },
      data: {
        nombre: input.nombre,
      },
    });

    revalidatePath("/");

    return {
      data: categoria,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function createCategory(input: CreateCategorySchema) {
  noStore();
  try {
    const categoria = await db.categoria.create({
      data: {
        id: `CA-${customAlphabet("0123456789", 5)()}`,
        nombre: input.nombre,
      },
    });

    revalidatePath("/");

    return {
      data: categoria,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteCategory(input: { id: string }) {
  noStore();
  try {
    await db.categoria.delete({
      where: {
        id: input.id,
      },
    });

    revalidatePath("/");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteCategories(input: { ids: string[] }) {
  noStore();
  try {
    await db.categoria.deleteMany({
      where: {
        id: {
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
      if (err.code === 'P2003') {
        return {
          data: null,
          error: 'No se puede eliminar una categoria que tiene productos asociados.',
        };
      }
    }
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
