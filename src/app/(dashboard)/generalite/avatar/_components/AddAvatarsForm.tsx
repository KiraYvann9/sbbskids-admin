"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { avatarsSchema, AvatarsFormValues } from "./schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/Spinner";
import { postData } from "@/services/service";
import { Upload, ImagePlus, Plus } from "lucide-react";
import { useState } from "react";

export const AddAvatarsForm = () => {
    const queryClient = useQueryClient();
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const form = useForm<AvatarsFormValues>({
        resolver: zodResolver(avatarsSchema),
        defaultValues: {
            avatar: undefined,
            description: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: AvatarsFormValues) => {
            const formData = new FormData();

            const files = Array.isArray(data.avatar)
                ? data.avatar
                : (data.avatar as unknown as FileList | File);

            if (files instanceof FileList) {
                Array.from(files).forEach((file) => formData.append("avatars[]", file));
            } else if (Array.isArray(files)) {
                files.forEach((file) => file && formData.append("avatars[]", file));
            } else if (files instanceof File) {
                formData.append("avatars[]", files);
            }

            if (data.description) formData.append("description", data.description);

            return await postData("admin/avatars", formData);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["avatars"] });
            form.reset();
            setPreviewUrls([]);
            toast.success("Avatars ajoutés avec succès!");
        },
        onError: (error) => {
            console.error("Erreur lors de l'ajout des avatars:", error);
            toast.error("Erreur lors de l'ajout des avatars.");
        },
    });

    const onSubmit = (values: AvatarsFormValues) => {
        mutation.mutate(values);
    };

    const handleFileChange = (files: FileList | null) => {
        if (files) {
            // Créer les previews
            const urls = Array.from(files).map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);

            // Nettoyer les anciennes URLs
            return () => urls.forEach(url => URL.revokeObjectURL(url));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1f2043] to-indigo-900 p-6">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <ImagePlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Ajouter des Avatars</h2>
                        <p className="text-indigo-200 text-sm mt-1">Téléchargez un ou plusieurs avatars</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Upload section */}
                        <FormField
                            name="avatar"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Images * <span className="text-xs text-gray-500">(Un ou plusieurs fichiers)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                id="images"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => {
                                                    field.onChange(e.target.files);
                                                    handleFileChange(e.target.files);
                                                }}
                                            />
                                            <label
                                                htmlFor="images"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-indigo-400 transition-all duration-200 group"
                                            >
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                                    <p className="text-sm text-gray-600 group-hover:text-indigo-600 font-medium">
                                                        Cliquez pour sélectionner des images
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, JPEG (Max. 10MB par fichier)
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Preview section */}
                        {previewUrls.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-700">
                                    Aperçu ({previewUrls.length} fichier{previewUrls.length > 1 ? "s" : ""})
                                </h3>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200 group-hover:border-indigo-400 transition-colors shadow-sm"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Description <span className="text-xs text-gray-500">(optionnel)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            id="description"
                                            placeholder="Ajoutez une description pour ces avatars..."
                                            className="min-h-20 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Submit button */}
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
                                        <Plus className="w-5 h-5" />
                                        <span>Ajouter les avatars</span>
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