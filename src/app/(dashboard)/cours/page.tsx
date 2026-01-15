'use client'

import {Button} from "@/components/ui/button";
import {Database, Plus} from "lucide-react";
import Link from "next/link";
import {useQuery} from "@tanstack/react-query";
import {fetchData} from "@/services/service";

import {DataTable} from "./_components/table/DataTable"
import {columns} from "./_components/table/Columns";

export default function Courses() {

    const {data: Courses, isLoading} = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const courses = await fetchData('admin/courses');
            return await courses.courses;
        },
    })

    return (
        <div className="p-4 space-y-4">


            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-lg shadow-md">
                        <Database className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Liste des cours</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
              <span className="font-semibold text-indigo-600">
                {Courses?.length}
              </span>
                            {" "}cours au total
                        </p>
                    </div>
                </div>
                <Button variant={'outline'} className={'bg-yellow-400'} asChild>
                    <Link href={'/cours/add_courses'}> <Plus/> Ajouter un jour</Link>
                </Button>
            </div>

            <div>
                <DataTable data={Courses || []} isLoading={isLoading} columns={columns}/>
            </div>
        </div>
    )
}