import * as z from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  id: z.string().optional(),
  username: z.string().optional(),
  apellidos: z.string().optional(),
  nombres: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

export const getUsersSchema = searchParamsSchema;

export type GetUsersSchema = z.infer<typeof getUsersSchema>;

export const createUserSchema = z.object({
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    empleadoId: z.string().min(1, "El empleado es requerido"),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    empleadoId: z.string().min(1, "El empleado es requerido"),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
