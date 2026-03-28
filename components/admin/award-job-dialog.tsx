"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { awardJob } from "@/actions/award-job";
import { BidRejectionReason } from "@prisma/client";

interface AwardJobDialogProps {
    jobId: string;
    winningBidId: string;
    winningVendorId: string;
    winningVendorName: string;
    winningPrice: number;
    losingBids: {
        id: string;
        vendorName: string;
    }[];
}

export function AwardJobDialog({
    jobId,
    winningBidId,
    winningVendorId,
    winningVendorName,
    winningPrice,
    losingBids
}: AwardJobDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    // State for rejection reasons and custom notes per losing bid
    const [rejections, setRejections] = useState<Record<string, { reason: BidRejectionReason, note: string }>>(
        losingBids.reduce((acc, bid) => ({
            ...acc,
            [bid.id]: { reason: "PRICE", note: "" }
        }), {})
    );

    const handleReasonChange = (bidId: string, reason: BidRejectionReason) => {
        setRejections(prev => ({ ...prev, [bidId]: { ...prev[bidId], reason } }));
    };

    const handleNoteChange = (bidId: string, note: string) => {
        setRejections(prev => ({ ...prev, [bidId]: { ...prev[bidId], note } }));
    };

    const onSubmit = async () => {
        setPending(true);
        try {
            // Map the state back to the expected array format for the server action
            const feedbackArray = losingBids.map(bid => ({
                bidId: bid.id,
                reason: rejections[bid.id].reason,
                note: rejections[bid.id].note || null
            }));

            await awardJob(jobId, winningVendorId, winningBidId, winningPrice, feedbackArray);

            alert("Job officially awarded!");
            setOpen(false);
            router.refresh();
        } catch (error: any) {
            alert(error.message || "Failed to award job");
        } finally {
            setPending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Award Job</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Confirm Award
                    </DialogTitle>
                    <DialogDescription>
                        You are about to award this contract to <strong>{winningVendorName}</strong> for <strong>₹{winningPrice.toLocaleString()}</strong>.
                        This action will lock the job, grant S3 file access to the winner, and reject all other bids.
                    </DialogDescription>
                </DialogHeader>

                {losingBids.length > 0 && (
                    <div className="mt-4 space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mb-2 flex items-start gap-2">
                            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800">
                                To maintain vendor relationships, please provide a rejection reason for the {losingBids.length} unselected bids. This determines the consolation message they see.
                            </p>
                        </div>

                        {losingBids.map((bid) => (
                            <div key={bid.id} className="border p-4 rounded-md bg-slate-50 space-y-3">
                                <p className="font-semibold text-sm">Vendor: {bid.vendorName}</p>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Primary Reason</Label>
                                    <Select
                                        value={rejections[bid.id].reason}
                                        onValueChange={(val) => handleReasonChange(bid.id, val as BidRejectionReason)}
                                    >
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select a reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PRICE">Price wasn't competitive</SelectItem>
                                            <SelectItem value="LEAD_TIME">Lead time was too long</SelectItem>
                                            <SelectItem value="GENERAL">General / Other factors</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Custom Note (Optional)</Label>
                                    <Textarea
                                        className="bg-white text-sm"
                                        placeholder="Add a personalized note..."
                                        value={rejections[bid.id].note}
                                        onChange={(e) => handleNoteChange(bid.id, e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <DialogFooter className="mt-6 border-t pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>Cancel</Button>
                    <Button onClick={onSubmit} disabled={pending} className="bg-emerald-600 hover:bg-emerald-700">
                        {pending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Confirm & Award
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
