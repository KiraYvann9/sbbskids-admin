import { deleteItem } from "@/services/service";

export const deleteTrainer = (id: number) => {
  // Logic to delete the item with the given id
    const response = deleteItem(`trainer/trainers/${id}`);
    return response;
};
