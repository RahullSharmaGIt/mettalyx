"use client";

import { TOTAL_STEPS } from "./step-config";

interface ProgressBarProps {
    currentStep: number;
}

export const ProgressBar = ({ currentStep }: ProgressBarProps) => {
    const progress = Math.round(((currentStep + 1) / TOTAL_STEPS) * 100);

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                <span>Step {currentStep + 1} of {TOTAL_STEPS}</span>
                <span>{progress}% complete</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};
