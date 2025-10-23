import {z} from "zod";

export const FormSchema = z.object({
    name: z.string(),
    level_id: z.string(),
    applications: z.string(),
});


export type FormSchemaType = z.infer<typeof FormSchema>;