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
                <Button className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-slate-900 rounded-none font-black uppercase text-[10px] tracking-widest h-10 shadow-[4px_4px_0px_#0F172A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-center gap-2">
                    <Edit2 className="h-3.5 w-3.5" />
                    {isFreeRevision ? "Free Revision Available" : "Edit Quotation"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] border-4 border-slate-900 rounded-none shadow-[12px_12px_0px_#0F172A] p-0 overflow-hidden bg-white">
                <div className="p-6 border-b-4 border-slate-900 bg-emerald-50 flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                        <Edit2 className="h-5 w-5 text-white" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-900 leading-none">Update Quotation</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-1">
                            {isFreeRevision
                                ? "One-time instant secure revision terminal"
                                : "Secure data update protocol – requires admin audit"}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6">
                    {error && (
                        <div className="bg-rose-50 border-4 border-rose-500 text-rose-700 text-[10px] p-4 font-black uppercase tracking-widest flex items-start gap-4 shadow-[4px_4px_0px_#F43F5E]">
                            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Revised Quotation Value (INR)</Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-slate-300">₹</div>
                                <Input
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    max={currentPrice}
                                    className="h-16 pl-10 text-2xl font-[1000] border-4 border-slate-900 rounded-none bg-slate-50 focus-visible:ring-0 transition-all font-mono"
                                />
                                <div className="mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                    Current/Max: ₹{currentPrice.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="leadTime" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Production Lead Time (Days)</Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-slate-300 transform -scale-x-100 rotate-12">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <Input
                                    id="leadTime"
                                    type="number"
                                    value={leadTime}
                                    onChange={(e) => setLeadTime(e.target.value)}
                                    className="h-16 pl-12 text-2xl font-[1000] border-4 border-slate-900 rounded-none bg-slate-50 focus-visible:ring-0 transition-all font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Revision Scoping Notes</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="State internal reasoning for adjustment..."
                                className="min-h-[120px] border-4 border-slate-900 rounded-none bg-slate-50 focus-visible:ring-0 text-sm font-medium p-4"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t-4 border-slate-900 flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading} className="border-4 border-slate-900 rounded-none font-black uppercase shadow-[4px_4px_0px_#0F172A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all px-8">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        disabled={isLoading || !price || !leadTime}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white border-4 border-slate-900 rounded-none font-black uppercase shadow-[4px_4px_0px_#0F172A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all px-8 flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Commit Update
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
