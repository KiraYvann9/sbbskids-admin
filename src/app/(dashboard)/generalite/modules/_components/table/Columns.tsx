"use client";
import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { schema } from "./Schema";
import {ActionsButton} from "./ActionsButton";
import {formatDate} from "@/lib/formatDate";


export const columns: ColumnDef<schema>[] = [
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
        header: "Titre",
        cell: ({ row }) => {
            return <div>{row.original.name}</div>;
        },
        enableHiding: false,
    },

    {
        accessorKey: "age_group",
        header: () => <div className="w-full text-left">Tranche d'âge </div>,
        cell: ({ row }) => {
            return <div>{row.original.level.age_group}</div>;
        },
    },
    {
        accessorKey: "description",
        header: () => <div className="w-full text-left">Description</div>,
        cell: ({ row }) => <div>{row.original.applications}</div>,
    },
    {
        accessorKey: "courses",
        header: () => <div className="w-full text-left">Nbr Cours</div>,
        cell: ({ row }) => <div>{row.original.courses.length}</div>,
    },
    {
        accessorKey: "created_at",
        header: () => <div className="w-full text-left">Créé le</div>,
        cell: ({ row }) => <div>{formatDate(row.original.created_at)}</div>,
    },
    {
        accessorKey: "admin.name",
        header: () => <div className="w-full text-left">Par</div>,
        cell: ({ row }) => <div>{row.original.admin.name}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <ActionsButton data={row.original}/>
        ),
    },
];
