"use client";
import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";

import { schema } from "./Schema";
import {ActionsButton} from "@/app/(dashboard)/formateurs/_components/table/ActionsButton";


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
      <ActionsButton data={row.original}/>
    ),
  },
];
