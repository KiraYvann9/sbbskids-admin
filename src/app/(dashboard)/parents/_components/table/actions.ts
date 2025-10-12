import { deleteItem } from "@/services/service";

export const deleteParent = (id: number) => {
  // Logic to delete the item with the given id
    const response = deleteItem(`parent/destroy-parent/${id}`);
    return response;
};
