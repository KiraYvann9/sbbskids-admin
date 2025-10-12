import { create } from "zustand";
import {schema} from "@/app/(dashboard)/formateurs/_components/table/Schema";
import { z  } from "zod";

type formateurType = {
    isEditMode?: boolean;
    setIsEditMode: (isEditMode: boolean, data: z.infer<typeof schema>) => void;
    formateur: z.infer<typeof schema> | null;
}

export const useFormateurStore = create<formateurType>()((set) => ({
    isEditmode : false,
    formateur: null,
    setIsEditMode : (isEditMode, data) => {set({ isEditMode, formateur: data })},
}))