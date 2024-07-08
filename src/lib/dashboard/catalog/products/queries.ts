"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { CreateProductSchema, GetProductsSchema, UpdateProductSchema } from "./validations";
import { Producto } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { customAlphabet } from "nanoid"
import { EstadoInventario } from "@prisma/client";

export async function getProducts(input: GetProductsSchema) {
  noStore();
  const {
    page,
    per_page,
    costo,
    estado,
    id,
    nombre,
    operator,
    precio,
    sort,
    stockTotal,
    utilidad,
  } = input;

  try {
    const offset = (page - 1) * per_page;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Producto | undefined, "asc" | "desc" | undefined];

    const where = {
      AND: [
        id && { id: { contains: id } },
        nombre && { nombre: { contains: nombre } },
        costo && { costo: { gte: costo } },
        utilidad && { utilidad: { gte: utilidad } },
        precio && { precio: { gte: precio } },
        stockTotal && { stockTotal: { gte: stockTotal } },
        estado && { estado: { equals: estado } },
      ].filter(Boolean) as any[],
    };

    const data = await db.producto.findMany({
      where,
      skip: offset,
      take: per_page,
      orderBy: {
        [column || "createdAt"]: order || "desc",
      },
      include: {
        categoria: true,
      },
    });

    const newData: Producto[] = data.map((item) => {
      return {
        id: item.id,
        nombre: item.nombre,
        costo: item.costo,
        utilidad: item.utilidad,
        precio: item.precio,
        unidad: item.unidad,
        stockTotal: item.stockTotal,
        stockMinimo: item.stockMinimo,
        estado: item.estado,
        categoria: item.categoria,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    // Count total records (for pagination)
    const total = await db.producto.count({
      where,
    });

    const pageCount = Math.ceil(total / per_page);

    return { data: newData, pageCount };
  } catch (err) {
    return { data: [], pageCount: 0 };
  }
}

export async function getProductsList() {
  noStore();
  try {
    const data = await db.producto.findMany({
      select: {
        id: true,
        nombre: true,
        costo: true,
        precio: true,
        stockTotal: true,
        categoria: {
          select: {
            nombre: true,
          },
        }
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

export async function updateProduct(input: UpdateProductSchema & { id: string }) {
  noStore();
  try {
    const producto = await db.producto.update({
      where: { id: input.id },
      data: {
        nombre: input.nombre,
        costo: input.costo,
        utilidad: input.utilidad,
        precio: input.costo + input.utilidad,
        unidad: input.unidad,
        stockTotal: input.stockTotal,
        stockMinimo: input.stockMinimo,
        estado: input.stockTotal === input.stockMinimo ? EstadoInventario.LIMITADO : input.stockTotal > 0 ? EstadoInventario.EN_STOCK : EstadoInventario.AGOTADO,
        categoria: {
          connect: {
            id: input.categoria,
          },
        },
      },
    });

    revalidatePath("/");

    return {
      data: producto,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function createProduct(input: CreateProductSchema) {
  noStore()
  try {
    const producto = await db.producto.create({
      data: {
        id: `PD-${customAlphabet("0123456789", 5)()}`,
        nombre: input.nombre,
        costo: input.costo,
        utilidad: input.utilidad,
        precio: input.costo + input.utilidad,
        unidad: input.unidad,
        stockTotal: input.stockTotal,
        stockMinimo: input.stockMinimo,
        categoria: {
          connect: {
            id: input.categoria,
          },
        },
      },
    })
    
    revalidatePath("/")

    return {
      data: producto,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function getCategoriasList() {
  noStore();
  try {
    const data = await db.categoria.findMany({
      select: {
        id: true,
        nombre: true,
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

export async function deleteProduct(input: { id: string }) {
  noStore();
  try {
    await db.producto.delete({
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

export async function deleteProducts(input: { ids: string[] }) {
  noStore();
  try {
    await db.detalleVenta.deleteMany({
      where: {
        productoId: {
          in: input.ids,
        },
      },
    });

    await db.detalleCompra.deleteMany({
      where: {
        productoId: {
          in: input.ids,
        },
      },
    });

    await db.producto.deleteMany({
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
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
} 