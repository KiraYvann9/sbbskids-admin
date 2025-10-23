"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {FormSchema, type FormSchemaType} from "./FormSchema";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Spinner} from "@/components/Spinner";
import {fetchData, postData} from "@/services/service";


export const AddModuleForm = () => {
    const queryClient = useQueryClient();

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            applications: "",
            level_id: ""
        },
    });

    const {data: LevelData} = useQuery({
        queryKey: ['age_group'],
        queryFn: async () => {
            const response = await fetchData('admin/levels')
            return response?.levels
        },
    })

    console.log('LevelData: ', LevelData)

    const mutation = useMutation({
        mutationFn: async (data: FormSchemaType) => {

            // Adjust endpoint according to backend conventions
            return await postData("admin/modules", data);

        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["modules"]});
            form.reset();
            toast.success("Module ajouté avec succès!");
        },
    });

    const onSubmit = (data: FormSchemaType) => {
        mutation.mutate(data);
        // console.log(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <fieldset className="w-full p-4 bg-white drop-shadow-sm flex items-end space-x-2 rounded-sm">
                    <legend className="text-lg font-medium mb-2 p-2 text-white bg-[#1f2043]">Ajouter un module</legend>

                    <FormField
                        name="name"
                        control={form.control}
                        render={({field}) => (
                            <FormItem className="flex-1 flex-col">
                                <FormLabel htmlFor="name" className="text-muted-foreground">Titre *</FormLabel>
                                <FormControl>
                                    <Input type="text" id="name" className="h-12" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="level_id"
                        control={form.control}
                        render={({field}) => (
                            <FormItem className="flex-1 flex-col">
                                <FormLabel htmlFor="age_group" className="text-muted-foreground">Tranche d'âge</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="min-h-12 flex w-full">
                                            <SelectValue placeholder="Sélectionner la tranche d'âge"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {LevelData && LevelData.map((g: {age_group: string, id: string}) => (
                                            <SelectItem key={g.id} value={g.id}>{g.age_group} ans</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="applications"
                        control={form.control}
                        render={({field}) => (
                            <FormItem className="flex-1 flex-col">
                                <FormLabel htmlFor="description" className="text-muted-foreground">Description
                                    *</FormLabel>
                                <FormControl>
                                    <Textarea id="description" className="min-h-12" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="h-12 bg-green-500" disabled={mutation.isPending}>
                        {mutation.isPending ? <Spinner/> : "Ajouter"}
                    </Button>
                </fieldset>
            </form>
        </Form>
    );
};
