"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getErrorMessage } from "@/lib/handle-error";

export async function getEmpleadoById(id: string) {
    noStore();
    try {
        const data = await db.empleado.findUnique({
            where: {
                id,
            },
        });

        return {
            data,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: getErrorMessage(err),
        };
    }
}