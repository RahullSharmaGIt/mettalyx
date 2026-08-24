import { AlertCircle, TrendingUp } from "lucide-react";

export const IndustrialPulse = () => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industrial Pulse</h3>

            <div className="space-y-4">
                <div className="flex gap-3 group">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                            Steel Index Hike <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                        </h4>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                            Global raw material costs projected to rise by 4.2% next quarter. Adjust bid templates accordingly.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 group">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                            Logistics Alert <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                        </h4>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                            Port congestions at Terminal C may delay export shipments by 3-5 days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
