import {z} from "zod";

export const FormSchema = z.object({
    name: z.string({message: 'Le titre est requis'}).min(3, {message: 'Au moins 3 caractères'}),
    level_id: z.string().min(1, {message: 'Selectionnez la tranche d\'âge'}),
    applications: z.string().optional(),
});


export type FormSchemaType = z.infer<typeof FormSchema>;