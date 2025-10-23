'use client'

import { AddLevelForm } from "./_components/AddLevelForm";
import {useQuery} from "@tanstack/react-query";
import {fetchData} from "@/services/service";
import {DataTable} from "./_components/table/DataTable";
import {columns} from "./_components/table/Columns";

export default function NiveauxPage() {

    const {data, isLoading} = useQuery({
        queryKey: ['age_group'],
        queryFn: async () => {
            const response = await fetchData('admin/levels')
            return response?.levels
        },
    })

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Tranches d'âge</h1>
      <AddLevelForm />
        <DataTable data={data || []} isLoading={isLoading} columns={columns}/>
    </div>
  );
}
