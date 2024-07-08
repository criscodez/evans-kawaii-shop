"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { CreateSaleSchema, GetSalesSchema } from "./validations";
import { Venta } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { customAlphabet } from "nanoid";
import { EstadoInventario, Prisma, Producto, TipoComprobante } from "@prisma/client";

export async function getSales(input: GetSalesSchema, empleadoId?: string) {
  noStore();
  const { page, per_page, sort, id, empleado, total, igv, fecha, operator } =
    input;

  try {
    const offset = (page - 1) * per_page;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "fecha",
      "desc",
    ]) as [keyof Venta | undefined, "asc" | "desc" | undefined];

    const where = {
      AND: [
        id && { id: { contains: id } },
        empleado && { empleado: { nombres: { contains: empleado } } },
        total && { total: { contains: total } },
        igv && { igv: { contains: igv } },
        fecha && { fecha: { contains: fecha } },
      ].filter(Boolean) as any[],
      ...(empleadoId ? { empleadoId } : {}),
    };

    const data = await db.venta.findMany({
      where,
      skip: offset,
      take: per_page,
      include: {
        empleado: true,
        cliente: true,
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

export async function checkProductsStock(productos: { productoId: string; cantidad: number, subtotal: number }[]) {
  noStore();
  const productosDB = await db.producto.findMany({
    where: {
      id: {
        in: productos.map((producto) => producto.productoId),
      },
    },
  });

  const productosSinStock = productosDB.filter((productoDB) => {
    const producto = productos.find(
      (producto) => producto.productoId === productoDB.id
    );

    if (!producto) {
      return false;
    }

    return productoDB.stockTotal < producto.cantidad;
  })

  return {
    productosSinStock,
    error: null,
  };
}

export async function createSale(input: CreateSaleSchema) {
  try {
    const venta = await db.venta.create({
      data: {
        id: `VE-${customAlphabet("0123456789", 5)()}`,
        numVenta: input.numVenta,
        total: input.total,
        IGV: input.igv,
        fecha: new Date(),
        clienteId: input.clienteId ? input.clienteId : undefined,
        comprobante:
          TipoComprobante[input.comprobante as keyof typeof TipoComprobante],
        empleadoId: input.empleadoId,
      },
    });

    const productos = input.productos.map((producto) => {
      return {
        ventaId: venta.id,
        productoId: producto.productoId,
        cantidad: producto.cantidad,
        subtotal: producto.subtotal,
      };
    });

    await db.detalleVenta.createMany({
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
            decrement: producto.cantidad,
          },
          estado: stock === productoDB.stockMinimo ? EstadoInventario.LIMITADO : stock > 0 ? EstadoInventario.EN_STOCK : EstadoInventario.AGOTADO,
        },
      });

      await db.movimientoProducto.create({
        data: {
          fecha: new Date(),
          tipo: "SALIDA",
          descripcion: `Venta de x${producto.cantidad} ${productoDB.nombre} hecha por el empleado ${venta.empleadoId}`,
          stockAnterior: productoDB.stockTotal,
          stockNuevo: productoDB.stockTotal - producto.cantidad,
          productoId: producto.productoId,
        },
      });
    });

    return {
      data: venta,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    };
  }
}

export async function deleteSales(input: { ids: string[] }) {
  noStore();
  try {
    await db.detalleVenta.deleteMany({
      where: {
        ventaId: {
          in: input.ids,
        },
      },
    });

    await db.venta.deleteMany({
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
