import { z } from "zod";

export const schema = z.object({
    id: z.number(),
    name: z.string(),
    age_group: z.string(),
    image: z.string(),
    image_url: z.string(),
    description: z.string(),
    modules: z.array(z.object({})),
});