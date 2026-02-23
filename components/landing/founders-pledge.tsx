"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ShieldAlert } from "lucide-react";

export const FoundersPledge = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Create a tracking beam effect based on scroll
  const beamHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section ref={ref} className="py-24 bg-slate-50 relative min-h-screen flex items-center border-b-2 border-slate-900">
      <div className="container mx-auto px-4 max-w-4xl relative">
        
        {/* Tracing Beam Left Side */}
        <div className="absolute left-0 lg:-left-12 top-0 bottom-0 w-2 bg-slate-200">
          <motion.div 
            className="w-full bg-orange-500 shadow-[0_0_15px_#F97316]"
            style={{ height: beamHeight }}
          />
        </div>

        <div className="pl-12 lg:pl-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold uppercase tracking-wider mb-8 border-2 border-slate-900">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            The Founders Pledge
          </div>

          <blockquote className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight uppercase tracking-tight mb-12">
            "We built METALLYX because we were tired of delayed parts, hidden costs, and zero accountability. What you get here is pure capability, backed by rigid inspection."
          </blockquote>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t-4 border-slate-900 pt-8 mt-12">
            <div>
              <p className="font-mono font-bold text-slate-600 text-lg uppercase">System Architect & Co-Founder</p>
              <div className="text-4xl mt-4 text-orange-600" style={{ fontFamily: "cursive" }}>
                Metallyx Core Team
              </div>
            </div>

            <div className="mt-8 md:mt-0 w-32 h-32 border-4 border-slate-900 rounded-full flex items-center justify-center relative rotate-12">
              <div className="absolute inset-0 border-2 border-orange-500 rounded-full m-2 border-dashed animate-[spin_10s_linear_infinite]" />
              <div className="text-center">
                <span className="block font-bold uppercase text-slate-900 leading-none">100%</span>
                <span className="block text-xs font-bold uppercase text-orange-600">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
