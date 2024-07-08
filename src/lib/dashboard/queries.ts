"use server";

import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import { MovimientoProducto } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { TipoMovimiento } from "@prisma/client";

export async function getMovimientoProducto() {
  noStore();

  try {
    const data = await db.movimientoProducto.findMany({
      include: {
        producto: true,
      },
    });
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    };
  }
}
