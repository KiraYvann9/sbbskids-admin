import { z } from "zod";

export const levelSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }).max(100),
  age_group: z.string().min(1, { message: "Le groupe d'âge est requis" }),
  image: z
    .any()
    .refine((file) => file instanceof File || (Array.isArray(file) && file[0] instanceof File), {
      message: "L'image est requise",
    })
    .optional(),
  description: z.string().min(5, { message: "La description doit contenir au moins 5 caractères" }).max(500),
});

export type LevelFormValues = z.infer<typeof levelSchema>;
