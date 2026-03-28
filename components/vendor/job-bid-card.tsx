"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Package, AlertCircle } from "lucide-react";
import { SubmitBidModal } from "./submit-bid-modal";

interface JobBidCardProps {
    job: {
        id: string;
        title: string;
        material: string;
        quantity: number;
        location: string;
        targetVendorPrice: number | null;
        minPriceFloor: number | null;
        createdAt: Date;
        totalBids: number;
        lowestBid: number | null;
        hasBid: boolean;
    };
}

export function JobBidCard({ job }: JobBidCardProps) {
    // New: created within the last 48 hours
    const isNew = new Date().getTime() - new Date(job.createdAt).getTime() < 48 * 60 * 60 * 1000;
    const isHighCompetition = job.totalBids > 5;

    return (
        <Card className="border-2 border-slate-900 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow">
            <CardHeader className="border-b-2 border-slate-900 bg-slate-50 py-4">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xl font-bold uppercase tracking-tight">
                        {job.title}
                    </CardTitle>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        {isNew && <Badge className="bg-emerald-500 hover:bg-emerald-600">NEW</Badge>}
                        {isHighCompetition && <Badge variant="destructive">High Competition</Badge>}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                    <span>•</span>
                    <Calendar className="h-4 w-4 ml-2" />
                    <span>Added {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
            </CardHeader>

            <CardContent className="p-5 flex-1 flex flex-col gap-6">
                {/* Specs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase">Material</p>
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-emerald-600" />
                            <p className="font-medium">{job.material}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase">Quantity</p>
                        <p className="font-medium text-lg">{job.quantity} <span className="text-sm text-slate-500 font-normal">units</span></p>
                    </div>
                </div>

                {/* Pricing intel */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-emerald-200/50">
                        <p className="text-sm font-semibold text-emerald-900">Target Price</p>
                        <p className="font-bold text-emerald-700">
                            {job.targetVendorPrice ? `₹${job.targetVendorPrice.toLocaleString()}` : "Not set"}
                        </p>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold text-slate-700">Lowest Bid</p>
                        <p className="font-bold text-slate-900">
                            {job.lowestBid ? `₹${job.lowestBid.toLocaleString()}` : "No bids yet"}
                        </p>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <p className="text-slate-500">Total Bids: <span className="font-semibold text-slate-700">{job.totalBids}</span></p>
                        {job.totalBids > 0 && job.targetVendorPrice ? (
                            <p className="text-emerald-600 italic">
                                Most bids around {job.lowestBid ? `₹${Math.floor(job.lowestBid * 1.1).toLocaleString()}` : "Target"}
                            </p>
                        ) : null}
                    </div>
                </div>

                {/* Security Warning */}
                <div className="flex items-start gap-2 bg-amber-50 text-amber-800 p-3 rounded-md text-xs border border-amber-200 mt-auto">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                    <p>
                        <strong>Note:</strong> Original CAD files and buyer specifications are locked. These will only be revealed if you win the contract.
                    </p>
                </div>
            </CardContent>

            <CardFooter className="p-5 border-t border-slate-100 bg-slate-50">
                <SubmitBidModal
                    jobId={job.id}
                    minPriceFloor={job.minPriceFloor}
                    targetPrice={job.targetVendorPrice}
                    hasBid={job.hasBid}
                    lowestBid={job.lowestBid}
                />
            </CardFooter>
        </Card>
    );
}
