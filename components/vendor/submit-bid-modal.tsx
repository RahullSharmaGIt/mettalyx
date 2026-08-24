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
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { submitBid } from "@/actions/vendor-bids";
import { useRouter } from "next/navigation";

interface SubmitBidModalProps {
    jobId: string;
    minPriceFloor: number | null;
    targetPrice: number | null;
    hasBid: boolean;
    lowestBid: number | null;
    maxLeadTimeDays?: number;
    deadline?: Date;
}

export function SubmitBidModal({ jobId, minPriceFloor, targetPrice, hasBid, lowestBid, maxLeadTimeDays, deadline }: SubmitBidModalProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [price, setPrice] = useState("");
    const [leadTime, setLeadTime] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);
        const parsedPrice = parseFloat(price);
        const parsedLeadTime = parseInt(leadTime, 10);

        if (isNaN(parsedPrice) || isNaN(parsedLeadTime)) {
            setError("Please enter valid numerical values for Price and Lead Time.");
            return;
        }

        if (minPriceFloor !== null && parsedPrice < minPriceFloor) {
            setError(`Bid rejected. The Minimum Price Floor set for this job is ₹${minPriceFloor.toLocaleString()} to ensure quality standards. We do not accept bids below this margin.`);
            return;
        }

        if (maxLeadTimeDays && parsedLeadTime > maxLeadTimeDays) {
            setError(`Lead time exceeds the OEM deadline threshold of ${maxLeadTimeDays} days. Please enter ${maxLeadTimeDays} days or less.`);
            return;
        }

        setIsLoading(true);
        try {
            await submitBid(jobId, parsedPrice, parsedLeadTime, notes);
            setOpen(false);
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to submit quote. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (hasBid) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-emerald-700 border-emerald-500 hover:bg-emerald-50">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Bid Submitted
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Quote Already Submitted</DialogTitle>
                        <DialogDescription>
                            You have already placed a bid for this manufacturing job.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm text-slate-700">
                        To view the status of your bid or to request a managed revision, please visit your Vendor Dashboard.
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                        <Button onClick={() => { setOpen(false); router.push("/vendor/dashboard"); }}>
                            Go to Dashboard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold">
                    Submit Quote
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Submit Your Quote</DialogTitle>
                    <DialogDescription>
                        Place a competitive bid. {targetPrice ? `The buyer is targeting around ₹${targetPrice.toLocaleString()}.` : ""}
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
                        <Label htmlFor="price">Proposed Price (₹)</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder={targetPrice ? targetPrice.toString() : "e.g. 50000"}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        {price && lowestBid !== null && parseFloat(price) > lowestBid && (
                            <p className="text-xs text-amber-600 bg-amber-50 p-2 border border-amber-200 rounded">
                                Note: Your bid is currently ₹{(parseFloat(price) - lowestBid).toLocaleString()} higher than the lead offer. Consider a more competitive price to increase your chances.
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="leadTime">Estimated Lead Time (Days)</Label>
                            {maxLeadTimeDays && (
                                <span className="text-xs font-semibold text-rose-600">
                                    Max limit: {maxLeadTimeDays} days
                                </span>
                            )}
                        </div>
                        <Input
                            id="leadTime"
                            type="number"
                            max={maxLeadTimeDays}
                            placeholder={maxLeadTimeDays ? `Max ${maxLeadTimeDays} days` : "e.g. 14"}
                            value={leadTime}
                            onChange={(e) => {
                                const val = e.target.value;
                                setLeadTime(val);
                                if (maxLeadTimeDays && parseInt(val, 10) > maxLeadTimeDays) {
                                    setError(`Lead time threshold exceeded! OEM deadline requires completion within ${maxLeadTimeDays} days.`);
                                } else {
                                    setError(null);
                                }
                            }}
                        />
                        {maxLeadTimeDays && deadline && (
                            <p className="text-[11px] text-slate-500">
                                OEM deadline is {new Date(deadline).toLocaleDateString()}. Your delivery time cannot exceed <strong>{maxLeadTimeDays} days</strong>.
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Any conditions, exclusions, or value-adds you are providing."
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
                        onClick={handleSubmit}
                        disabled={isLoading || !price || !leadTime || (!!maxLeadTimeDays && parseInt(leadTime, 10) > maxLeadTimeDays)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Submit Bid
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
