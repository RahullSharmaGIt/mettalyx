"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, UserCheck } from "lucide-react";

interface AssignVendorDialogProps {
    jobId: string;
    vendorId: string;
    vendorDisplayName: string; // e.g., "Vendor — Pune Region"
}

export const AssignVendorDialog = ({
    jobId,
    vendorId,
    vendorDisplayName,
}: AssignVendorDialogProps) => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAssign = () => {
        setError(undefined);
        startTransition(async () => {
            const res = await fetch(`/api/admin/jobs/${jobId}/assign`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vendorId }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error ?? "Assignment failed. Please try again.");
                return;
            }

            setOpen(false);
            router.refresh(); // Re-render the server component with updated data
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" />
                    Assign
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Assignment</DialogTitle>
                    <DialogDescription>
                        You are about to assign{" "}
                        <strong className="text-slate-900">{vendorDisplayName}</strong> as the manufacturing
                        partner for this job. The status will change to{" "}
                        <strong className="text-blue-700">ASSIGNED</strong> and the vendor will be notified.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                        {error}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={isPending}
                        className="bg-slate-900 hover:bg-slate-800 text-white"
                    >
                        {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {isPending ? "Assigning…" : "Confirm Assignment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
