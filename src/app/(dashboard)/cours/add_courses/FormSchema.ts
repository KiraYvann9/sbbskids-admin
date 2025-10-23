import {z} from "zod";

export const FormSchema = z.object({
    title: z.string(),
    level_id: z.string(),
    libelle: z.string().optional(),
    objectif: z.string(),
    guide_for_parents: z.string(),
    introduction: z.string(),
    module_id: z.string(),

    activities: z.array(
        z.object({
            title: z.string().min(1, "Le titre de l'activité est requis"),
            libelle: z.string().optional(),
            description: z.string().min(1, "La description est requise"),
        })
    ).min(1, "Au moins une activité est requise"),

    supports: z.array(
        z.object({
            type: z.enum(['pdf', 'video']).describe("Le type de support est requis"),
            libelle: z.string().min(1, "Le titre du support est requis"),
            url: z.string().url("URL invalide").or(z.string().length(0)),
            file: z.any().optional(), // Pour les fichiers uploadés
        })
    ).min(1, "Au moins un support est requis"),
    conclusion: z.string().min(1, "La conclusion est requise"),
});


export type FormSchemaType = z.infer<typeof FormSchema>;