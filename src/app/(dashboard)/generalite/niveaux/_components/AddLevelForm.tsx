"use client";

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
import { Layers, Image as ImageIcon, FileText, PlusCircle } from "lucide-react";

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
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("age_group", data.age_group);
      formData.append("description", data.description);

      const file = Array.isArray(data.image) ? data.image[0] : (data.image as File | undefined);
      if (file) formData.append("image", file);

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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1f2043] to-indigo-900 p-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Ajouter un Niveau</h2>
            <p className="text-indigo-200 text-sm mt-1">Renseignez les informations du nouveau niveau</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section Informations du Niveau */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-semibold text-gray-800">Informations du Niveau</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nom *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Ex: Débutant"
                            className="h-11 pl-10 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="age_group"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Tranche d'âge *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors">
                            <SelectValue placeholder="Sélectionner la tranche d'âge" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AGE_GROUPS.map((g) => (
                            <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="image"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Image</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type="file"
                            accept="image/*"
                            className="h-11 pl-10 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                            onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : undefined)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Description *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <Textarea
                            placeholder="Décrivez ce niveau..."
                            className="min-h-28 pl-10 bg-gray-50 border-gray-300 hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                type="submit"
                className="gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Spinner />
                    <span>Ajout en cours...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Ajouter le niveau</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
