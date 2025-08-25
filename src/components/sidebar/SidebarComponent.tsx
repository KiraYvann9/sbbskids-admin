"use client";

import Link from "next/link";
import { sidebarItems } from "./SidebarItems";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const SidebarComponent = () => {
  const pathname = usePathname();

  return (
    <div className="w-60 border-r h-screen p-4 bg-[#1f2043] text-white flex flex-col gap-14">
      <div className="flex justify-center bg-white p-2 rounded-sm">
        <Image
          src="/assets/logo_sbbskids.svg"
          alt="Logo"
          width={100}
          height={100}
        />
      </div>
      <div className="flex flex-col gap-2 self-center w-full">
        {sidebarItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              `flex items-center gap-2 p-2 text-white/75 hover:bg-gray-100 hover:text-[#1f2043] rounded-sm ease-in-out transition-colors duration-200`,
              {
                "bg-gray-100 text-[#1f2043]": pathname === item.href,
              }
            )}
          >
            <item.icon />
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
