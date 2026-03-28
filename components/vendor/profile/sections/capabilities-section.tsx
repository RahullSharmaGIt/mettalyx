"use client";

import { useState } from "react";
import { ProfileCard } from "../profile-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const CAPABILITIES_LIST = [
    "CNC Machining", "CNC Turning", "Laser Cutting", "Sheet Metal",
    "Injection Molding", "3D Printing", "EDM", "Welding", "Surface Treatment",
];

interface CapabilityData {
    capabilities: unknown; // Json field from Prisma
    expertiseLevel: string | null;
    tolerancesSupported: string | null;
    maxPartSize: string | null;
    minPartSize: string | null;
}

interface Props {
    data: CapabilityData;
    onUpdate: (data: CapabilityData) => void;
}

export const CapabilitiesSection = ({ data, onUpdate }: Props) => {
    const initCaps = Array.isArray(data.capabilities) ? (data.capabilities as string[]) : [];

    const [caps, setCaps] = useState<string[]>(initCaps);
    const [expertiseLevel, setExpertiseLevel] = useState(data.expertiseLevel ?? "");
    const [tolerances, setTolerances] = useState(data.tolerancesSupported ?? "");
    const [maxPart, setMaxPart] = useState(data.maxPartSize ?? "");
    const [minPart, setMinPart] = useState(data.minPartSize ?? "");

    const toggleCap = (item: string) =>
        setCaps((prev) => prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]);

    const handleSave = async () => {
        const payload = { capabilities: caps, expertiseLevel, tolerancesSupported: tolerances, maxPartSize: maxPart, minPartSize: minPart };
        const res = await fetch("/api/vendor/capabilities", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to save capabilities");
        onUpdate({ ...data, ...payload });
    };

    return (
        <ProfileCard
            title="Core Capabilities"
            onSave={handleSave}
            readonlyView={
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-2">Manufacturing Capabilities</p>
                        <div className="flex flex-wrap gap-1.5">
                            {initCaps.length > 0
                                ? initCaps.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)
                                : <span className="text-sm text-slate-400 italic">Not set</span>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[["Expertise", data.expertiseLevel], ["Tolerance", data.tolerancesSupported], ["Max Part", data.maxPartSize], ["Min Part", data.minPartSize]].map(([label, val]) => (
                            <div key={label as string}>
                                <p className="text-xs text-slate-500 mb-0.5">{label as string}</p>
                                <p className="text-sm font-medium text-slate-800">{val ?? <span className="text-slate-400 italic">—</span>}</p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        >
            {() => (
                <div className="space-y-5">
                    <div>
                        <Label className="text-xs mb-2 block">Capabilities</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {CAPABILITIES_LIST.map((item) => (
                                <label key={item} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-slate-50">
                                    <Checkbox checked={caps.includes(item)} onCheckedChange={() => toggleCap(item)} />
                                    <span className="text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs mb-1 block">Expertise Level</Label>
                        <Select value={expertiseLevel} onValueChange={setExpertiseLevel}>
                            <SelectTrigger className="h-9"><SelectValue placeholder="Select level" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Beginner">Beginner / Prototyping</SelectItem>
                                <SelectItem value="Intermediate">Intermediate / Low Volume</SelectItem>
                                <SelectItem value="Advanced">Advanced / High Volume</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[["Standard Tolerance", tolerances, setTolerances], ["Max Part Size", maxPart, setMaxPart], ["Min Part Size", minPart, setMinPart]].map(([label, val, setter]) => (
                            <div key={label as string}>
                                <Label className="text-xs mb-1">{label as string}</Label>
                                <Input value={val as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)} className="h-9" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ProfileCard>
    );
};
