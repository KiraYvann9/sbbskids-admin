import {create} from "zustand";

interface Props {
    content: string;
    setContent: (content: string) => void;
    clearContent: () => void;
}

export const useTextEditorContent = create<Props>((set) => ({
    content: '',
    setContent: (content)=> set({content: content}),
    clearContent: () => set({content: ''}),
}))