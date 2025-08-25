'use client'

import { AddTrainerForm } from "./_components/AddTrainerForm";
import { DataTable } from "./_components/table/DataTable";
import { getTrainers } from "./_data/data";

import { useQuery } from "@tanstack/react-query";


export default function FormateursPage() {

  const { data: trainers, isLoading } = useQuery({
    queryKey: ["trainers"],
    queryFn: getTrainers
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-14">

      <AddTrainerForm />
      <DataTable data={trainers || []} isLoading={isLoading} />
    </div>
  );
}
