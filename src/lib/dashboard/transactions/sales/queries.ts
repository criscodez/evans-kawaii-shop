"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { CreateSaleSchema, GetSalesSchema } from "./validations";
import { Venta } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { customAlphabet } from "nanoid";
import { Prisma, TipoComprobante } from "@prisma/client";

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
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        return {
          data: null,
          error: "No se puede eliminar este cliente.",
        };
      }
    }
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
