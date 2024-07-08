import * as z from "zod";

export const searchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    id: z.string().optional(),
    dni: z.string().optional(),
    apellidos: z.string().optional(),
    nombres: z.string().optional(),
    email: z.string().optional(),
    telefono: z.string().optional(),
    direccion: z.string().optional(),
    operator: z.enum(["and", "or"]).optional(),
});

export const getPersonsSchema = searchParamsSchema;

export type GetPersonsSchema = z.infer<typeof getPersonsSchema>;

export const createPersonSchema = z.object({
    dni: z.string().min(8, "El DNI debe tener al menos 8 caracteres").max(8, "El DNI debe tener máximo 8 caracteres"),
    apellidos: z.string().min(3, "Los apellidos deben tener al menos 3 caracteres"),
    nombres: z.string().min(3, "Los nombres deben tener al menos 3 caracteres"),
    email: z.string().email("El email no es válido").optional(),
    telefono: z.string().min(9, "El teléfono debe tener al menos 9 caracteres").max(9, "El teléfono debe tener máximo 9 caracteres").optional(),
    direccion: z.string().min(3, "La dirección debe tener al menos 3 caracteres").optional(),
});

export type CreatePersonSchema = z.infer<typeof createPersonSchema>;

export const updatePersonSchema = z.object({
    dni: z.string().min(8, "El DNI debe tener al menos 8 caracteres").max(8, "El DNI debe tener máximo 8 caracteres"),
    apellidos: z.string().min(3, "Los apellidos deben tener al menos 3 caracteres"),
    nombres: z.string().min(3, "Los nombres deben tener al menos 3 caracteres"),
    email: z.string().email("El email no es válido").optional(),
    telefono: z.string().min(9, "El teléfono debe tener al menos 9 caracteres").max(9, "El teléfono debe tener máximo 9 caracteres").optional(),
    direccion: z.string().min(3, "La dirección debe tener al menos 3 caracteres").optional(),
});

export type UpdatePersonSchema = z.infer<typeof updatePersonSchema>;