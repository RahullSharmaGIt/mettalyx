"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, CheckCircle, XCircle } from "lucide-react";

interface Props {
    accepted: boolean;
}

export const AgreementSection = ({ accepted }: Props) => (
    <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-5">
            <CardTitle className="text-base font-semibold text-slate-800">Legal Agreement</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
            <div className="flex items-center gap-3 p-4 border rounded-xl bg-slate-50">
                {accepted
                    ? <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                    : <XCircle className="h-5 w-5 text-red-400 shrink-0" />}
                <div>
                    <p className="text-sm font-semibold text-slate-800">
                        {accepted ? "Agreement Accepted" : "Agreement Not Accepted"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {accepted
                            ? "You have accepted the vendor terms and conditions."
                            : "You have not yet accepted the vendor terms. Please complete onboarding."}
                    </p>
                </div>
                <ShieldCheck className="h-5 w-5 text-slate-300 ml-auto shrink-0" />
            </div>
        </CardContent>
    </Card>
);
