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
        <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_#0F172A] flex flex-col">
            <div className="p-4 border-b-4 border-slate-900 flex justify-between items-center bg-slate-50">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Active Bids Pipeline</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {bids.length} ITEMS REQUIRING ATTENTION
                </span>
            </div>

            <div className="divide-y-4 divide-slate-100">
                {bids.map((bid) => (
                    <div key={bid.id} className="p-6 hover:bg-slate-50 transition-colors group">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-[#FEF2E0] text-[#f97316] border-2 border-[#f97316] rounded-none font-black text-[9px] px-2 py-0.5 uppercase">
                                        ID: {bid.id}
                                    </Badge>
                                    {bid.isLocked ? (
                                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-900 rounded-none font-bold text-[8px] px-1.5 py-0">
                                            <Lock className="h-2.5 w-2.5 mr-1 inline" /> LOCKED
                                        </Badge>
                                    ) : bid.updateCount < 1 ? (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-500 rounded-none font-bold text-[8px] px-1.5 py-0">
                                            1 FREE REVISION
                                        </Badge>
                                    ) : null}
                                </div>
                                <h4 className="text-xl font-black uppercase text-slate-900 leading-none">
                                    {bid.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-6 mt-4">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Package className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Qty: {bid.qty} Units</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Expires in {bid.expiresIn}</span>
                                    </div>
                                    {bid.certified && (
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">ASTM A193 Certified</span>
                                        </div>
                                    )}
                                    {bid.isTopRanked && (
                                        <div className="flex items-center gap-1.5 text-emerald-500">
                                            <ShieldCheck className="h-3.5 w-3.5 fill-emerald-100" />
                                            <span className="text-[10px] font-black uppercase tracking-wider">Top Ranked Bid</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-between min-w-[180px]">
                                <div className="text-right">
                                    <div className="text-2xl font-black text-slate-900 tracking-tighter">
                                        ₹{bid.value.toLocaleString()}
                                    </div>
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        Current Bid Value
                                    </div>
                                </div>
                                <div className="w-full mt-4 group-hover:translate-x-1 transition-transform">
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

            <Button variant="ghost" className="w-full py-6 border-t-4 border-slate-900 rounded-none bg-slate-50 hover:bg-slate-100 font-black uppercase tracking-widest text-slate-900 transition-colors">
                View All Active Bids
            </Button>
        </div>
    );
};
