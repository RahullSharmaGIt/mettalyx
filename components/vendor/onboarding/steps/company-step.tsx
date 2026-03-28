"use client";

import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../step-config";
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
    form: UseFormReturn<FormValues>;
}

export const CompanyStep = ({ form }: Props) => {
    const [isLocating, setIsLocating] = useState(false);
    const lat = form.watch("lat");
    const lng = form.watch("lng");

    const getLocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                form.setValue("lat", pos.coords.latitude);
                form.setValue("lng", pos.coords.longitude);
                setIsLocating(false);
            },
            () => setIsLocating(false),
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="space-y-5">
            <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Acme Manufacturing Ltd." className="h-11" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="contactEmail" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Email *</FormLabel>
                        <FormControl>
                            <Input type="email" {...field} placeholder="contact@company.com" className="h-11" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="contactPhone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Phone *</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="+1 555 123 4567" className="h-11" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="gstNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel>GST / Tax Number</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Optional" className="h-11" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="yearsOfExperience" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Years in Business *</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min={1}
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                                className="h-11"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                    <FormLabel>Full Address *</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="123 Industrial Parkway..." className="h-11" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Detroit" className="h-11" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="flex flex-col gap-2 justify-end">
                    <Label className="text-sm font-medium text-slate-700">Pin Location</Label>
                    <Button type="button" variant="outline" onClick={getLocation} className="h-11 w-full">
                        {isLocating
                            ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            : lat
                                ? <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                                : <MapPin className="h-4 w-4 mr-2" />}
                        {lat ? "Location Captured" : "Get My Location"}
                    </Button>
                    {lat && lng && (
                        <p className="text-xs text-slate-400">
                            {lat.toFixed(5)}, {lng.toFixed(5)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
