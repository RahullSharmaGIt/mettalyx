"use client";

import { useState } from "react";
import { CompanySection } from "./sections/company-section";
import { CapabilitiesSection } from "./sections/capabilities-section";
import { ExperienceSection } from "./sections/experience-section";
import { CertificationsSection } from "./sections/certifications-section";
import { DocumentsSection } from "./sections/documents-section";
import { AgreementSection } from "./sections/agreement-section";

// Mirrors the Prisma include shape from GET /api/vendor/profile
export interface VendorProfileData {
    companyName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    gstNumber: string | null;
    yearsOfExperience: number | null;
    address: string | null;
    city: string | null;
    lat: number | null;
    lng: number | null;
    industriesServed: unknown;
    pastWorkDescription: string | null;
    isAgreementAccepted: boolean;
    capabilities: {
        capabilities: unknown;
        expertiseLevel: string | null;
        tolerancesSupported: string | null;
        maxPartSize: string | null;
        minPartSize: string | null;
    } | null;
    certifications: {
        id?: string;
        name: string;
        issuedBy: string | null;
        issuedDate: Date | null;
        certificateUrl: string;
    }[];
    documents: {
        id: string;
        type: string;
        url: string;
        name: string;
    }[];
}

interface Props {
    initialData: VendorProfileData;
}

export const ProfilePage = ({ initialData }: Props) => {
    const [profile, setProfile] = useState<VendorProfileData>(initialData);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 space-y-5">
            {/* Page header */}
            <div className="mb-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile Settings</h1>
                <p className="text-sm text-slate-500 mt-1">
                    View and update your vendor profile information. Changes take effect immediately.
                </p>
            </div>

            {/* Sections */}
            <CompanySection
                data={{
                    companyName: profile.companyName,
                    contactEmail: profile.contactEmail,
                    contactPhone: profile.contactPhone,
                    gstNumber: profile.gstNumber,
                    yearsOfExperience: profile.yearsOfExperience,
                    address: profile.address,
                    city: profile.city,
                    lat: profile.lat,
                    lng: profile.lng,
                }}
                onUpdate={(updated) => setProfile((p) => ({ ...p, ...updated }))}
            />

            <CapabilitiesSection
                data={profile.capabilities ?? {
                    capabilities: [],
                    expertiseLevel: null,
                    tolerancesSupported: null,
                    maxPartSize: null,
                    minPartSize: null,
                }}
                onUpdate={(updated) => setProfile((p) => ({ ...p, capabilities: updated }))}
            />

            <ExperienceSection
                data={{
                    industriesServed: profile.industriesServed,
                    pastWorkDescription: profile.pastWorkDescription,
                    sampleWorkFiles: profile.documents
                        .filter((d) => d.type === "SAMPLE_WORK")
                        .map((d) => d.url),
                }}
                onUpdate={(updated) =>
                    setProfile((p) => ({
                        ...p,
                        industriesServed: updated.industriesServed,
                        pastWorkDescription: updated.pastWorkDescription,
                    }))
                }
            />

            <CertificationsSection
                data={profile.certifications}
                onUpdate={(updated) =>
                    setProfile((p) => ({
                        ...p,
                        certifications: updated.map((c) => ({
                            ...c,
                            issuedDate: c.issuedDate ? new Date(c.issuedDate) : null,
                        })),
                    }))
                }
            />

            <DocumentsSection
                documents={profile.documents}
                onUpdate={(updated) => setProfile((p) => ({ ...p, documents: updated }))}
            />

            <AgreementSection accepted={profile.isAgreementAccepted} />
        </div>
    );
};
