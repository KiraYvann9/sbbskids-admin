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
import { ToastCustom } from "@/lib/ToastCustom";
import { Spinner } from "@/components/Spinner";
import {Eye, EyeClosed} from "lucide-react";
import {useState} from "react";
import { AxiosError } from "axios";

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
            ToastCustom.success("Connecté avec succès!");
            router.push("/formateurs");
        },
        onError: (error) => {
            console.error("Login failed:", error);
            ToastCustom.error(error instanceof AxiosError ? error?.response?.data.message : "Échec de la connexion.");
        },
    });

    const submit = (data: z.infer<typeof formSchema>) => {
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header avec logo */}
                    <div className="bg-gradient-to-r from-[#0d0f48] to-indigo-900 p-8 flex flex-col items-center">
                        <div className="bg-white rounded-full p-4 shadow-lg mb-4">
                            <Image
                                src="/assets/logo_200.png"
                                alt="Logo"
                                width={120}
                                height={120}
                                priority={true}
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Bienvenue</h1>
                        <p className="text-indigo-200 text-sm mt-1">Connectez-vous à votre compte</p>
                    </div>

                    {/* Formulaire */}
                    <div className="p-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(submit)}
                                className="w-full flex flex-col gap-5"
                            >
                                <FormField
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">
                                                Email *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    {...field}
                                                    className="w-full h-12 text-base border-gray-300 focus:border-[#0d0f48] focus:ring-[#0d0f48] rounded-lg transition-all"
                                                    placeholder="exemple@email.com"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">
                                                Mot de passe *
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={!isPasswordShown ? "password" : "text"}
                                                        {...field}
                                                        className="w-full h-12 text-base border-gray-300 focus:border-[#0d0f48] focus:ring-[#0d0f48] rounded-lg pr-12 transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsPasswordShown(!isPasswordShown)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                                    >
                                                        {!isPasswordShown ? <EyeClosed size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full mt-3 h-12 text-base font-semibold bg-gradient-to-r from-[#0d0f48] to-indigo-900 hover:from-[#1a1f5e] hover:to-indigo-950 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending ? <Spinner /> : "Se connecter"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Besoin d'aide ? Contactez le support
                </p>
            </div>
        </div>
    );
}