"use client";

import { useState } from "react";
import { ProfileCard } from "../profile-card";
import { FilePreview } from "../file-preview";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/vendor/onboarding/file-upload";

const INDUSTRIES_LIST = [
    "Automotive", "Aerospace", "Medical Devices", "Industrial",
    "Consumer Electronics", "Defense", "Energy", "Robotics",
];

interface ExperienceData {
    industriesServed: unknown;
    pastWorkDescription: string | null;
    sampleWorkFiles: string[];
}

interface Props {
    data: ExperienceData;
    onUpdate: (data: ExperienceData) => void;
}

export const ExperienceSection = ({ data, onUpdate }: Props) => {
    const initIndustries = Array.isArray(data.industriesServed) ? (data.industriesServed as string[]) : [];
    const [industries, setIndustries] = useState<string[]>(initIndustries);
    const [description, setDescription] = useState(data.pastWorkDescription ?? "");
    const [sampleFiles, setSampleFiles] = useState<string[]>(data.sampleWorkFiles ?? []);

    const toggleIndustry = (item: string) =>
        setIndustries((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);

    const handleSave = async () => {
        // Documents are saved via the documents API
        const res = await fetch("/api/vendor/documents", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sampleWorkFiles: sampleFiles }),
        });
        if (!res.ok) throw new Error("Failed to save experience");

        // Profile fields (industries, description) saved via profile API
        const res2 = await fetch("/api/vendor/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pastWorkDescription: description }),
        });
        if (!res2.ok) throw new Error("Failed to save experience");

        onUpdate({ industriesServed: industries, pastWorkDescription: description, sampleWorkFiles: sampleFiles });
    };

    return (
        <ProfileCard
            title="Experience & Past Work"
            onSave={handleSave}
            readonlyView={
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-2">Industries Served</p>
                        <div className="flex flex-wrap gap-1.5">
                            {initIndustries.length > 0
                                ? initIndustries.map((i) => <Badge key={i} variant="outline">{i}</Badge>)
                                : <span className="text-sm text-slate-400 italic">Not set</span>}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Past Work Description</p>
                        <p className="text-sm text-slate-800">{data.pastWorkDescription ?? <span className="italic text-slate-400">Not set</span>}</p>
                    </div>
                    {sampleFiles.length > 0 && (
                        <div>
                            <p className="text-xs text-slate-500 mb-2">Sample Work Files</p>
                            <div className="space-y-2">
                                {sampleFiles.map((url) => <FilePreview key={url} url={url} />)}
                            </div>
                        </div>
                    )}
                </div>
            }
        >
            {() => (
                <div className="space-y-5">
                    <div>
                        <Label className="text-xs mb-2 block">Industries Served</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {INDUSTRIES_LIST.map((item) => (
                                <label key={item} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-slate-50">
                                    <Checkbox checked={industries.includes(item)} onCheckedChange={() => toggleIndustry(item)} />
                                    <span className="text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs mb-1 block">Past Work Description</Label>
                        <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none" />
                    </div>
                    <div>
                        <Label className="text-xs mb-2 block">Sample Work Files</Label>
                        <FileUpload value={sampleFiles} onUpload={setSampleFiles} multiple accept="image/*,application/pdf" title="Upload photos or drawings" />
                    </div>
                </div>
            )}
        </ProfileCard>
    );
};
