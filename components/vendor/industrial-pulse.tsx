import { AlertCircle, TrendingUp } from "lucide-react";

export const IndustrialPulse = () => {
    return (
        <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_#0F172A] p-6 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Industrial Pulse</h3>

            <div className="space-y-4">
                <div className="flex gap-4 group">
                    <div className="h-0.5 w-6 bg-[#f97316] mt-2 group-hover:w-8 transition-all" />
                    <div>
                        <h4 className="font-black uppercase text-[11px] text-slate-900 tracking-tight flex items-center gap-2">
                            Steel Index Hike <TrendingUp className="h-3 w-3 text-emerald-500" />
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                            Global raw material costs projected to rise by 4.2% next quarter. Adjust bid templates accordingly.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 group">
                    <div className="h-0.5 w-6 bg-[#f97316] mt-2 group-hover:w-8 transition-all" />
                    <div>
                        <h4 className="font-black uppercase text-[11px] text-slate-900 tracking-tight flex items-center gap-2">
                            Logistics Alert <AlertCircle className="h-3 w-3 text-rose-500" />
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                            Port congestions at Terminal C may delay export shipments by 3-5 days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
