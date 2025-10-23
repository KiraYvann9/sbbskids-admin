import { deleteItem } from "@/services/service";

export const deleteCourse = (id: number) => {
  // Logic to delete the item with the given id
    return deleteItem(`admin/courses/${id}`);

};
