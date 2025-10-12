import {z} from "zod"

export const schema = z.object({
  id: z.number(),
  user_id: z.number(),
    avatar_url: z.string(),
    avar: z.string(),
  name: z.string(),
  email: z.string(),
  gender: z.string(),
  phone_number: z.string(),
  number_whatsapp: z.string(),
  students: z.array(z.object({})),
  updated_at: z.string(),
  created_at: z.string(),
})