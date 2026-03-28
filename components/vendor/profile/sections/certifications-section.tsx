"use client";

import { useState } from "react";
import { ProfileCard } from "../profile-card";
import { FilePreview } from "../file-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/vendor/onboarding/file-upload";
import { Plus, Trash2, Award } from "lucide-react";

interface Certification {
    id?: string;
    name: string;
    issuedBy: string | null;
    issuedDate: Date | string | null;
    certificateUrl: string;
}

interface Props {
    data: Certification[];
    onUpdate: (data: Certification[]) => void;
}

const formatDate = (d: Date | string | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export const CertificationsSection = ({ data, onUpdate }: Props) => {
    const [certs, setCerts] = useState<Certification[]>(data);

    const addCert = () => setCerts((prev) => [...prev, { name: "", issuedBy: "", issuedDate: null, certificateUrl: "" }]);
    const removeCert = (i: number) => setCerts((prev) => prev.filter((_, idx) => idx !== i));
    const update = (i: number, k: keyof Certification, v: string | null) =>
        setCerts((prev) => prev.map((c, idx) => idx === i ? { ...c, [k]: v } : c));

    const handleSave = async () => {
        const res = await fetch("/api/vendor/certifications", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ certifications: certs.map((c) => ({ ...c, issuedDate: c.issuedDate ? new Date(c.issuedDate).toISOString() : null })) }),
        });
        if (!res.ok) throw new Error("Failed to save certifications");
        onUpdate(certs);
    };

    return (
        <ProfileCard
            title="Certifications"
            onSave={handleSave}
            readonlyView={
                <div className="space-y-3">
                    {data.length === 0 && <p className="text-sm text-slate-400 italic">No certifications added</p>}
                    {data.map((cert, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                            <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                                <Award className="h-4 w-4 text-slate-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">{cert.name}</p>
                                {cert.issuedBy && <p className="text-xs text-slate-500">Issued by {cert.issuedBy}</p>}
                                {cert.issuedDate && <p className="text-xs text-slate-400">{formatDate(cert.issuedDate)}</p>}
                                {cert.certificateUrl && (
                                    <div className="mt-2">
                                        <FilePreview url={cert.certificateUrl} label="Certificate" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            }
        >
            {() => (
                <div className="space-y-4">
                    {certs.map((cert, i) => (
                        <div key={i} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-700">Certification {i + 1}</span>
                                <Button type="button" variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 h-7 px-2" onClick={() => removeCert(i)}>
                                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div><Label className="text-xs mb-1">Name *</Label><Input value={cert.name} onChange={(e) => update(i, "name", e.target.value)} className="h-9" placeholder="ISO 9001:2015" /></div>
                                <div><Label className="text-xs mb-1">Issued By</Label><Input value={cert.issuedBy ?? ""} onChange={(e) => update(i, "issuedBy", e.target.value)} className="h-9" placeholder="TUV SUD" /></div>
                            </div>
                            <div>
                                <Label className="text-xs mb-1">Issue Date</Label>
                                <Input type="date" className="h-9" value={cert.issuedDate ? new Date(cert.issuedDate).toISOString().split("T")[0] : ""} onChange={(e) => update(i, "issuedDate", e.target.value || null)} />
                            </div>
                            <div>
                                <Label className="text-xs mb-2 block">Certificate File *</Label>
                                <FileUpload value={cert.certificateUrl ? [cert.certificateUrl] : []} onUpload={(urls) => update(i, "certificateUrl", urls[0] ?? "")} accept="application/pdf,image/*" title="Upload certificate" />
                            </div>
                        </div>
                    ))}

                    <Button type="button" variant="outline" className="w-full border-dashed h-10" onClick={addCert}>
                        <Plus className="h-4 w-4 mr-2" /> Add Certification
                    </Button>
                </div>
            )}
        </ProfileCard>
    );
};
