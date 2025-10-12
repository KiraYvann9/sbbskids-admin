
import { fetchData } from "@/services/service";

export const getTrainers = async () => {
  const response = await fetchData("trainer/trainers");
  return response?.trainers;
};
