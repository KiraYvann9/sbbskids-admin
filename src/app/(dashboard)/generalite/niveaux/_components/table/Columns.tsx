"use client";
import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";

import { schema } from "./Schema";
import {ActionsButton} from "./ActionsButton";
import Image from "next/image";


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
        accessorKey: "age_group",
        header: () => <div className="w-full text-left">Tranche d'âge </div>,
        cell: ({ row }) => {
            return <div>{row.original.age_group}</div>;
        },
    },
    {
        accessorKey: "description",
        header: () => <div className="w-full text-left">Description</div>,
        cell: ({ row }) => <div>{row.original.description}</div>,
    },
    {
        accessorKey: "modules",
        header: () => <div className="w-full text-left">Nbr Modules</div>,
        cell: ({ row }) => <div>{row.original.modules.length}</div>,
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            return (
                <div className=" relative w-[100px] h-[80px] flex justify-center items-center">
                    <Image src={row.original.image_url} alt="Image" className="rounded-md" fill={true} objectFit={"cover"} priority={true}/>
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <ActionsButton data={row.original}/>
        ),
    },
];
