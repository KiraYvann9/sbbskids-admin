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
                `flex items-center gap-2 p-2 text-white/75 hover:bg-gray-100 hover:text-[#1f2043] rounded-sm ease-in-out transition-colors duration-200`,
                {
                    "bg-gray-100 text-[#1f2043]": !!isActive,
                    "pointer-events-none opacity-70": !item.href,
                }
            )}
        >
            <item.icon />
            {item.title}
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
            <div className="flex items-center">
                <div className="flex-1">
                    <ItemLink item={item} pathname={pathname} />
                </div>
                {hasChildren && (
                    <button
                        onClick={handleClick}
                        className="p-2 text-white/75 hover:text-white transition-colors"
                        aria-label={isOpen ? "Fermer" : "Ouvrir"}
                    >
                        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                )}
            </div>

            {hasChildren && isOpen && (
                <div className="ml-6 mt-1 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200">
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
        <div className="w-60 border-r min-h-screen h-full p-4 bg-[#1f2043] text-white flex flex-col gap-14">
            <div className="flex justify-center bg-white p-2 rounded-sm">
                <Image
                    src="/assets/logo_sbbskids.svg"
                    alt="Logo"
                    width={100}
                    height={100}
                    priority={true}
                />
            </div>
            <div className="flex flex-col gap-2 self-center w-full">
                {sidebarItems.map((item: sidebarItemTypes) => (
                    <AccordionItem key={item.title} item={item} pathname={pathname} />
                ))}
            </div>
        </div>
    );
};
