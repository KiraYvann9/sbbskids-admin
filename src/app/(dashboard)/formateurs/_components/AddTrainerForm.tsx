"use client";

import {
    Form,
    FormControl,
    FormItem,
    FormField,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "@/services/service";
import toast from "react-hot-toast";

import { Spinner } from "@/components/Spinner";
import { UserPlus, Mail, Phone, User, MessageCircle } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    gender: z.string().min(3).max(100),
    phone_number: z.string().min(6).max(100),
    number_whatsapp: z.string().min(6).max(100),
});

export const AddTrainerForm = () => {
    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            gender: "",
            phone_number: "",
            number_whatsapp: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const response = await postData("trainer/trainers", data);
            return response;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["trainers"]});
            form.reset();
            toast.success("Formateur ajouté avec succès!");
        },
        onError: (error) => {
            console.error("Erreur lors de l'ajout du formateur:", error);
            toast.error("Erreur lors de l'ajout du formateur.");
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        mutation.mutate(data);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1f2043] to-indigo-900 p-6">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Ajouter un Formateur</h2>
                        <p className="text-indigo-200 text-sm mt-1">Remplissez les informations du nouveau formateur</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Section Informations Personnelles */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                                <User className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-base font-semibold text-gray-800">Informations Personnelles</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    name="name"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Nom complet *
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <Input
                                                        type="text"
                                                        placeholder="Ex: Jean Dupont"
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
                                    name="gender"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Genre *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors">
                                                        <SelectValue placeholder="Sélectionner le genre" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white">
                                                    <SelectItem value="male" className="hover:bg-indigo-50">
                                                        Homme
                                                    </SelectItem>
                                                    <SelectItem value="female" className="hover:bg-indigo-50">
                                                        Femme
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Section Coordonnées */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                                <Mail className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-base font-semibold text-gray-800">Coordonnées</h3>
                            </div>

                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Adresse email *
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    type="email"
                                                    placeholder="exemple@email.com"
                                                    className="h-11 pl-10 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    name="phone_number"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Numéro de téléphone *
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <Input
                                                        type="text"
                                                        placeholder="+225 XX XX XX XX XX"
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
                                    name="number_whatsapp"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Numéro WhatsApp *
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <Input
                                                        type="text"
                                                        placeholder="+225 XX XX XX XX XX"
                                                        className="h-11 pl-10 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors"
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
                                        <UserPlus className="w-5 h-5" />
                                        <span>Ajouter le formateur</span>
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