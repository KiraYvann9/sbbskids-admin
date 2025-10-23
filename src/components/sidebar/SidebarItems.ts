import {Book, Layers, LayoutDashboard, LucideIcon, Plus, Puzzle, Settings, User, Users} from "lucide-react"
import {IconChalkboardTeacher} from '@tabler/icons-react'
import React from "react";

export type sidebarItemTypes = {
  title: string;
  icon: LucideIcon | React.FC;
  href?: string;
  children?: sidebarItemTypes[];
};

export const sidebarItems: sidebarItemTypes[] = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        title: "Formateurs",
        icon: IconChalkboardTeacher,
        href: "/formateurs",
    },
    {
        title: "Cours",
        icon: Book,
        children: [
            {
                title: "Liste des cours",
                icon: Layers,
                href: "/cours",
            },
            {
                title: "Ajouter un cours",
                icon: Plus,
                href: "/cours/add_courses",
            },
        ],
    },
    {
        title: "Parents",
        icon: User,
        href: "/parents",
    },
    {
        title: "Enfants",
        icon: Users,
        href: "/enfants",
    },
    {
        title: "Généralité",
        icon: Settings,
        children: [
            {
                title: "Tranches d'âge",
                icon: Layers,
                href: "/generalite/niveaux",
            },
            /*{
                title: "Suports",
                icon: Video,
                href: "/generalite/suports",
            },*/
            {
                title: "Modules",
                icon: Puzzle,
                href: "/generalite/modules",
            },
            {
                title: "Avatar",
                icon: Users,
                href: "/generalite/avatar",
            },
        ],
    },
];