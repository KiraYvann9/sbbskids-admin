'use client'

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

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

  return (
    <div className="w-full h-28 flex items-center justify-between px-4 bg-white border-b">
      <div className="text-2xl font-semibold">{capitalize(pathname.replace("/", "") || "Dashboard")}</div>
      <div className="flex items-center gap-4">
        <Button variant={'secondary'} onClick={() => mutate()} className="hover:bg-gray-100 hover:text-[#1f2043] rounded-sm ease-in-out transition-colors duration-200">
          <LogOut />
          <span className="ml-2">Déconnexion</span>
        </Button>
      </div>
    </div>
  );
};
