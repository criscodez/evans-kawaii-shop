import * as z from "zod";;

export const signInSchema = z.object({
    username: z.string({ required_error: "Este campo usuario es requerido." }).min(3, "Los nombres de usuario deben tener al menos 3 caracteres"),
    password: z.string({ required_error: "Este campo contraseña es requerido." }).min(8, "Las contraseñas deben tener al menos 8 caracteres"),
});

export type SignInSchema = z.infer<typeof signInSchema>;