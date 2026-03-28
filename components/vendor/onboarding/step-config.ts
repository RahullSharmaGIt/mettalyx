import { VendorOnboardingSchema } from "@/schemas";
import { z } from "zod";

export type FormValues = z.infer<typeof VendorOnboardingSchema>;

export interface StepConfig {
    id: string;
    title: string;
    description: string;
    fields: (keyof FormValues)[];
}

export const STEPS: StepConfig[] = [
    {
        id: "company",
        title: "Company Details",
        description: "Tell us about your business — name, contact, and location.",
        fields: ["companyName", "contactPhone", "contactEmail", "address", "city", "yearsOfExperience"],
    },
    {
        id: "capabilities",
        title: "Core Capabilities",
        description: "What manufacturing processes and tolerances do you support?",
        fields: ["capabilities", "expertiseLevel", "tolerancesSupported", "maxPartSize", "minPartSize"],
    },
    {
        id: "experience",
        title: "Experience & Past Work",
        description: "Help buyers understand the industries you've served.",
        fields: ["industriesServed", "pastWorkDescription", "sampleWorkFiles"],
    },
    {
        id: "certifications",
        title: "Certifications",
        description: "List your official quality certifications.",
        fields: ["certifications"],
    },
    {
        id: "documents",
        title: "Compliance & Documents",
        description: "Upload your ISO certificates and compliance documents.",
        fields: ["isoCertificates", "complianceProofs"],
    },
    {
        id: "agreement",
        title: "Legal Agreement",
        description: "Review and accept our vendor terms before submitting.",
        fields: ["isAgreementAccepted"],
    },
];

export const TOTAL_STEPS = STEPS.length;
