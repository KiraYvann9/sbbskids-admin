import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useModalStore } from "@/stores/useModalStore"

export const Modal  = ({
    modalTile,
   }: {
    modalType: string,
    modalTile: string,
}) =>{

    const {isModalOpen, closeModal } = useModalStore();

    return (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{modalTile}</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}