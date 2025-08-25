"use client";

import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "@/services/service";
import toast from "react-hot-toast";
import { use } from "react";
import { Spinner } from "@/components/Spinner";

const formSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  gender: z.string().min(3).max(100),
  phone_number: z.string().min(6).max(100),
  number_whatsapp: z.string().min(6).max(100),
});

export const AddTrainerForm = () => {

    const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      gender: "",
      phone_number: "",
      number_whatsapp: "",
    },
  });


  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await postData("trainer/trainers", data);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ["trainers"]});
      form.reset();
      toast.success("Formateur ajouté avec succès!");
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        <fieldset className="w-full p-4 bg-white drop-shadow-sm flex items-end space-x-2 rounded-sm">
            <legend className="text-lg font-medium mb-2 p-2 text-white bg-[#1f2043]">Ajouter un formateur</legend>

            <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
                <FormItem className="flex-1 flex-col">
                <FormLabel htmlFor="name" className="text-muted-foreground">Name *</FormLabel>
                <FormControl>
                    <Input type="text" id="name" {...field} className="h-12 "/>
                </FormControl>
                </FormItem>
            )}
            />
            <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
                <FormItem className="flex-1 flex-col">
                <FormLabel htmlFor="email" className="text-muted-foreground">Email *</FormLabel>
                <FormControl>
                    <Input type="email" id="email" {...field} className="h-12"/>
                </FormControl>
                </FormItem>
            )}
            />
            <FormField
            name="gender"
            control={form.control}
            render={({ field }) => (
                <FormItem className="flex-1 flex-col ">
                  <FormLabel htmlFor="gender" className="text-muted-foreground">Gender *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} >
                    <FormControl>
                      <SelectTrigger className="min-h-12 flex w-full">
                        <SelectValue placeholder="Selectionner le genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Homme</SelectItem>
                      <SelectItem value="female">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
            )}
            />
            <FormField
            name="phone_number"
            control={form.control}
            render={({ field }) => (
                <FormItem className="flex-1 flex-col">
                <FormLabel htmlFor="phone_number" className="text-muted-foreground">Phone Number *</FormLabel>
                <FormControl>
                    <Input type="text" id="phone_number" {...field} className="h-12"/>
                </FormControl>
                </FormItem>
            )}
            />
            <FormField
            name="number_whatsapp"
            control={form.control}
            render={({ field }) => (
                <FormItem className="flex-1 flex-col">
                <FormLabel htmlFor="number_whatsapp" className="text-muted-foreground">WhatsApp Number *</FormLabel>
                <FormControl>
                    <Input type="text" id="number_whatsapp" {...field} className="h-12"/>
                </FormControl>
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
