"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobPostingSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { postJob } from "@/actions/post-job";
import { FileDropzone } from "@/components/oem/file-dropzone";
import { Paperclip } from "lucide-react";

// A temporary job id placeholder used by the dropzone so files can be
// associated with the job after it is created.
const DRAFT_JOB_ID = "DRAFT";

export default function PostJobPage() {
  const [error, setError] = useState<string | undefined>("");
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof JobPostingSchema>>({
    resolver: zodResolver(JobPostingSchema),
    defaultValues: {
      title: "",
      description: "",
      material: "",
      materialGrade: "",
      quantity: "",
      tolerance: "",
      surfaceFinish: "",
      deadline: "",
      location: "",
    },
  });

  const onSubmit = (values: z.infer<typeof JobPostingSchema>) => {
    setError("");
    startTransition(() => {
      postJob(values, uploadedFileIds).then((data) => {
        if (data?.error) setError(data.error);
      });
    });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Title */}
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="CNC Machining - Steel Part X" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Description */}
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isPending} placeholder="Detailed requirements..." rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Material + Quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="material" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="Steel, Aluminum, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} type="number" min="1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Material Grade + Surface Finish */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="materialGrade" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Grade (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="SS304, 6061-T6, EN8..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="surfaceFinish" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surface Finish (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="Anodized, Powder Coated, Brushed..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Tolerance */}
                <FormField control={form.control} name="tolerance" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tolerance (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="±0.01mm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Deadline + Location */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="deadline" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (City)</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="Mumbai, Delhi, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* File Attachments */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Paperclip className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">
                      Attach Files{" "}
                      <span className="text-slate-400 font-normal">(drawings, 3D models, specs)</span>
                    </span>
                    {uploadedFileIds.length > 0 && (
                      <span className="ml-auto text-xs text-emerald-600 font-medium">
                        {uploadedFileIds.length} file{uploadedFileIds.length > 1 ? "s" : ""} ready
                      </span>
                    )}
                  </div>
                  <FileDropzone
                    jobId={DRAFT_JOB_ID}
                    onFileIdsChange={setUploadedFileIds}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                  <p>{error}</p>
                </div>
              )}

              <Button disabled={isPending} type="submit" className="w-full">
                Submit Job for Review
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
