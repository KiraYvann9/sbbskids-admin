import { z } from "zod";

export const avatarsSchema = z.object({
  avatar: z
    .any()
    .refine((files) => {
      if (!files) return false;
      if (Array.isArray(files)) {
        return files.length > 0 && files.every((f) => f instanceof File);
      }
      // allow FileList from input
      if (typeof files === 'object' && files !== null && 'length' in files) {
        return (files as FileList).length > 0;
      }
      return files instanceof File;
    }, {
      message: "Veuillez sélectionner au moins une image",
    }),
  description: z.string().optional(),
});

export type AvatarsFormValues = z.infer<typeof avatarsSchema>;
