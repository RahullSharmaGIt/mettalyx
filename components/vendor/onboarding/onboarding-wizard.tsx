"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useState, useTransition } from "react";
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { VendorOnboardingSchema } from "@/schemas";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./progress-bar";
import { STEPS, TOTAL_STEPS } from "./step-config";
import type { FormValues } from "./step-config";

import { CompanyStep } from "./steps/company-step";
import { CapabilityStep } from "./steps/capability-step";
import { ExperienceStep } from "./steps/experience-step";
import { CertificationStep } from "./steps/certification-step";
import { DocumentsStep } from "./steps/documents-step";
import { AgreementStep } from "./steps/agreement-step";

import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";

const STEP_COMPONENTS: Array<React.ComponentType<{ form: UseFormReturn<FormValues> }>> = [
    CompanyStep as React.ComponentType<{ form: UseFormReturn<FormValues> }>,
    CapabilityStep as React.ComponentType<{ form: UseFormReturn<FormValues> }>,
    ExperienceStep as React.ComponentType<{ form: UseFormReturn<FormValues> }>,
    CertificationStep as React.ComponentType<{ form: UseFormReturn<FormValues> }>,
    DocumentsStep as React.ComponentType<{ form: UseFormReturn<FormValues> }>,
    AgreementStep as React.ComponentType<{ form: UseFormReturn<FormValues> }>,
];

export const OnboardingWizard = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [error, setError] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const isLastStep = currentStep === TOTAL_STEPS - 1;
    const stepConfig = STEPS[currentStep];
    const StepComponent = STEP_COMPONENTS[currentStep];

    // Use 'any' for the third generic to sidestep the @hookform/resolvers version divergence
    const form = useForm<FormValues, any, FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(VendorOnboardingSchema) as any,
        defaultValues: {
            companyName: "",
            contactPhone: "",
            contactEmail: "",
            address: "",
            city: "",
            lat: null,
            lng: null,
            gstNumber: "",
            capabilities: [],
            expertiseLevel: "",
            tolerancesSupported: "",
            maxPartSize: "",
            minPartSize: "",
            certifications: [],
            yearsOfExperience: 1,
            industriesServed: [],
            pastWorkDescription: "",
            sampleWorkFiles: [],
            isoCertificates: [],
            qualityDocuments: [],
            complianceProofs: [],
            isAgreementAccepted: false,
        },
        mode: "onTouched",
    });

    const goNext = async () => {
        // Trigger validation only for the fields on this step
        const fieldsToValidate = stepConfig.fields;
        const valid = await form.trigger(fieldsToValidate as Array<keyof FormValues>);
        if (!valid) return;
        setDirection(1);
        setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    };

    const goBack = () => {
        setDirection(-1);
        setCurrentStep((s) => Math.max(s - 1, 0));
    };

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        setError(undefined);
        startTransition(async () => {
            try {
                const res = await fetch("/api/vendor/onboarding", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error ?? "Submission failed. Please try again.");
                    return;
                }
                router.push("/vendor/dashboard");
            } catch {
                setError("Something went wrong. Please try again.");
            }
        });
    };

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center py-12 px-4">
            <div className="w-full max-w-2xl">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Onboarding</h1>
                    <p className="text-sm text-slate-500 mt-1">Complete your profile to start receiving orders</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                    {/* Progress */}
                    <div className="px-8 pt-7 pb-4 border-b border-slate-100">
                        <ProgressBar currentStep={currentStep} />
                    </div>

                    {/* Step header */}
                    <div className="px-8 pt-6 pb-2">
                        <h2 className="text-xl font-bold text-slate-900">{stepConfig.title}</h2>
                        <p className="text-sm text-slate-500 mt-1">{stepConfig.description}</p>
                    </div>

                    {/* Step content — animated */}
                    <div className="px-8 py-6 min-h-[340px]">
                        <Form {...form}>
                            <form id="onboarding-form" onSubmit={form.handleSubmit(onSubmit)}>
                                <AnimatePresence mode="wait" custom={direction}>
                                    <motion.div
                                        key={currentStep}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.22, ease: "easeInOut" }}
                                    >
                                        <StepComponent form={form as UseFormReturn<FormValues>} />
                                    </motion.div>
                                </AnimatePresence>
                            </form>
                        </Form>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mx-8 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    {/* Navigation footer */}
                    <div className="px-8 pb-7 flex items-center justify-between border-t border-slate-100 pt-5">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={goBack}
                            disabled={currentStep === 0}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>

                        {isLastStep ? (
                            <Button
                                type="submit"
                                form="onboarding-form"
                                disabled={isPending}
                                className="bg-slate-900 hover:bg-slate-800 text-white gap-2 px-6"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                {isPending ? "Submitting…" : "Submit Profile"}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={goNext}
                                className="bg-slate-900 hover:bg-slate-800 text-white gap-2 px-6"
                            >
                                Continue
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Step dots */}
                <div className="flex justify-center gap-2 mt-6">
                    {STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? "w-6 bg-slate-900" : i < currentStep ? "w-3 bg-slate-400" : "w-3 bg-slate-200"
                                }`}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};
