"use client";

import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {FormSchema, type FormSchemaType} from "./FormSchema";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {fetchData, postData} from "@/services/service";

import {TiptapEditor} from "@/components";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {FileText, Plus, Trash2, Video} from "lucide-react";
import {router} from "next/client";

export default function AddCoursePage() {

    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('');

    const queryClient = useQueryClient();

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            objectif: "",
            libelle: "",
            level_id: "",
            module_id: "",
            guide_for_parents: '',
            introduction: '',
            activities: [{title: "", description: "", libelle: ''}],
            supports: [{type: "pdf", libelle: "", url: ""}],
            conclusion: ''
        },
    });

    const {fields: activityFields, append: appendActivity, remove: removeActivity} = useFieldArray({
        control: form.control,
        name: "activities",
    });

    const {fields: supportFields, append: appendSupport, remove: removeSupport} = useFieldArray({
        control: form.control,
        name: "supports",
    });

    const {data: LevelData} = useQuery({
        queryKey: ['age_group'],
        queryFn: async () => {
            const response = await fetchData('admin/levels')
            return response?.levels
        },
    })

    // Synchroniser selectedAgeGroup avec le level_id sélectionné
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'level_id' && value.level_id && LevelData) {
                const selected = LevelData.find((level: { age_group: string, id: string }) => level.id === value.level_id);
                if (selected?.age_group !== selectedAgeGroup) {
                    setSelectedAgeGroup(selected?.age_group || '');
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [form, LevelData, selectedAgeGroup]);

    const {data: modules, isLoading: isModulesLoading} = useQuery({
        queryKey: ['age_group_modules', selectedAgeGroup],
        queryFn: async () => {
            if (!selectedAgeGroup) return [];
            const response = await fetchData(`admin/modules/age-group/${selectedAgeGroup}`);
            return response?.modules || [];
        },
        enabled: !!selectedAgeGroup,
    })

    const mutation = useMutation({
        mutationFn: async (data: FormSchemaType) => {
            return await postData("admin/courses", data);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["courses"]});
            form.reset();
            toast.success("Cours ajouté avec succès!");
            await router.push("/cours");
        },
        onError: (error) => {
            console.error("Erreur lors de l'ajout du cours:", error);
            toast.error("Erreur lors de l'ajout du cours.");
        }
    });

    const onSubmit = (data: FormSchemaType) => {
        mutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-screen overflow-y-auto p-4">
                <fieldset className="w-full p-14 bg-white drop-shadow-sm flex flex-col items-end space-y-6 rounded-sm">
                    <legend className="text-lg font-medium mb-2 p-2 text-white bg-[#1f2043]">Ajout De Cours</legend>

                    <div className={'flex w-full gap-2'}>
                        <FormField
                            name="level_id"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="flex-1 flex-col">
                                    <FormLabel htmlFor="age_group" className="text-lg">Tranche d'âge</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="min-h-12 bg-gray-100 flex w-full">
                                                <SelectValue placeholder="Sélectionner la tranche d'âge" className={'bg-gray-100'}>
                                                    {field.value && LevelData ? LevelData.find((level: {id: string})=> level.id === field.value)?.age_group + ' ans' :"Sélectionner la tranche d\'âge"}
                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className={'bg-gray-100'}>
                                            {LevelData && LevelData.map((g: { age_group: string, id: string }) => (
                                                <SelectItem key={g.id} value={g.id}>{g.age_group} ans</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="title"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="flex-1 flex-col">
                                    <FormLabel htmlFor="name" className="text-lg">Titre de la leçon *</FormLabel>
                                    <FormControl>
                                        <Input type="text" id="name" className="h-12 bg-gray-100" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="module_id"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="flex-1 flex-col">
                                    <FormLabel htmlFor="module" className="text-lg">Module</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={!selectedAgeGroup || isModulesLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="min-h-12 flex w-full bg-gray-100">
                                                <SelectValue placeholder={
                                                    !selectedAgeGroup
                                                        ? "Sélectionnez d'abord une tranche d'âge"
                                                        : isModulesLoading
                                                            ? 'Chargement...'
                                                            : "Sélectionner un module"
                                                }/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {modules && modules.length > 0 ? (
                                                modules.map((g: { name: string, id: string }) => (
                                                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                                ))
                                            ) : (
                                                <div className="px-2 py-1.5 text-sm text-gray-500">
                                                    Aucun module pour cette tranche d'âge
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className={'flex w-full gap-2'}>
                        <FormField
                            name="objectif"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="flex-1 flex-col">
                                    <FormLabel htmlFor="description" className="text-lg">Objectif Pédagogique Fondamental *</FormLabel>
                                    <FormControl>
                                        <Textarea id="description" className="min-h-20 bg-gray-100 flex" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className={'flex w-full gap-2'}>
                        <FormField
                            name="guide_for_parents"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="flex-1 flex-col">
                                    <FormLabel className="text-lg">Guide pour les parents *</FormLabel>
                                    <FormControl>
                                        <TiptapEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={'Ecrivez ici'}
                                            className={'bg-gray-100'}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="introduction"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="flex-1 flex-col">
                                    <FormLabel className="text-lg">Introduction</FormLabel>
                                    <FormControl>
                                        <TiptapEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={'Ecrivez ici'}
                                            className={'bg-gray-100'}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/*Activités*/}
                    <div className="space-y-4 w-full">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Activités</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendActivity({title: "", description: "", libelle: ""})}
                                className="gap-2 bg-yellow-400 hover:bg-yellow-500"
                            >
                                <Plus className="w-4 h-4"/>
                                Ajouter une activité
                            </Button>
                        </div>

                        {activityFields.map((field, index) => (
                            <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-muted-foreground">Activité {index + 1}</h4>
                                    {activityFields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeActivity(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    )}
                                </div>

                                <FormField
                                    control={form.control}
                                    name={`activities.${index}.title`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Titre de l'activité</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Ex: Quiz de compréhension"
                                                       className={'bg-gray-100'}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`activities.${index}.libelle`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Libellé</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Ex: Quiz de compréhension"
                                                       className={'bg-gray-100'}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`activities.${index}.description`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <TiptapEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder={'Description de l\'activité'}
                                                    className={'bg-gray-100'}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                    </div>

                    {/*Supports*/}
                    <div className="space-y-4 w-full">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Supports de cours</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendSupport({type: "pdf", libelle: "", url: ""})}
                                className="gap-2 bg-yellow-400 hover:bg-yellow-500"
                            >
                                <Plus className="w-4 h-4"/>
                                Ajouter un support
                            </Button>
                        </div>

                        {supportFields.map((field, index) => (
                            <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-muted-foreground">Support {index + 1}</h4>
                                    {supportFields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSupport(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    )}
                                </div>

                                <FormField
                                    control={form.control}
                                    name={`supports.${index}.type`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Type de support</FormLabel>
                                            <FormControl>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            value="pdf"
                                                            checked={field.value === "pdf"}
                                                            onChange={field.onChange}
                                                            className="w-4 h-4"
                                                        />
                                                        <FileText className="w-5 h-5"/>
                                                        <span>PDF</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            value="video"
                                                            checked={field.value === "video"}
                                                            onChange={field.onChange}
                                                            className="w-4 h-4"
                                                        />
                                                        <Video className="w-5 h-5"/>
                                                        <span>Vidéo</span>
                                                    </label>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`supports.${index}.libelle`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Titre du support</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Ex: Guide pratique"
                                                       className={'bg-gray-100'}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`supports.${index}.url`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>URL du support</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="https://example.com/support.pdf"
                                                    type="url"
                                                    className={'bg-gray-100'}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <div className="text-center text-sm text-gray-500">ou</div>

                                <FormField
                                    control={form.control}
                                    name={`supports.${index}.file`}
                                    render={({field: {value, onChange, ...field}}) => (
                                        <FormItem>
                                            <FormLabel>Uploader un fichier</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="file"
                                                    accept={form.watch(`supports.${index}.type`) === "pdf" ? ".pdf" : "video/*"}
                                                    onChange={(e) => onChange(e.target.files?.[0])}
                                                    className="cursor-pointer bg-gray-100"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                    </div>

                    <div className={'flex w-full gap-2'}>
                        <FormField
                            name="conclusion"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="flex-1 flex-col">
                                    <FormLabel htmlFor="conclusion" className="text-lg">Conclusion *</FormLabel>
                                    <FormControl>
                                        <Textarea id="conclusion" className="min-h-20 bg-gray-100 flex" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg disabled:opacity-50"
                        >
                            {mutation.isPending ? "Enregistrement..." : "Enregistrer le cours"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                            disabled={mutation.isPending}
                            className="px-8 py-6 text-lg"
                        >
                            Réinitialiser
                        </Button>
                    </div>

                </fieldset>
            </form>
        </Form>
    );
};