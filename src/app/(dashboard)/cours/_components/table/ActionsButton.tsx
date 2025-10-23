'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {IconDotsVertical} from "@tabler/icons-react";
import * as React from "react";
import {useMutation} from "@tanstack/react-query";
import {useQueryClient} from "@tanstack/react-query";

import {deleteCourse} from "./actions";
import {toast} from "react-hot-toast";
import {Spinner} from "@/components/Spinner";
import {schema} from "./Schema";

import {useModalStore} from "@/stores/useModalStore"

export const ActionsButton = ({data}: {data: schema}) =>{

    const { openModal } = useModalStore();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: number) => deleteCourse(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['courses']})
            toast.success("Le formateur à été supprimé ");
        },
        onError: (error) => { console.log(error) }
    });

    return (
        <>
            { mutation.isPending ? <Spinner /> :

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                            size="icon"
                        >
                            <IconDotsVertical />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                            onClick={() => openModal(true, data)}
                        >Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Détail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => mutation.mutate(data.id)}
                        >
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        </>
    )
}