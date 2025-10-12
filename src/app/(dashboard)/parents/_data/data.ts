import { fetchData } from "@/services/service";

export const getAllParents = async () => {
  const response = await fetchData("parent/parents");
  return response.parents;
};
