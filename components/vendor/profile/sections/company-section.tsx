"use client";

import { useState } from "react";
import { ProfileCard } from "../profile-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, Loader2 } from "lucide-react";

interface CompanyData {
    companyName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    gstNumber: string | null;
    yearsOfExperience: number | null;
    address: string | null;
    city: string | null;
    lat: number | null;
    lng: number | null;
}

interface Props {
    data: CompanyData;
    onUpdate: (data: CompanyData) => void;
}

const Field = ({ label, value }: { label: string; value: string | number | null }) => (
    <div>
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value ?? <span className="text-slate-400 italic">Not set</span>}</p>
    </div>
);

export const CompanySection = ({ data, onUpdate }: Props) => {
    const [form, setForm] = useState<CompanyData>(data);
    const [isLocating, setIsLocating] = useState(false);

    const set = (k: keyof CompanyData, v: string | number | null) =>
        setForm((prev) => ({ ...prev, [k]: v }));

    const getLocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm((prev) => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude }));
                setIsLocating(false);
            },
            () => setIsLocating(false)
        );
    };

    const handleSave = async () => {
        const res = await fetch("/api/vendor/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to save company details");
        onUpdate(form);
    };

    return (
        <ProfileCard
            title="Company Details"
            onSave={handleSave}
            readonlyView={
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Company Name" value={data.companyName} />
                    <Field label="Contact Email" value={data.contactEmail} />
                    <Field label="Contact Phone" value={data.contactPhone} />
                    <Field label="GST / Tax Number" value={data.gstNumber} />
                    <Field label="Years of Experience" value={data.yearsOfExperience} />
                    <Field label="City" value={data.city} />
                    <div className="sm:col-span-2">
                        <Field label="Address" value={data.address} />
                    </div>
                    {data.lat && data.lng && (
                        <div className="sm:col-span-2">
                            <Field label="Coordinates" value={`${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}`} />
                        </div>
                    )}
                </div>
            }
        >
            {() => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(["companyName", "contactEmail", "contactPhone", "gstNumber"] as const).map((field) => (
                        <div key={field}>
                            <Label className="text-xs mb-1">{field.replace(/([A-Z])/g, " $1").trim()}</Label>
                            <Input
                                value={form[field] ?? ""}
                                onChange={(e) => set(field, e.target.value)}
                                className="h-9"
                            />
                        </div>
                    ))}

                    <div>
                        <Label className="text-xs mb-1">Years of Experience</Label>
                        <Input
                            type="number"
                            min={0}
                            value={form.yearsOfExperience ?? ""}
                            onChange={(e) => set("yearsOfExperience", parseInt(e.target.value) || 0)}
                            className="h-9"
                        />
                    </div>

                    <div>
                        <Label className="text-xs mb-1">City</Label>
                        <Input value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} className="h-9" />
                    </div>

                    <div className="sm:col-span-2">
                        <Label className="text-xs mb-1">Address</Label>
                        <Input value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} className="h-9" />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={getLocation} className="h-9">
                            {isLocating ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : form.lat ? <CheckCircle className="h-4 w-4 mr-1.5 text-emerald-500" /> : <MapPin className="h-4 w-4 mr-1.5" />}
                            {form.lat ? "Location Pinned" : "Pin My Location"}
                        </Button>
                        {form.lat && form.lng && (
                            <span className="text-xs text-slate-400">{form.lat.toFixed(5)}, {form.lng.toFixed(5)}</span>
                        )}
                    </div>
                </div>
            )}
        </ProfileCard>
    );
};
