import { create } from "zustand";

type modalType = {
    isModalOpen: boolean,
    closeModal: () => void,
    openModal: (isOpen: boolean, data: Record<string, any>) => void,
    data: Record<string, any>,
}

export const useModalStore = create<modalType>()((set)=>({
    isModalOpen: false,
    data: {},
    closeModal: () => (set({isModalOpen: false})),
    openModal: ( isOpen, data ) => (set({isModalOpen: isOpen, data: data})),
}))