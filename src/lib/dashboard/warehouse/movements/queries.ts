"use server";

import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import type { GetMovementsSchema } from "./validations";
import { MovimientoProducto } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { TipoMovimiento } from "@prisma/client";

export async function getMovements(input: GetMovementsSchema) {
  noStore();
  const { page, per_page, sort, id, tipo, fecha, operator } = input;

  try {
    const offset = (page - 1) * per_page;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "fecha",
      "desc",
    ]) as [keyof MovimientoProducto | undefined, "asc" | "desc" | undefined];

    const where = {
      AND: [
        id && { id: { contains: id } },
        tipo && { tipo: { equals: tipo as TipoMovimiento } },
        fecha && { fecha: { contains: fecha } },
      ].filter(Boolean) as any[],
    };

    const data = await db.movimientoProducto.findMany({
      where,
      skip: offset,
      take: per_page,
      include: {
        producto: true,
      },
      orderBy: {
        [column || "fecha"]: order || "desc",
      },
    });

    const totalC = await db.movimientoProducto.count({
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
