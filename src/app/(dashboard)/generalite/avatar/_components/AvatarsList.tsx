"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/services/service";
import { Spinner } from "@/components/Spinner";
import { Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
// import {handleDelete} from "@tiptap/extension-list";

// Define a minimal shape; adjust if backend differs
export type AvatarItem = {
    id?: string | number;
    url?: string;
    image_url?: string;
    path?: string;
    avatar_url?: string;
    avatar?: string;
    description?: string | null;
};

type AvatarsResponse = AvatarItem[] | { data: AvatarItem[] } | { avatars: AvatarItem[] } | { avatars: { avatar_url?: string; id?: number | string }[] };

function resolveItems(payload: AvatarsResponse): AvatarItem[] {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === "object") {
        if (Array.isArray((payload as any).data)) return (payload as any).data;
        if (Array.isArray((payload as any).avatars)) return (payload as any).avatars;
    }

    return [];
}

function resolveImageUrl(item: AvatarItem): string | null {
    return (
        item.avatar_url ||
        item.url ||
        item.image_url ||
        item.path ||
        item.avatar ||
        null
    );
}

export const AvatarsList = () => {
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState<string | number | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["avatars"],
        queryFn: async () => fetchData("admin/avatars"),
    });

    // const deleteMutation = useMutation({
    //     mutationFn: async (id: string | number) => {
    //         return await deleteData(`admin/avatars/${id}`);
    //     },
    //     onMutate: (id) => {
    //         setDeletingId(id);
    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ["avatars"] });
    //         toast.success("Avatar supprimé avec succès!");
    //         setDeletingId(null);
    //     },
    //     onError: (error) => {
    //         console.error("Erreur lors de la suppression:", error);
    //         toast.error("Erreur lors de la suppression de l'avatar.");
    //         setDeletingId(null);
    //     },
    // });

    // const handleDelete = (id: string | number) => {
    //     if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avatar ?")) {
    //         deleteMutation.mutate(id);
    //     }
    // };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
                <Spinner />
                <span className="text-gray-600 text-sm">Chargement des avatars...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                    <h3 className="font-semibold text-red-800">Erreur de chargement</h3>
                    <p className="text-sm text-red-600">
                        Une erreur s'est produite lors du chargement des avatars.
                    </p>
                </div>
            </div>
        );
    }

    const items = resolveItems(data as AvatarsResponse);

    if (!items || items.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun avatar trouvé</h3>
                <p className="text-sm text-gray-500">Commencez par ajouter votre premier avatar.</p>
            </div>
        );
    }

    // Sort items by ID in descending order without mutating the original array
    const sortedItems = [...items].sort((a, b) => {
        const toNum = (v: unknown) => {
            if (typeof v === "number") return v;
            if (typeof v === "string") {
                const n = Number(v);
                return isNaN(n) ? -Infinity : n;
            }
            return -Infinity; // items without valid id will sink to the end
        };
        return toNum(b.id) - toNum(a.id);
    });

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {sortedItems.map((item, idx) => {
                const src = resolveImageUrl(item);
                const key = (item.id ?? idx).toString();
                const isDeleting = deletingId === item.id;

                return (
                    <div
                        key={key}
                        className="group relative bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 p-4 flex flex-col items-center transition-all duration-200 hover:scale-105"
                    >
                        {/* Badge ID */}
                        <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            #{item.id ?? key}
                        </div>

                        {/* Bouton de suppression */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => item.id && console.log(item.id)}
                            disabled={isDeleting}
                            className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <Spinner />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                        </Button>

                        {/* Avatar Image */}
                        {src ? (
                            <div className="relative w-24 h-24 mb-3">
                                <img
                                    src={src}
                                    alt={item.description ?? `Avatar ${key}`}
                                    className="w-24 h-24 object-cover rounded-full border-4 border-gray-200 group-hover:border-indigo-400 transition-colors shadow-md"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 mb-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-gray-200 group-hover:border-indigo-400 transition-colors" />
                        )}

                        {/* Description */}
                        {item.description ? (
                            <p className="text-sm text-center text-gray-600 line-clamp-2 font-medium">
                                {item.description}
                            </p>
                        ) : (
                            <p className="text-sm text-center text-gray-400 italic">Sans description</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};