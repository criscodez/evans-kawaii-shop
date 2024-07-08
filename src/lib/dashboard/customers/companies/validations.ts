import * as z from "zod";

export const searchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    id: z.string().optional(),
    nombre: z.string().optional(),
    ruc: z.string().optional(),
    email: z.string().optional(),
    telefono: z.string().optional(),
    direccion: z.string().optional(),
    operator: z.enum(["and", "or"]).optional(),
});

export const getCompaniesSchema = searchParamsSchema;

export type GetCompaniesSchema = z.infer<typeof getCompaniesSchema>;

export const createCompanySchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    ruc: z.string().min(11, "El RUC debe tener al menos 11 caracteres").max(11, "El RUC debe tener máximo 11 caracteres"),
    email: z.string().email("El email no es válido"),
    telefono: z.string().min(9, "El teléfono debe tener al menos 9 caracteres").max(9, "El teléfono debe tener máximo 9 caracteres"),
    direccion: z.string().min(3, "La dirección debe tener al menos 3 caracteres").optional(),
});

export type CreateCompanySchema = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    ruc: z.string().min(11, "El RUC debe tener al menos 11 caracteres").max(11, "El RUC debe tener máximo 11 caracteres"),
    email: z.string().email("El email no es válido"),
    telefono: z.string().min(9, "El teléfono debe tener al menos 9 caracteres").max(9, "El teléfono debe tener máximo 9 caracteres"),
    direccion: z.string().min(3, "La dirección debe tener al menos 3 caracteres").optional(),
});

export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;