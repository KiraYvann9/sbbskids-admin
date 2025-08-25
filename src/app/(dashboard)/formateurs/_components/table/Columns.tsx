"use client";
import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLoader,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { schema } from "./Schema";


export const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => {
      return <div>{row.original.name}</div>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="w-32">
        {/* <Badge
          variant="outline"
          className="text-muted-foreground text-[16px] px-1.5"
        >
          {row.original.email}
        </Badge> */}
        {row.original.email}
      </div>
    ),
  },
  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //     cell: ({ row }) => (
  //       <Badge variant="outline" className="text-muted-foreground px-1.5">
  //         {row.original.status === "Done" ? (
  //           <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
  //         ) : (
  //           <IconLoader />
  //         )}
  //         {row.original.status}
  //       </Badge>
  //     ),
  //   },
  {
    accessorKey: "gender",
    header: () => <div className="w-full text-left">Genre </div>,
    cell: ({ row }) => {
      const genre = row.original.gender
      return <div>{genre === "male" ? "Homme" : "Femme"}</div>;
    },
  },
  {
    accessorKey: "phone_number",
    header: () => <div className="w-full text-left">Téléphone</div>,
    cell: ({ row }) => <div>{row.original.phone_number}</div>,
  },
  {
    accessorKey: "number_whatsapp",
    header: "WhatsApp",
    cell: ({ row }) => {
      return <div>{row.original.number_whatsapp}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => console.log(row.original.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
