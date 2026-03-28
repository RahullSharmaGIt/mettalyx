"use client";

import { useState } from "react";
import { ProfileCard } from "../profile-card";
import { FilePreview } from "../file-preview";
import { FileUpload } from "@/components/vendor/onboarding/file-upload";
import { Label } from "@/components/ui/label";

interface VendorDoc {
    id: string;
    type: string;
    url: string;
    name: string;
}

interface Props {
    documents: VendorDoc[];
    onUpdate: (docs: VendorDoc[]) => void;
}

const byType = (docs: VendorDoc[], type: string) => docs.filter((d) => d.type === type).map((d) => d.url);

export const DocumentsSection = ({ documents, onUpdate }: Props) => {
    const [isoCerts, setIsoCerts] = useState<string[]>(byType(documents, "ISO_CERTIFICATE"));
    const [qualityDocs, setQualityDocs] = useState<string[]>(byType(documents, "QUALITY_DOCUMENT"));
    const [compliance, setCompliance] = useState<string[]>(byType(documents, "COMPLIANCE_PROOF"));

    const handleSave = async () => {
        const res = await fetch("/api/vendor/documents", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isoCertificates: isoCerts, qualityDocuments: qualityDocs, complianceProofs: compliance }),
        });
        if (!res.ok) throw new Error("Failed to save documents");
        // Return updated docs in the shape the parent expects
        const updated = await res.json() as VendorDoc[];
        onUpdate(updated);
    };

    const DocGroup = ({ label, urls }: { label: string; urls: string[] }) => (
        <div>
            <p className="text-xs text-slate-500 mb-2">{label}</p>
            {urls.length > 0
                ? <div className="space-y-2">{urls.map((u) => <FilePreview key={u} url={u} />)}</div>
                : <p className="text-sm text-slate-400 italic">None uploaded</p>}
        </div>
    );

    return (
        <ProfileCard
            title="Compliance & Documents"
            onSave={handleSave}
            readonlyView={
                <div className="space-y-5">
                    <DocGroup label="ISO & Quality Certificates" urls={byType(documents, "ISO_CERTIFICATE")} />
                    <DocGroup label="Quality Documents" urls={byType(documents, "QUALITY_DOCUMENT")} />
                    <DocGroup label="Compliance Proofs" urls={byType(documents, "COMPLIANCE_PROOF")} />
                </div>
            }
        >
            {() => (
                <div className="space-y-6">
                    <div>
                        <Label className="text-xs mb-2 block">ISO & Quality Certificates</Label>
                        <FileUpload value={isoCerts} onUpload={setIsoCerts} multiple accept="application/pdf,image/*" title="Upload ISO / CE / UL certificates" />
                    </div>
                    <div>
                        <Label className="text-xs mb-2 block">Quality Documents</Label>
                        <FileUpload value={qualityDocs} onUpload={setQualityDocs} multiple accept="application/pdf,image/*" title="Upload quality manuals, procedures" />
                    </div>
                    <div>
                        <Label className="text-xs mb-2 block">Compliance Proofs</Label>
                        <FileUpload value={compliance} onUpload={setCompliance} multiple accept="application/pdf,image/*" title="Upload REACH, RoHS, export docs" />
                    </div>
                </div>
            )}
        </ProfileCard>
    );
};
