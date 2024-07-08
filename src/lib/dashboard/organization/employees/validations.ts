import * as z from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  id: z.string().optional(),
  dni: z.string().optional(),
  apellidos: z.string().optional(),
  nombres: z.string().optional(),
  sexo: z.string().optional(),
  email: z.string().optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

export const getEmployeesSchema = searchParamsSchema;

export type GetEmployeesSchema = z.infer<typeof getEmployeesSchema>;

export const createEmployeeSchema = z.object({
  dni: z
    .string()
    .min(8, "El DNI debe tener al menos 8 caracteres")
    .max(8, "El DNI debe tener máximo 8 caracteres"),
  apellidos: z
    .string()
    .min(3, "Los apellidos deben tener al menos 3 caracteres"),
  nombres: z.string().min(3, "Los nombres deben tener al menos 3 caracteres"),
  fechaNacimiento: z.date(),
  sexo: z.string().min(3, "Seleccione un sexo"),
  email: z.string().email("El email no es válido").optional(),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener al menos 9 caracteres")
    .max(9, "El teléfono debe tener máximo 9 caracteres")
    .optional(),
  direccion: z
    .string()
    .min(3, "La dirección debe tener al menos 3 caracteres")
    .optional(),
});

export type CreateEmployeeSchema = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = z.object({
    dni: z
    .string()
    .min(8, "El DNI debe tener al menos 8 caracteres")
    .max(8, "El DNI debe tener máximo 8 caracteres"),
  apellidos: z
    .string()
    .min(3, "Los apellidos deben tener al menos 3 caracteres"),
  nombres: z.string().min(3, "Los nombres deben tener al menos 3 caracteres"),
  // No tiene que ser menor de 18 años
  fechaNacimiento: z.date().refine(
    (value) => {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
      }
      return age;
    },
    {
      message: "El empleado debe ser mayor de 18 años",
    }
  ),
  sexo: z.string().min(3, "Seleccione un sexo"),
  email: z.string().email("El email no es válido").optional(),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener al menos 9 caracteres")
    .max(9, "El teléfono debe tener máximo 9 caracteres")
    .optional(),
  direccion: z
    .string()
    .min(3, "La dirección debe tener al menos 3 caracteres")
    .optional(),
});

export type UpdateEmployeeSchema = z.infer<typeof updateEmployeeSchema>;
