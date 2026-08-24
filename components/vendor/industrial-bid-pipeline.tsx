import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Clock, ShieldCheck, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { UpdateBidModal } from "@/components/vendor/update-bid-modal";

interface BidRowProps {
    id: string;
    bidId: string;
    title: string;
    qty: string | number;
    expiresIn: string;
    value: number;
    proposedLeadTime: number;
    notes: string | null;
    updateCount: number;
    isLocked: boolean;
    unlockRequested: boolean;
    minPriceFloor: number | null;
    isTopRanked?: boolean;
    certified?: boolean;
}

export const IndustrialBidPipeline = ({ bids }: { bids: BidRowProps[] }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-900">Active Bids Pipeline</h3>
                <span className="text-xs font-medium text-slate-500">
                    {bids.length} requiring attention
                </span>
            </div>

            <div className="divide-y divide-slate-100">
                {bids.map((bid) => (
                    <div key={bid.id} className="p-6 hover:bg-slate-50/60 transition-colors group">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex-1 space-y-2.5">
                                <div className="flex items-center gap-2.5">
                                    <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-md font-mono text-xs px-2 py-0.5">
                                        ID: {bid.id}
                                    </Badge>
                                    {bid.isLocked ? (
                                        <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 rounded-md font-medium text-xs px-2 py-0.5">
                                            <Lock className="h-3 w-3 mr-1 inline text-slate-400" /> Locked
                                        </Badge>
                                    ) : bid.updateCount < 1 ? (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-md font-medium text-xs px-2 py-0.5">
                                            1 Free Revision
                                        </Badge>
                                    ) : null}
                                </div>
                                <h4 className="text-lg font-semibold text-slate-900 leading-snug">
                                    {bid.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-5 pt-1">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                        <Package className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Qty: {bid.qty} Units</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Expires in {bid.expiresIn}</span>
                                    </div>
                                    {bid.certified && (
                                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                                            <span>ASTM A193 Certified</span>
                                        </div>
                                    )}
                                    {bid.isTopRanked && (
                                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>Top Ranked Bid</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-between min-w-[180px]">
                                <div className="text-right">
                                    <div className="text-xl font-bold text-slate-900">
                                        ₹{bid.value.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-400 font-medium mt-0.5">
                                        Current Bid Value
                                    </div>
                                </div>
                                <div className="w-full mt-4">
                                    <UpdateBidModal
                                        bidId={bid.bidId}
                                        currentPrice={bid.value}
                                        currentLeadTime={bid.proposedLeadTime}
                                        currentNotes={bid.notes}
                                        updateCount={bid.updateCount}
                                        isLocked={bid.isLocked}
                                        unlockRequested={bid.unlockRequested}
                                        minPriceFloor={bid.minPriceFloor}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Link href="/vendor/my-jobs" className="w-full">
                <Button variant="ghost" className="w-full py-4 border-t border-slate-200 rounded-none bg-slate-50/50 hover:bg-slate-100 font-medium text-xs text-slate-600 transition-colors">
                    View All Active Bids
                </Button>
            </Link>
        </div>
    );
};
