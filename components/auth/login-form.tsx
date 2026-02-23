"use client";

import * as z from "zod"; 
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { login } from "@/actions/login";

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
        login(values)
        .then((data) => {
            if (data?.error) {
                form.reset();
                setError(data.error);
            }
            if (data?.success) {
                form.reset();
                setSuccess(data.success);
            }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register" 
      showSocial
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold uppercase tracking-wider text-xs text-slate-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 bg-slate-50 font-mono"
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold uppercase tracking-wider text-xs text-slate-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 bg-slate-50 font-mono border-2 border-slate-900 shadow-sm"
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && (
            <div className="bg-red-100 border-2 border-slate-900 shadow-neo p-4 mt-2 rounded-none flex items-center gap-x-2 text-sm text-red-700 font-bold uppercase">
                <p>{error}</p>
            </div>
          )}
          {success && (
             <div className="bg-emerald-100 border-2 border-slate-900 shadow-neo p-4 mt-2 rounded-none flex items-center gap-x-2 text-sm text-emerald-700 font-bold uppercase">
                <p>{success}</p>
            </div>
          )}
          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-14 mt-6 text-lg uppercase tracking-wider"
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
