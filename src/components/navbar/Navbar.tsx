'use client'

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut, Menu } from "lucide-react";

import {useAdminStore} from "@/stores/adminStore"
import { useMutation } from "@tanstack/react-query";

function capitalize(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const Navbar = () => {
    const router = useRouter()
    const { logout } = useAdminStore();

    const {mutate} = useMutation({
        mutationFn: () => logout(),
        onSuccess: () =>{
            router.push('/')
            localStorage.clear()
        }

    })

    const pathname = usePathname();
    const pageName = capitalize(pathname.replace("/", "") || "Dashboard");

    return (
        <div className="w-full h-20 flex items-center justify-between px-8 bg-white border-b border-gray-200 sticky top-0 z-[999] shadow-sm">
            {/* Section gauche - Titre de la page */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="hidden sm:block w-1 h-8 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{pageName}</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Gestion et administration</p>
                    </div>
                </div>
            </div>

            {/* Section droite - Actions */}
            <div className="flex items-center gap-3">
                {/* Informations utilisateur (optionnel) */}
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        A
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold text-gray-800">Admin</p>
                        <p className="text-xs text-gray-500">Administrateur</p>
                    </div>
                </div>

                {/* Bouton de déconnexion */}
                <Button
                    variant="outline"
                    onClick={() => mutate()}
                    className="gap-2 border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group"
                >
                    <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    <span className="hidden sm:inline font-medium">Déconnexion</span>
                </Button>
            </div>
        </div>
    );
};