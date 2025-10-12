

import { fetchData } from "@/services/service";

export const getAllChildren = async () => {
  const response = await fetchData("parent/students/my-students");
  return response;
};
