"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { VendorOnboardingSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { vendorOnboarding } from "@/actions/vendor-onboarding";

export const VendorOnboardingForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();



  const form = useForm<z.infer<typeof VendorOnboardingSchema>>({
    resolver: zodResolver(VendorOnboardingSchema),
    defaultValues: {
      workshopName: "",
      machines: "",
      address: "",
      city: "",
    },
  });

  const onSubmit = (values: z.infer<typeof VendorOnboardingSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      vendorOnboarding(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSuccess(data.success);
            // Redirect to vendor dashboard after success
            setTimeout(() => {
                router.push("/vendor/dashboard");
            }, 1000);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Complete your Vendor Profile"
      backButtonLabel="Back to Dashboard"
      backButtonHref="/vendor/dashboard"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="workshopName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workshop Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Speedy Machining Ltd."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="New York"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="123 Industrial Park..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="machines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machines & Capabilities</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isPending}
                      placeholder="e.g. 3-Axis CNC, Lathe, Milling..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    List your key equipment so we can match you with jobs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
              <p>{success}</p>
            </div>
          )}
          <Button disabled={isPending} type="submit" className="w-full">
            Save Profile
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
