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
import {Eye, EyeClosed} from "lucide-react";
import {useState} from "react";

const formSchema = z.object({
    email: z.email(),
    password: z.string().min(2).max(100),
});

export const LoginFormComponent = () => {

    const router = useRouter();
    const { login } = useAdminStore();

    const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);

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
        <div className="w-full flex flex-col items-center gap-3 p-24 h-[664px]">
            <Image
                src="/assets/logo_200.png"
                alt="Logo"
                width={200}
                height={200}
                className="m-10"
                priority={true}
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
                                    <Input type="email" {...field} className="w-full h-14 text-xl" />
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
                                    <div className={'flex relative'}>
                                        <Input type={ !isPasswordShown?"password":"text"} {...field} className="w-full h-14 text-xl" />
                                        <button type={'button'} onClick={() => setIsPasswordShown(!isPasswordShown)} className={'absolute right-2 translate-y-[60%] text-muted-foreground'}>
                                            { !isPasswordShown? <EyeClosed/> : <Eye/> }
                                        </button>
                                    </div>
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
    );
}
