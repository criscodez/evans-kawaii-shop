import * as z from "zod";
import { Decimal } from "decimal.js";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  id: z.string().optional(),
  nombre: z.string().optional(),
  costo: z.number().optional(),
  utilidad: z.number().optional(),
  precio: z.number().optional(),
  stockTotal: z.number().optional(),
  estado: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

export const getProductsSchema = searchParamsSchema;

export type GetProductsSchema = z.infer<typeof getProductsSchema>;

export const createProductSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  costo: z
    .string()
    .or(z.number())
    .refine((value) => {
      try {
        return new Decimal(value);
      } catch (error) {
        return false;
      }
    }, "Debe ser una cantidad válida")
    .transform((value) => new Decimal(value).toNumber()),
  utilidad: z
    .string()
    .or(z.number())
    .refine((value) => {
      try {
        return new Decimal(value);
      } catch (error) {
        return false;
      }
    }, "Debe ser una cantidad válida")
    .transform((value) => new Decimal(value).toNumber()),
  unidadMayor: z.string().min(1, "Elige una unidad"),
  unidadMenor: z.string().min(1, "Elige una unidad"),
  stockTotal: z.number().refine((value) => !isNaN(value), {
    message: "El stock total debe ser un número",
  }),
  stockMinimo: z.number().refine((value) => !isNaN(value), {
    message: "El stock mínimo debe ser un número",
  }),
  categoria: z.string().min(1, "Elige una categoría"),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  costo: z
    .string()
    .or(z.number())
    .refine((value) => {
      try {
        return new Decimal(value);
      } catch (error) {
        return false;
      }
    }, "Debe ser una cantidad válida")
    .transform((value) => new Decimal(value).toNumber()),
  utilidad: z
    .string()
    .or(z.number())
    .refine((value) => {
      try {
        return new Decimal(value);
      } catch (error) {
        return false;
      }
    }, "Debe ser una cantidad válida")
    .transform((value) => new Decimal(value).toNumber()),
  unidadMayor: z.string().min(1, "Elige una unidad"),
  unidadMenor: z.string().min(1, "Elige una unidad"),
  stockTotal: z.number().refine((value) => !isNaN(value), {
    message: "El stock total debe ser un número",
  }),
  stockMinimo: z.number().refine((value) => !isNaN(value), {
    message: "El stock mínimo debe ser un número",
  }),
  categoria: z.string().min(1, "Elige una categoría"),
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
