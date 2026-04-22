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
                  <FormLabel className="font-bold uppercase tracking-wider text-[10px] text-slate-700">System Identifier (Email)</FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 bg-slate-50 border-2 border-slate-900 rounded-none shadow-none font-mono"
                      {...field}
                      disabled={isPending}
                      placeholder="user@enterprise.node"
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
                  <div className="flex justify-between items-center"><FormLabel className="font-bold uppercase tracking-wider text-[10px] text-slate-700">Security Protocol (Password)</FormLabel><a href="#" className="hidden lg:block text-[10px] font-bold text-orange-600 uppercase tracking-widest hover:underline">Forgot Key?</a></div>
                  <FormControl>
                    <Input
                      className="h-12 bg-slate-50 border-2 border-slate-900 rounded-none shadow-none font-mono"

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
          <div className="flex items-center gap-2 mt-4 lg:mt-6 mb-6">
            <input type="checkbox" id="maintain_session" className="w-4 h-4 rounded-none border-2 border-slate-900 accent-orange-600 cursor-pointer" />
            <label htmlFor="maintain_session" className="text-[10px] uppercase font-bold tracking-widest text-slate-700 cursor-pointer">Maintain Session</label>
          </div>
          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-14 text-lg font-black uppercase tracking-wider bg-orange-600 hover:bg-orange-700 text-slate-900 border-2 border-slate-900 rounded-none shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Login
            <svg className="w-6 h-6 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
