import * as z from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  id: z.string().optional(),
  ruc: z.string().optional(),
  nombre: z.string().optional(),
  email: z.string().optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

export const getSuppliersSchema = searchParamsSchema;

export type GetSuppliersSchema = z.infer<typeof getSuppliersSchema>;

export const createSupplierSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    ruc: z.string().min(11, "El RUC debe tener al menos 11 caracteres").max(11, "El RUC debe tener máximo 11 caracteres"),
    email: z.string().email("El email no es válido"),
    telefono: z.string().min(9, "El teléfono debe tener al menos 9 caracteres").max(9, "El teléfono debe tener máximo 9 caracteres"),
    direccion: z.string().min(3, "La dirección debe tener al menos 3 caracteres"),
});

export type CreateSupplierSchema = z.infer<typeof createSupplierSchema>;

export const updateSupplierSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    ruc: z.string().min(11, "El RUC debe tener al menos 11 caracteres").max(11, "El RUC debe tener máximo 11 caracteres"),
    email: z.string().email("El email no es válido"),
    telefono: z.string().min(9, "El teléfono debe tener al menos 9 caracteres").max(9, "El teléfono debe tener máximo 9 caracteres"),
    direccion: z.string().min(3, "La dirección debe tener al menos 3 caracteres"),
});

export type UpdateSupplierSchema = z.infer<typeof updateSupplierSchema>;
