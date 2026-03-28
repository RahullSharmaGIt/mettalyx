"use client";

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../step-config";
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck } from "lucide-react";

interface Props {
    form: UseFormReturn<FormValues>;
}

const AGREEMENT_POINTS = [
    "I will complete assigned work within agreed tolerances and timelines.",
    "I understand that repeated quality failures may result in suspension.",
    "I confirm all information provided is accurate and up to date.",
    "I agree to Mettalyx's vendor terms and conditions.",
];

export const AgreementStep = ({ form }: Props) => {
    return (
        <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <ShieldCheck className="h-5 w-5 text-slate-600" />
                    <span>Vendor Agreement</span>
                </div>
                <ul className="space-y-2">
                    {AGREEMENT_POINTS.map((point) => (
                        <li key={point} className="flex gap-2 text-sm text-slate-600">
                            <span className="mt-0.5 shrink-0">•</span>
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <FormField control={form.control} name="isAgreementAccepted" render={({ field }) => (
                <FormItem>
                    <div className="flex items-start space-x-3 p-4 border-2 border-slate-900 rounded-xl bg-white">
                        <FormControl>
                            <Checkbox
                                className="mt-1 w-5 h-5 border-2"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <FormLabel className="text-sm font-semibold leading-snug cursor-pointer">
                            I have read and agree to all the terms above. I understand this is a binding vendor agreement.
                        </FormLabel>
                    </div>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
    );
};
