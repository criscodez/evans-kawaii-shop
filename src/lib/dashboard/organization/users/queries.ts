"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type {
  CreateUserSchema,
  GetUsersSchema,
  UpdateUserSchema,
} from "./validations";
import { User } from "@/types";
import { getErrorMessage } from "@/lib/handle-error";
import { customAlphabet } from "nanoid";
import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcrypt";

export async function getUsers(input: GetUsersSchema) {
  noStore();
  const { page, per_page, sort, id, username, apellidos, nombres, operator } =
    input;

  try {
    const offset = (page - 1) * per_page;
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof User | undefined, "asc" | "desc" | undefined];

    const where = {
      AND: [
        id && { id: { contains: id } },
        username && { username: { contains: username } },
        apellidos && { empleado: { apellidos: { contains: apellidos } } },
        nombres && { empleado: { nombres: { contains: nombres } } },
      ].filter(Boolean) as any[],
    };

    const data = await db.user.findMany({
      where,
      skip: offset,
      take: per_page,
      include: {
        empleado: true,
        roles: true,
      },
      orderBy: {
        [column || "createdAt"]: order || "desc",
      },
    });

    const total = await db.user.count({
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

export async function createUser(input: CreateUserSchema) {
  noStore();
  try {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await db.user.create({
      data: {
        id: `US-${customAlphabet("0123456789", 5)()}`,
        username: input.username,
        password: hashedPassword,
        empleado: {
          connect: {
            id: input.empleadoId,
          },
        },
      },
      include: {
        empleado: true,
      },
    });

    const roles = input.roles.map((role) => ({
      userId: user.id,
      role: Role[role as keyof typeof Role],
    }));

    await db.userRole.createMany({
      data: roles,
    });

    revalidatePath("/");

    return { data: user, error: null };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          data: null,
          error: "Ya existe ese usuario.",
        };
      }
      if (error.code === "P2014") {
        return {
          data: null,
          error: "Ese empleado ya tiene un usuario.",
        };
      }
    }
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function updateUser(input: UpdateUserSchema & { id: string }) {
  noStore();
  try {
    const user = await db.user.update({
      where: {
        id: input.id,
      },
      data: {
        username: input.username,
        empleado: {
          connect: {
            id: input.empleadoId,
          },
        },
        ...(input.password && {
          password: await bcrypt.hash(input.password, 10),
        }),
      },
      include: {
        empleado: true,
      },
    });

    const roles = input.roles.map((role) => ({
      userId: user.id,
      role: Role[role as keyof typeof Role],
    }));

    await db.userRole.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await db.userRole.createMany({
      data: roles,
    });

    revalidatePath("/");

    return { data: user, error: null };
  } catch (error) {
    return { data: null, error: getErrorMessage(error) };
  }
}

export async function deleteUsers(input: { ids: string[] }) {
  noStore();
  try {
    await db.userRole.deleteMany({
      where: {
        userId: {
          in: input.ids,
        },
      },
    });

    await db.user.deleteMany({
      where: {
        id: {
          in: input.ids,
        },
      },
    });

    revalidatePath("/");

    return { data: null, error: null };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          data: null,
          error: "No se puede eliminar este usuario.",
        };
      }
    }
    return { data: null, error: getErrorMessage(error) };
  }
}
