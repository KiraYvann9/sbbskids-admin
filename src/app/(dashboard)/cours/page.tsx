'use client'

import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import Link from "next/link";
import {useQuery} from "@tanstack/react-query";
import {fetchData} from "@/services/service";

import {DataTable} from "./_components/table/DataTable"
import {columns} from "./_components/table/Columns";

export default function Courses() {

    const {data: Courses, isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const courses = await fetchData('admin/courses');
            return await courses.courses;
        },
    })

    return(
        <div className="p-4 space-y-4">
            <div className={'flex justify-end items-center p-4 w-full h-20 bg-white border rounded-sm'}>

                <Button variant={'outline'} className={'bg-yellow-400'} asChild>
                    <Link href={'/cours/add_courses'} > <Plus /> Ajouter un jour</Link>
                </Button>
            </div>

            <div>
                <DataTable data={Courses || []} isLoading={isLoading} columns={columns}/>
            </div>
        </div>
    )
}