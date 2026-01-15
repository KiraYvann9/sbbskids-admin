"use client";

import Link from "next/link";
import { sidebarItems, sidebarItemTypes } from "./SidebarItems";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const ItemLink = ({ item, pathname }: { item: sidebarItemTypes; pathname: string }) => {
    const isActive = item.href && pathname === item.href;
    return (
        <Link
            href={item.href || "#"}
            className={cn(
                `flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg ease-in-out transition-all duration-200 group relative overflow-hidden`,
                {
                    "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30": !!isActive,
                    "pointer-events-none opacity-50": !item.href,
                }
            )}
        >
            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />

            <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                { "text-white": !!isActive }
            )} />
            <span className="font-medium text-sm relative z-10">{item.title}</span>
        </Link>
    );
};

const AccordionItem = ({ item, pathname }: { item: sidebarItemTypes; pathname: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    const handleClick = () => {
        if (hasChildren) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-1">
                <div className="flex-1">
                    <ItemLink item={item} pathname={pathname} />
                </div>
                {hasChildren && (
                    <button
                        onClick={handleClick}
                        className={cn(
                            "p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200",
                            { "text-indigo-400 bg-white/5": isOpen }
                        )}
                        aria-label={isOpen ? "Fermer" : "Ouvrir"}
                    >
                        {isOpen ?
                            <ChevronDown size={18} className="transition-transform duration-200" /> :
                            <ChevronRight size={18} className="transition-transform duration-200" />
                        }
                    </button>
                )}
            </div>

            {hasChildren && isOpen && (
                <div className="ml-4 mt-2 pl-4 border-l-2 border-indigo-500/30 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200">
                    {item.children?.map((child) => (
                        <ItemLink key={child.title} item={child} pathname={pathname} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const SidebarComponent = () => {
    const pathname = usePathname();

    return (
        <div className="w-64 min-h-screen h-full bg-gradient-to-b from-[#1f2043] via-[#1a1b3a] to-[#15162e] text-white flex flex-col shadow-2xl border-r border-white/10">
            {/* Header avec logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex justify-center bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Image
                        src="/assets/logo_sbbskids.svg"
                        alt="Logo"
                        width={100}
                        height={100}
                        priority={true}
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <div className="flex flex-col gap-2">
                    {sidebarItems.map((item: sidebarItemTypes) => (
                        <AccordionItem key={item.title} item={item} pathname={pathname} />
                    ))}
                </div>
            </nav>

            {/* Footer décoratif */}
            <div className="p-4 border-t border-white/10">
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg p-3 border border-indigo-500/30">
                    <p className="text-xs text-gray-400 text-center">
                        © 2024 SBBS Kids
                    </p>
                </div>
            </div>
        </div>
    );
}