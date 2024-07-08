"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { CreatePurchaseSchema, GetPurchasesSchema } from "./validations";
import { OrdenCompra } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { customAlphabet } from "nanoid";
import { EstadoInventario } from "@prisma/client";

export async function getPurchases(input: GetPurchasesSchema) {
  noStore();
  const {
    page,
    per_page,
    sort,
    proveedor,
    empleado,
    total,
    igv,
    fecha,
    operator,
  } = input;

  try {
    const offset = (page - 1) * per_page;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "fecha",
      "desc",
    ]) as [keyof OrdenCompra | undefined, "asc" | "desc" | undefined];

    const where = {
      AND: [
        proveedor && { proveedor: { nombre: { contains: proveedor } } },
        empleado && { empleado: { nombres: { contains: empleado } } },
        total && { total: { contains: total } },
        igv && { igv: { contains: igv } },
        fecha && { fecha: { contains: fecha } },
      ].filter(Boolean) as any[],
    };

    const data = await db.ordenCompra.findMany({
      where,
      skip: offset,
      take: per_page,
      include: {
        proveedor: true,
        empleado: true,
      },
      orderBy: {
        [column || "fecha"]: order || "desc",
      },
    });

    const totalC = await db.ordenCompra.count({
      where,
    });

    const pageCount = Math.ceil(totalC / per_page);

    return {
      data,
      pageCount,
    };
  } catch (error) {
    return { data: [], pageCount: 0 };
  }
}

export async function createPurchase(input: CreatePurchaseSchema) {
  noStore();
  try {
    const ordenCompra = await db.ordenCompra.create({
      data: {
        id: `OC-${customAlphabet("0123456789", 5)()}`,
        total: input.total,
        IGV: input.igv,
        fecha: new Date(input.fecha),
        proveedor: {
          connect: {
            id: input.proveedorId,
          },
        },
        empleado: {
          connect: {
            id: input.empleadoId,
          },
        },
      },
    });

    const productos = input.productos.map((producto) => {
      return {
        ordenCompraId: ordenCompra.id,
        productoId: producto.productoId,
        cantidad: producto.cantidad,
        subtotal: producto.subtotal,
      };
    });

    await db.detalleCompra.createMany({
      data: productos,
    });

    productos.forEach(async (producto) => {
      const productoDB = await db.producto.findUnique({
        where: {
          id: producto.productoId,
        },
      });

      if (!productoDB) {
        return;
      }

      const stock = productoDB.stockTotal - producto.cantidad;

      await db.producto.update({
        where: {
          id: producto.productoId,
        },
        data: {
          stockTotal: {
            increment: producto.cantidad,
          },
          estado: stock === productoDB.stockMinimo ? EstadoInventario.LIMITADO : stock > 0 ? EstadoInventario.EN_STOCK : EstadoInventario.AGOTADO,
        },
      });

      await db.movimientoProducto.create({
        data: {
          fecha: new Date(),
          descripcion:
            "Compra de productos por orden de compra, Empleado: " + ordenCompra.empleadoId +", Proveedor: " + ordenCompra.proveedorId,
          tipo: "ENTRADA",
          stockAnterior: productoDB.stockTotal,
          stockNuevo: productoDB.stockTotal + producto.cantidad,
          productoId: producto.productoId,
        },
      });
    });

    revalidatePath("/")

    return {
      data: ordenCompra,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    };
  }
}
