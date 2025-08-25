"use client";

import Image from "next/image";
import {useRouter} from "next/navigation";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { useAdminStore } from "@/stores/adminStore";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/Spinner";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(2).max(100),
});

export default function Home() {
  const router = useRouter();
  const { login } = useAdminStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await login(data);
      return response;
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      toast.success("Connecté avec succès!");
      router.push("/formateurs");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const submit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
    
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-24">
      <div className="w-full max-w-7xl flex rounded-xl overflow-hidden border bg-white drop-shadow-md">
        <div className="w-1/2 flex items-center justify-center bg-[#0d0f48]"></div>
          
        <div className="w-1/2 flex flex-col items-center gap-3 p-24">
          <Image
            src="/assets/logo_sbbskids.svg"
            alt="Logo"
            width={200}
            height={200}
            className="m-10"
          />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submit)}
              className="w-full flex flex-col gap-3"
            >
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Email *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="w-full h-14" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Mot de passe *</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="w-full h-14" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-5 h-16 text-xl bg-[#0d0f48]" disabled={mutation.isPending}>
                {/* Submit */}
                {mutation.isPending ? <Spinner /> : "Se connecter"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
