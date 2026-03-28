"use client";

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../step-config";
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const CAPABILITIES_LIST = [
    "CNC Machining",
    "CNC Turning",
    "Laser Cutting",
    "Sheet Metal",
    "Injection Molding",
    "3D Printing",
    "EDM",
    "Welding",
    "Surface Treatment",
];

interface Props {
    form: UseFormReturn<FormValues>;
}

export const CapabilityStep = ({ form }: Props) => {
    return (
        <div className="space-y-6">
            <FormField control={form.control} name="capabilities" render={() => (
                <FormItem>
                    <FormLabel className="text-base font-semibold">Manufacturing Capabilities *</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        {CAPABILITIES_LIST.map((item) => (
                            <FormField key={item} control={form.control} name="capabilities" render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
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

            <FormField control={form.control} name="expertiseLevel" render={({ field }) => (
                <FormItem>
                    <FormLabel>Expertise Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select your production scale" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Beginner">Beginner / Prototyping</SelectItem>
                            <SelectItem value="Intermediate">Intermediate / Low Volume</SelectItem>
                            <SelectItem value="Advanced">Advanced / High Volume Production</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField control={form.control} name="tolerancesSupported" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Standard Tolerance</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="±0.01mm" className="h-11" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="maxPartSize" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Max Part Size</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="2000×1000×1000 mm" className="h-11" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="minPartSize" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Min Part Size</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="5×5×5 mm" className="h-11" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </div>
    );
};
