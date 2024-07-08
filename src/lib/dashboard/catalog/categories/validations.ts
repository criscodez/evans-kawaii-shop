import * as z from "zod";

export const searchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    id: z.string().optional(),
    nombre: z.string().optional(),
    operator: z.enum(["and", "or"]).optional(),
});

export const getCategoriesSchema = searchParamsSchema;

export type GetCategoriesSchema = z.infer<typeof getCategoriesSchema>;

export const createCategorySchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;