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
        accessorKey: "title",
        header: "Titre",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col gap-2 justify-center">
                    <strong className={'text-2xl'}>{row.original.title}</strong>
                    <span>{row.original.level.age_group}/{row.original.level.name}</span>
                </div>
            );
        },
        enableHiding: false,
    },

    {
        accessorKey: "module",
        header: () => <div className="w-full text-left">Module</div>,
        cell: ({ row }) => {
            return <div>{row.original.module.name}</div>;
        },
    },
    {
        accessorKey: "supports",
        header: () => <div className="w-full text-left">Nbr. Support</div>,
        cell: ({ row }) => <div>{row.original.supports.length}</div>,
    },
    {
        accessorKey: "activities",
        header: () => <div className="w-full text-left">Nbr. Activité</div>,
        cell: ({ row }) => <div>{row.original.activities.length}</div>,
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
