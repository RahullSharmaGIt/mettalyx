"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { approveJob } from "@/app/admin/oem/actions";
import { Loader2 } from "lucide-react";

interface JobApprovalDialogProps {
    jobId: string;
}

export function JobApprovalDialog({ jobId }: JobApprovalDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [targetPrice, setTargetPrice] = useState("");
    const [minFloor, setMinFloor] = useState("");

    const handleApprove = async () => {
        if (!targetPrice || !minFloor) return;

        setIsLoading(true);
        try {
            await approveJob(jobId, parseFloat(targetPrice), parseFloat(minFloor));
            setOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Approve
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Approve Job</DialogTitle>
                    <DialogDescription>
                        Setting the job status to OPEN allows Verified vendors to place bids. You must set pricing boundaries first.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="targetPrice">Target Vendor Price (₹)</Label>
                        <Input
                            id="targetPrice"
                            type="number"
                            placeholder="e.g. 50000"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">The estimated fair value you want vendors to align with.</p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="minFloor">Minimum Price Floor (₹)</Label>
                        <Input
                            id="minFloor"
                            type="number"
                            placeholder="e.g. 40000"
                            value={minFloor}
                            onChange={(e) => setMinFloor(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Bids below this value will be blocked to enforce minimum quality standards.</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApprove}
                        disabled={isLoading || !targetPrice || !minFloor}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Approve & Open for Bidding
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
