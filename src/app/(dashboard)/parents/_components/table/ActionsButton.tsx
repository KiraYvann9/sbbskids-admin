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

import {deleteParent} from "./actions";
import {toast} from "react-hot-toast";
import {Spinner} from "@/components/Spinner";

export const ActionsButton = ({id}: {id: number}) =>{
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: number) => deleteParent(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['parents']})
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Make a copy</DropdownMenuItem>
                        <DropdownMenuItem>Favorite</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => mutation.mutate(id)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        </>
    )
}