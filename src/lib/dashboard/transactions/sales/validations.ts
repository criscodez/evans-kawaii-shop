import * as z from "zod";
import { Decimal } from "decimal.js";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  id: z.string().optional(),
  empleado: z.string().optional(),
  total: z.string().optional(),
  igv: z.string().optional(),
  fecha: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

export const getSalesSchema = searchParamsSchema;

export type GetSalesSchema = z.infer<typeof getSalesSchema>;

export const createSaleSchema = z.object({
  comprobante: z.string({ message: "El comprobante es requerido"}),
  clienteId: z.string().optional(),
  empleadoId: z.string().min(1, "El empleado es requerido"),
  total: z
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
  igv: z
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
  fecha: z.date({ message: "La fecha es requerida" }),
  numVenta: z.string(),
  productos: z.array(
        z.object({
        productoId: z.string().min(1, "El producto es requerido"),
        cantidad: z.number().min(1, "La cantidad es requerida"),
        subtotal: z.string()
            .or(z.number())
            .refine((value) => {
            try {
                return new Decimal(value);
            } catch (error) {
                return false;
            }
            }, "Debe ser una cantidad válida")
            .transform((value) => new Decimal(value).toNumber()),
        })
    ).min(1, "Los productos son requeridos"),
});

export type CreateSaleSchema = z.infer<typeof createSaleSchema>;