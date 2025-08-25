import {LayoutDashboard, LucideIcon, Settings, User, Users} from "lucide-react"
import {IconChalkboardTeacher} from '@tabler/icons-react'

type sidebarItem = {
  title: string;
  icon: LucideIcon | unknown;
  href: string;
};

export const sidebarItems: sidebarItem[] = [
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
        title: "Parents",
        icon: User,
        href: "/parents",
    },
    {
        title: "Settings",
        icon: Settings,
        href: "/settings",
    },
];