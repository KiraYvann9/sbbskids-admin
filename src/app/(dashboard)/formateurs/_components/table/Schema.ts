import {z} from "zod"

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  gender: z.string(),
  phone_number: z.string(),
  number_whatsapp: z.string(),
  user_id: z.number(),
  admin_id: z.number(),
  updated_at: z.string(),
  created_at: z.string(),
})