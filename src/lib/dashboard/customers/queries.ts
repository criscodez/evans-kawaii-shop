"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getErrorMessage } from "@/lib/handle-error";
import { Prisma } from "@prisma/client";

export async function getCustomersList() {
  noStore();
  try {
    const data = await db.cliente.findMany({
      orderBy: {
        nombres: "asc",
      },
    });
    
    return {
      data,
      error: null,
    };
  } catch (err) {
    return {
      data: [],
      error: null,
    };
  }
}

export async function deleteCustomers(input: { ids: string[] }) {
    noStore();
    try {
      await db.cliente.deleteMany({
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
            error:
              "No se puede eliminar este cliente.",
          };
        }
      }
      return {
        data: null,
        error: getErrorMessage(err),
      };
    }
  }