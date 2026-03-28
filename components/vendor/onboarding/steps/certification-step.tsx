"use client";

import { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { FormValues } from "../step-config";
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/vendor/onboarding/file-upload";
import { Plus, Trash2 } from "lucide-react";

interface Props {
    form: UseFormReturn<FormValues>;
}

export const CertificationStep = ({ form }: Props) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "certifications",
    });

    return (
        <div className="space-y-6">
            <p className="text-sm text-slate-500">
                Add all your quality certifications. Leave this section empty if you don't have any yet.
            </p>

            {fields.map((item, index) => (
                <div key={item.id} className="border rounded-xl p-4 space-y-4 bg-slate-50">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">
                            Certification {index + 1}
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name={`certifications.${index}.name`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Certification Name *</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="ISO 9001:2015" className="h-11" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name={`certifications.${index}.issuedBy`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Issued By</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="TUV SUD, Bureau Veritas..." className="h-11" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <FormField control={form.control} name={`certifications.${index}.issuedDate`} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Issue Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    className="h-11"
                                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                    onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name={`certifications.${index}.certificateUrl`} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Certificate File *</FormLabel>
                            <FormControl>
                                <FileUpload
                                    value={field.value ? [field.value] : []}
                                    onUpload={(urls) => field.onChange(urls[0] ?? "")}
                                    accept="application/pdf,image/*"
                                    title="Upload the certificate document"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-dashed"
                onClick={() => append({ name: "", certificateUrl: "", issuedBy: "" })}
            >
                <Plus className="h-4 w-4 mr-2" /> Add Certification
            </Button>
        </div>
    );
};
