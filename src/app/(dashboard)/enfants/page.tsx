"use client";

import { useQuery } from "@tanstack/react-query";
// import { columns } from "./_components/table/Columns";
//
// import { fetchData } from "@/services/service";
import toast from "react-hot-toast";

import { getAllChildren } from './_data/data'

export default function FormateursPage() {


    const {
        // data: parents,
        // isLoading,
        isError,
    } = useQuery({
        queryKey: ["children"],
        queryFn: getAllChildren,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    // if (isLoading) {
    //   return <div>Loading...</div>;
    // }

    if(isError) {
        toast.error("Quelque chose s'est mal passée")
    }

    return (
        <div className="p-4 flex flex-col gap-14">
            {/*<AddTrainerForm />*/}
            {/*<DataTable
                columns={columns}
                data={parents || []}
                isLoading={isLoading}
            />*/}
        </div>
    );
}
