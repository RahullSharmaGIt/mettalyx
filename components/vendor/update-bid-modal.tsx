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
import { Loader2, AlertCircle, Edit2, Lock, Clock, Save } from "lucide-react";
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
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs h-9 shadow-sm transition-all flex items-center justify-center gap-2">
                    <Edit2 className="h-3.5 w-3.5" />
                    {isFreeRevision ? "Free Revision Available" : "Edit Quotation"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] border border-slate-200 rounded-2xl shadow-xl p-0 overflow-hidden bg-white">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center">
                        <Edit2 className="h-5 w-5 text-white" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 leading-none">Update Quotation</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium mt-1">
                            {isFreeRevision
                                ? "Instant secure revision available"
                                : "Secure data update protocol"}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-5">
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl font-medium flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-rose-600" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="price" className="text-xs font-medium text-slate-600">Revised Quotation Value (INR)</Label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₹</div>
                                <Input
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    max={currentPrice}
                                    className="h-11 pl-9 text-lg font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:bg-white transition-all font-mono"
                                />
                                <div className="mt-1 text-xs text-slate-400 font-medium">
                                    Current/Max: ₹{currentPrice.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="leadTime" className="text-xs font-medium text-slate-600">Production Lead Time (Days)</Label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <Input
                                    id="leadTime"
                                    type="number"
                                    value={leadTime}
                                    onChange={(e) => setLeadTime(e.target.value)}
                                    className="h-11 pl-10 text-lg font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:bg-white transition-all font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs font-medium text-slate-600">Revision Notes</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="State reasoning for adjustment..."
                                className="min-h-[100px] border border-slate-200 rounded-xl bg-slate-50/50 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:bg-white text-xs font-normal p-3"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading} className="border-slate-200 rounded-xl text-xs font-medium px-5">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        disabled={isLoading || !price || !leadTime}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium px-5 flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Commit Update
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
