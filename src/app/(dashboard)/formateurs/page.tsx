"use client";

import { AddTrainerForm } from "./_components/AddTrainerForm";
import { DataTable } from "./_components/table/DataTable";

import { useQuery } from "@tanstack/react-query";
import { columns } from "./_components/table/Columns";

import { fetchData } from "@/services/service";
import toast from "react-hot-toast";

export default function FormateursPage() {
  const getTrainers = async () => {
    const response = await fetchData("trainer/trainers");
    return response?.trainers;
  };

  const {
    data: trainers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trainers"],
    queryFn: getTrainers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  {
    isError && toast.error("Quelque chose s'est mal passée");
  }

  return (
    <div className="p-4 flex flex-col gap-14">
      <AddTrainerForm />
      <DataTable
        columns={columns}
        data={trainers || []}
        isLoading={isLoading}
      />
    </div>
  );
}
