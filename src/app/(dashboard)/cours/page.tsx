'use client'

import {Form} from "@/components/ui/form";
import {niveauScheme} from "./schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

export default function Courses() {

    const levelForm = useForm<z.infer<typeof niveauScheme>>({
        resolver: zodResolver(niveauScheme),
        defaultValues: {
            niveau: '4-7'
        }
    })

    const onLevelSubmit = () => {

    }
    return(
        <div>
            <h1>Ajout de cours</h1>

            <Form {...levelForm}>
                <form onSubmit={levelForm.handleSubmit(onLevelSubmit)}>
                    <fieldset>Ajouter un niveau</fieldset>
                </form>
            </Form>
        </div>
    )
}