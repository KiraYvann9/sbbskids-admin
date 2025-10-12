"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { avatarsSchema, AvatarsFormValues } from "./schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/Spinner";
import { postData } from "@/services/service";

export const AddAvatarsForm = () => {
  const queryClient = useQueryClient();

  const form = useForm<AvatarsFormValues>({
    resolver: zodResolver(avatarsSchema),
    defaultValues: {
      avatar: undefined,
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AvatarsFormValues) => {
      const formData = new FormData();

      const files = Array.isArray(data.avatar)
        ? data.avatar
        : (data.avatar as unknown as FileList | File);

      if (files instanceof FileList) {
        Array.from(files).forEach((file) => formData.append("avatars[]", file));
      } else if (Array.isArray(files)) {
        files.forEach((file) => file && formData.append("avatars[]", file));
      } else if (files instanceof File) {
        formData.append("avatars[]", files);
      }

      if (data.description) formData.append("description", data.description);

      // TODO: replace endpoint if needed according to backend
      return await postData("admin/avatars", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["avatars"] });
      form.reset();
      toast.success("Avatars ajoutés avec succès!");
    },
  });

  const onSubmit = (values: AvatarsFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <fieldset className="w-full p-4 bg-white drop-shadow-sm flex items-end space-x-2 rounded-sm">
          <legend className="text-lg font-medium mb-2 p-2 text-white bg-[#1f2043]">Ajouter des avatars</legend>

          <FormField
            name="avatar"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1 flex-col">
                <FormLabel htmlFor="images" className="text-muted-foreground">Images *</FormLabel>
                <FormControl>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="h-12"
                    onChange={(e) => field.onChange(e.target.files)}
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
                <FormLabel htmlFor="description" className="text-muted-foreground">Description (optionnel)</FormLabel>
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
