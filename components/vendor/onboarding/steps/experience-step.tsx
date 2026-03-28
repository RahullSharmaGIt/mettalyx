"use client";

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../step-config";
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/vendor/onboarding/file-upload";

const INDUSTRIES_LIST = [
    "Automotive",
    "Aerospace",
    "Medical Devices",
    "Industrial",
    "Consumer Electronics",
    "Defense",
    "Energy",
    "Robotics",
];

interface Props {
    form: UseFormReturn<FormValues>;
}

export const ExperienceStep = ({ form }: Props) => {
    return (
        <div className="space-y-6">
            <FormField control={form.control} name="industriesServed" render={() => (
                <FormItem>
                    <FormLabel className="text-base font-semibold">Industries Served</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        {INDUSTRIES_LIST.map((item) => (
                            <FormField key={item} control={form.control} name="industriesServed" render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(item)}
                                            onCheckedChange={(checked: boolean) =>
                                                checked
                                                    ? field.onChange([...(field.value ?? []), item])
                                                    : field.onChange(field.value?.filter(v => v !== item))
                                            }
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">{item}</FormLabel>
                                </FormItem>
                            )} />
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="pastWorkDescription" render={({ field }) => (
                <FormItem>
                    <FormLabel>Describe Your Best Work</FormLabel>
                    <FormControl>
                        <Textarea
                            {...field}
                            rows={4}
                            placeholder="e.g. Manufactured precision engine parts for top automotive OEMs, achieving ±0.005mm tolerance at scale..."
                            className="resize-none"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="sampleWorkFiles" render={({ field }) => (
                <FormItem>
                    <FormLabel>Sample Work (Images / PDFs)</FormLabel>
                    <FormControl>
                        <FileUpload
                            value={field.value ?? []}
                            onUpload={(urls) => field.onChange(urls)}
                            multiple
                            title="Upload photos or drawings of past work"
                            accept="image/*,application/pdf"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
    );
};
