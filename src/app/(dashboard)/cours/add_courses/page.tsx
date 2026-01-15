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
import {FileText, Plus, Trash2, Video, BookOpen, Target, Users, Save, RotateCcw} from "lucide-react";
import {router} from "next/client";

export default function AddCoursePage() {

    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('');
    const [selectedModuleID, setSelectedModuleID] = useState<string>('');

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

    const {data: modules, isLoading: isModulesLoading} = useQuery({
        queryKey: ['age_group_modules', 'level_id'],
        queryFn: async () => {
            if (!selectedAgeGroup) return [];
            const response = await fetchData(`admin/modules/age-group/${form.getValues('level_id')}`);
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
        mutation.mutate({...data, level_id: selectedAgeGroup, module_id: selectedModuleID});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#1f2043] to-indigo-900 p-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Création de Cours</h1>
                                    <p className="text-indigo-200 text-sm mt-1">Remplissez les informations du nouveau cours</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Section Informations Générales */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                                    <Target className="w-5 h-5 text-indigo-600" />
                                    <h2 className="text-lg font-semibold text-gray-800">Informations Générales</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField
                                        name="level_id"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Tranche d'âge
                                                </FormLabel>
                                                <Select onValueChange={(value)=>{
                                                    const selectedItem = LevelData.find((item: {age_group: string, id: number})=>item.age_group === value)
                                                    if(selectedItem) {
                                                        field.onChange(selectedItem.age_group)
                                                        setSelectedAgeGroup(selectedItem.id)
                                                    }
                                                }} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors">
                                                            <SelectValue placeholder="Sélectionner la tranche d'âge" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-white">
                                                        {LevelData && LevelData.map((g: { age_group: string, id: string }) => (
                                                            <SelectItem key={g.id} value={g.age_group} className="hover:bg-indigo-50">
                                                                {g.age_group} ans
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="title"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Titre de la leçon *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        className="h-11 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                                                        placeholder="Ex: Introduction à la programmation"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="module_id"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">Module</FormLabel>
                                                <Select
                                                    onValueChange={(value: string)=>{
                                                        const selected = modules.find((item: {name: string, id: string} )=> item.name === value)
                                                        setSelectedModuleID(selected.id)
                                                        field.onChange(value)
                                                    }}
                                                    value={field.value}
                                                    disabled={!selectedAgeGroup || isModulesLoading}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors">
                                                            <SelectValue placeholder={
                                                                !selectedAgeGroup
                                                                    ? "Sélectionnez d'abord une tranche d'âge"
                                                                    : isModulesLoading
                                                                        ? 'Chargement...'
                                                                        : "Sélectionner un module"
                                                            } />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-white">
                                                        {modules && modules.length > 0 ? (
                                                            modules.map((g: { name: string, id: string }) => (
                                                                <SelectItem key={g.id} value={g.name} className="hover:bg-indigo-50">
                                                                    {g.name}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <div className="px-2 py-1.5 text-sm text-gray-500">
                                                                Aucun module pour cette tranche d'âge
                                                            </div>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    name="objectif"
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Objectif Pédagogique Fondamental *
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="min-h-24 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors resize-none"
                                                    placeholder="Décrivez l'objectif principal de ce cours..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Section Guides et Introduction */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                                    <Users className="w-5 h-5 text-indigo-600" />
                                    <h2 className="text-lg font-semibold text-gray-800">Guides et Introduction</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        name="guide_for_parents"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Guide pour les parents *
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="border border-gray-300 rounded-lg hover:border-indigo-400 focus-within:border-indigo-500 transition-colors overflow-hidden">
                                                        <TiptapEditor
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Écrivez ici les instructions pour les parents..."
                                                            className="bg-gray-50"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="introduction"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">Introduction</FormLabel>
                                                <FormControl>
                                                    <div className="border border-gray-300 rounded-lg hover:border-indigo-400 focus-within:border-indigo-500 transition-colors overflow-hidden">
                                                        <TiptapEditor
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Écrivez l'introduction du cours..."
                                                            className="bg-gray-50"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Section Activités */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-indigo-100 p-2 rounded-lg">
                                            <BookOpen className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-800">Activités du cours</h2>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => appendActivity({title: "", description: "", libelle: ""})}
                                        className="gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 shadow-md hover:shadow-lg transition-all"
                                    >
                                        <Plus className="w-4 h-4"/>
                                        Ajouter une activité
                                    </Button>
                                </div>

                                {activityFields.map((field, index) => (
                                    <div key={field.id} className="border-2 border-gray-200 rounded-xl p-6 space-y-4 bg-gradient-to-br from-white to-gray-50 hover:border-indigo-300 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                                                    {index + 1}
                                                </div>
                                                <h4 className="font-semibold text-gray-700">Activité {index + 1}</h4>
                                            </div>
                                            {activityFields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeActivity(index)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`activities.${index}.title`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium text-gray-700">Titre de l'activité</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Ex: Quiz de compréhension"
                                                                className="bg-white border-gray-300 hover:border-indigo-400 focus:border-indigo-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`activities.${index}.libelle`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium text-gray-700">Libellé</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Ex: Exercice pratique"
                                                                className="bg-white border-gray-300 hover:border-indigo-400 focus:border-indigo-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name={`activities.${index}.description`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                                                    <FormControl>
                                                        <div className="border border-gray-300 rounded-lg hover:border-indigo-400 focus-within:border-indigo-500 transition-colors overflow-hidden">
                                                            <TiptapEditor
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholder="Description détaillée de l'activité..."
                                                                className="bg-white"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Section Supports */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <FileText className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-800">Supports de cours</h2>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => appendSupport({type: "pdf", libelle: "", url: ""})}
                                        className="gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 shadow-md hover:shadow-lg transition-all"
                                    >
                                        <Plus className="w-4 h-4"/>
                                        Ajouter un support
                                    </Button>
                                </div>

                                {supportFields.map((field, index) => (
                                    <div key={field.id} className="border-2 border-gray-200 rounded-xl p-6 space-y-4 bg-gradient-to-br from-white to-purple-50/30 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                                                    {index + 1}
                                                </div>
                                                <h4 className="font-semibold text-gray-700">Support {index + 1}</h4>
                                            </div>
                                            {supportFields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSupport(index)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
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
                                                    <FormLabel className="text-sm font-medium text-gray-700">Type de support</FormLabel>
                                                    <FormControl>
                                                        <div className="flex gap-6 p-4 bg-white rounded-lg border border-gray-200">
                                                            <label className="flex items-center gap-3 cursor-pointer hover:text-indigo-600 transition-colors">
                                                                <input
                                                                    type="radio"
                                                                    value="pdf"
                                                                    checked={field.value === "pdf"}
                                                                    onChange={field.onChange}
                                                                    className="w-4 h-4 text-indigo-600"
                                                                />
                                                                <FileText className="w-5 h-5"/>
                                                                <span className="font-medium">PDF</span>
                                                            </label>
                                                            <label className="flex items-center gap-3 cursor-pointer hover:text-indigo-600 transition-colors">
                                                                <input
                                                                    type="radio"
                                                                    value="video"
                                                                    checked={field.value === "video"}
                                                                    onChange={field.onChange}
                                                                    className="w-4 h-4 text-indigo-600"
                                                                />
                                                                <Video className="w-5 h-5"/>
                                                                <span className="font-medium">Vidéo</span>
                                                            </label>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`supports.${index}.libelle`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium text-gray-700">Titre du support</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Ex: Guide pratique"
                                                                className="bg-white border-gray-300 hover:border-indigo-400 focus:border-indigo-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`supports.${index}.url`}
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium text-gray-700">URL du support</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="https://example.com/support.pdf"
                                                                type="url"
                                                                className="bg-white border-gray-300 hover:border-indigo-400 focus:border-indigo-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-xs" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                            </div>
                                            <div className="relative flex justify-center">
                                                <span className="bg-white px-3 text-sm text-gray-500">ou</span>
                                            </div>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name={`supports.${index}.file`}
                                            render={({field: {value, onChange, ...field}}) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700">Uploader un fichier</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="file"
                                                            accept={form.watch(`supports.${index}.type`) === "pdf" ? ".pdf" : "video/*"}
                                                            onChange={(e) => onChange(e.target.files?.[0])}
                                                            className="cursor-pointer bg-white border-gray-300 hover:border-indigo-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100 transition-colors"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Section Conclusion */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                                    <BookOpen className="w-5 h-5 text-indigo-600" />
                                    <h2 className="text-lg font-semibold text-gray-800">Conclusion</h2>
                                </div>

                                <FormField
                                    name="conclusion"
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Conclusion du cours *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="min-h-24 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors resize-none"
                                                    placeholder="Résumez les points clés et perspectives..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <Button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    {mutation.isPending ? "Enregistrement en cours..." : "Enregistrer le cours"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.reset()}
                                    disabled={mutation.isPending}
                                    className="px-8 h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all gap-2"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    Réinitialiser
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};