"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { levelSchema, LevelFormValues } from "../schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/Spinner";
import { postData } from "@/services/service";

const AGE_GROUPS = [
  { value: "4-7", label: "4-7 ans" },
  { value: "8-12", label: "8-12 ans" },
  { value: "13-17", label: "13-17 ans" },
];

export const AddLevelForm = () => {
  const queryClient = useQueryClient();

  const form = useForm<LevelFormValues>({
    resolver: zodResolver(levelSchema),
    defaultValues: {
      name: "",
      age_group: "",
      image: undefined,
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LevelFormValues) => {
      // Build FormData if image is present
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("age_group", data.age_group);
      formData.append("description", data.description);

      const file = Array.isArray(data.image) ? data.image[0] : (data.image as File | undefined);
      if (file) formData.append("image", file);

      // Adjust endpoint according to backend conventions
      const response = await postData("admin/levels", formData);
      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["age_group"] });
      form.reset();
      toast.success("Niveau ajouté avec succès!");
    },
  });

  const onSubmit = (data: LevelFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <fieldset className="w-full p-4 bg-white drop-shadow-sm flex items-end space-x-2 rounded-sm">
          <legend className="text-lg font-medium mb-2 p-2 text-white bg-[#1f2043]">Ajouter un niveau</legend>

          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1 flex-col">
                <FormLabel htmlFor="name" className="text-muted-foreground">Nom *</FormLabel>
                <FormControl>
                  <Input type="text" id="name" className="h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="age_group"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1 flex-col">
                <FormLabel htmlFor="age_group" className="text-muted-foreground">Tranche d'âge *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="min-h-12 flex w-full">
                      <SelectValue placeholder="Sélectionner la tranche d'âge" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AGE_GROUPS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="image"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1 flex-col">
                <FormLabel htmlFor="image" className="text-muted-foreground">Image</FormLabel>
                <FormControl>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="h-12"
                    onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1 flex-col">
                <FormLabel htmlFor="description" className="text-muted-foreground">Description *</FormLabel>
                <FormControl>
                  <Textarea id="description" className="min-h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="h-12 bg-green-500" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner /> : "Ajouter"}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
};
