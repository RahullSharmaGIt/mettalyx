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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, Edit2, Lock, Clock } from "lucide-react";
import { updateBid, requestBidUnlock } from "@/actions/vendor-bids";
import { useRouter } from "next/navigation";

interface UpdateBidModalProps {
    bidId: string;
    currentPrice: number;
    currentLeadTime: number;
    currentNotes: string | null;
    updateCount: number;
    isLocked: boolean;
    unlockRequested: boolean;
    minPriceFloor: number | null;
}

export function UpdateBidModal({
    bidId, currentPrice, currentLeadTime, currentNotes, updateCount, isLocked, unlockRequested, minPriceFloor
}: UpdateBidModalProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [price, setPrice] = useState(currentPrice.toString());
    const [leadTime, setLeadTime] = useState(currentLeadTime.toString());
    const [notes, setNotes] = useState(currentNotes || "");
    const [error, setError] = useState<string | null>(null);

    const isFreeRevision = updateCount < 1;

    const handleUpdate = async () => {
        setError(null);
        const parsedPrice = parseFloat(price);
        const parsedLeadTime = parseInt(leadTime, 10);

        if (isNaN(parsedPrice) || isNaN(parsedLeadTime)) {
            setError("Please enter valid numerical values.");
            return;
        }

        if (parsedPrice > currentPrice) {
            setError("Revised price must be equal to or lower than your current bid.");
            return;
        }

        if (minPriceFloor !== null && parsedPrice < minPriceFloor) {
            setError(`Bid rejected. The Minimum Price Floor set for this job is ₹${minPriceFloor.toLocaleString()}.`);
            return;
        }

        setIsLoading(true);
        try {
            await updateBid(bidId, parsedPrice, parsedLeadTime, notes);
            setOpen(false);
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to update quote.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlockRequest = async () => {
        setIsLoading(true);
        try {
            await requestBidUnlock(bidId);
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to request unlock.");
        } finally {
            setIsLoading(false);
        }
    };

    if (unlockRequested) {
        return (
            <Button variant="outline" disabled className="w-full text-amber-600 border-amber-300 bg-amber-50">
                <Clock className="h-4 w-4 mr-2" />
                Unlock Pending...
            </Button>
        );
    }

    if (isLocked) {
        return (
            <Button
                variant="outline"
                onClick={handleUnlockRequest}
                disabled={isLoading}
                className="w-full hover:bg-slate-100 text-slate-700"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                Request Unlock
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                    <Edit2 className="h-4 w-4 mr-2" />
                    {isFreeRevision ? "Free Revision" : "Edit Bid"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Your Quote</DialogTitle>
                    <DialogDescription>
                        {isFreeRevision
                            ? "You have 1 free instant revision remaining."
                            : "Warning: Updating this bid will lock it from further revisions until an Admin unlocks it."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-md flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="price">Proposed Price (₹) - Max ₹{currentPrice.toLocaleString()}</Label>
                        <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            max={currentPrice}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="leadTime">Estimated Lead Time (Days)</Label>
                        <Input
                            id="leadTime"
                            type="number"
                            value={leadTime}
                            onChange={(e) => setLeadTime(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="resize-none h-20"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        disabled={isLoading || !price || !leadTime}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Confirm Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
