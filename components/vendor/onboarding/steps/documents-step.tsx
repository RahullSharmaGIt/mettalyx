"use client";

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../step-config";
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { FileUpload } from "@/components/vendor/onboarding/file-upload";

interface Props {
    form: UseFormReturn<FormValues>;
}

export const DocumentsStep = ({ form }: Props) => {
    return (
        <div className="space-y-6">
            <p className="text-sm text-slate-500">
                Upload your ISO certificates, quality manuals, and any regulatory compliance proofs.
            </p>

            <FormField control={form.control} name="isoCertificates" render={({ field }) => (
                <FormItem>
                    <FormLabel>ISO & Quality Certificates</FormLabel>
                    <FormControl>
                        <FileUpload
                            value={field.value ?? []}
                            onUpload={(urls) => field.onChange(urls)}
                            multiple
                            title="Upload ISO, CE, UL, or other certificates (PDF or image)"
                            accept="application/pdf,image/*"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="complianceProofs" render={({ field }) => (
                <FormItem>
                    <FormLabel>Compliance & Regulatory Documents</FormLabel>
                    <FormControl>
                        <FileUpload
                            value={field.value ?? []}
                            onUpload={(urls) => field.onChange(urls)}
                            multiple
                            title="Upload REACH, RoHS, export compliance docs, etc."
                            accept="application/pdf,image/*"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
    );
};
