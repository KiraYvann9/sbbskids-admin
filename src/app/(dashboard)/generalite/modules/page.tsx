'use client'

import {AddModuleForm} from "./_components/AddModuleForm";
import {useQuery} from "@tanstack/react-query";
import {fetchData} from "@/services/service";
import {DataTable} from "./_components/table/DataTable";
import {columns} from "./_components/table/Columns";

export default function ModulesPage() {

    const {data, isLoading} = useQuery({
        queryKey: ['modules'],
        queryFn: async () => {
            const response =  await fetchData('admin/modules')
            return response?.modules
        },
    })

    console.log('modules  :',data);

  return (
      <div className="py-4 px-14 space-y-4">
          <h1 className="text-2xl font-semibold">Modules</h1>
          <AddModuleForm />
          <DataTable data={data || []} isLoading={isLoading} columns={columns}/>
    </div>
  );
}
