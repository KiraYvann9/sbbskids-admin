"use client";
import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Database, ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    isLoading: boolean;
}

export function DataTable<TData>({
                                     data,
                                     columns,
                                     isLoading,
                                 }: DataTableProps<TData>) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },

        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <div className="w-full space-y-4">

            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="bg-gradient-to-r from-[#1f2043] to-indigo-900 hover:from-[#252751] hover:to-indigo-950 transition-colors"
                                >
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="text-white text-base font-semibold text-left py-4 first:pl-6 last:pr-6"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={`
                      transition-colors duration-150 hover:bg-indigo-50/50
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      ${row.getIsSelected() ? "bg-indigo-100/50" : ""}
                    `}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="text-base text-gray-700 py-4 first:pl-6 last:pr-6"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-40 text-center"
                                    >
                                        {isLoading ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <Spinner/>
                                                <p className="text-gray-500 text-sm">Chargement des données...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                                <Database className="w-12 h-12 opacity-50" />
                                                <div>
                                                    <p className="text-base font-medium">Aucune donnée disponible</p>
                                                    <p className="text-sm">Aucun module à afficher pour le moment</p>
                                                </div>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Footer avec pagination */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
            <span className="font-semibold text-indigo-600">
              {table.getFilteredSelectedRowModel().rows.length}
            </span>
                        {" "}sur{" "}
                        <span className="font-semibold text-gray-700">
              {table.getFilteredRowModel().rows.length}
            </span>
                        {" "}ligne{table.getFilteredRowModel().rows.length > 1 ? "s" : ""} sélectionnée{table.getFilteredSelectedRowModel().rows.length > 1 ? "s" : ""}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="gap-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Précédent
                        </Button>

                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <span className="text-sm text-gray-600">
                Page{" "}
                  <span className="font-semibold text-gray-900">
                  {table.getState().pagination.pageIndex + 1}
                </span>
                  {" "}sur{" "}
                  <span className="font-semibold text-gray-900">
                  {table.getPageCount()}
                </span>
              </span>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="gap-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Suivant
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}