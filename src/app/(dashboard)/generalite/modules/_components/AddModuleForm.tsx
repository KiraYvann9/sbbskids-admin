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
import {useState} from "react";
import { BookOpen, FileText, PlusCircle } from "lucide-react";


export const AddModuleForm = () => {
    const queryClient = useQueryClient();

    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>()

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

    const mutation = useMutation({
        mutationFn: async (data: FormSchemaType) => {
            return await postData("admin/modules", data);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["modules"]});
            form.reset();
            toast.success("Module ajouté avec succès!");
        },
    });

    const onSubmit = (data: FormSchemaType) => {
        mutation.mutate({...data, level_id: selectedAgeGroup as string});
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1f2043] to-indigo-900 p-6">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Ajouter un Module</h2>
                        <p className="text-indigo-200 text-sm mt-1">Renseignez les informations du nouveau module</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Section Informations du Module */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                                <BookOpen className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-base font-semibold text-gray-800">Informations du Module</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    name="name"
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Titre *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <Input
                                                        type="text"
                                                        placeholder="Ex: Initiation à la programmation"
                                                        className="h-11 pl-10 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="level_id"
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Tranche d'âge *</FormLabel>
                                            <Select onValueChange={(value: string)=>{
                                                const selected = LevelData?.find((item:{age_group: string, id:string})=>item.age_group === value)
                                                if(selected) {
                                                    field.onChange(value)
                                                    setSelectedAgeGroup(selected.id)
                                                }
                                            }} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors">
                                                        <SelectValue placeholder="Sélectionner la tranche d'âge"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {LevelData && LevelData.map((g: {age_group: string, id: string}) => (
                                                        <SelectItem key={g.id} value={g.age_group}>{g.age_group} ans</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="applications"
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel className="text-sm font-medium text-gray-700">Description *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                    <Textarea
                                                        placeholder="Décrivez le module..."
                                                        className="min-h-28 pl-10 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <Button
                                type="submit"
                                className="gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <>
                                        <Spinner />
                                        <span>Ajout en cours...</span>
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="w-5 h-5" />
                                        <span>Ajouter le module</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};
