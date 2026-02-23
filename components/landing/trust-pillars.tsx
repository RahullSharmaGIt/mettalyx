"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Wallet } from "lucide-react";

const pillars = [
  {
    title: "Material Certification",
    desc: "Every job is cross-checked against material test reports (MTRs) to ensure grade authenticity before any machining begins.",
    icon: ShieldCheck,
    for: "OEM",
  },
  {
    title: "Quality Inspection",
    desc: "Local coordinators verify dimensions and tolerances physically before dispatch, eliminating the risk of rejected batches.",
    icon: CheckCircle2,
    for: "OEM",
  },
  {
    title: "Guaranteed Payments",
    desc: "Funds are escrowed upfront. Once the QA is passed, payments are released 100% on time, every time.",
    icon: Wallet,
    for: "VENDOR",
  },
];

export const TrustPillars = () => {
  return (
    <section className="py-24 bg-slate-900 text-slate-50 border-b-2 border-slate-900 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'conic-gradient(from 90deg at 1px 1px,#0000 90deg,#fff 0)', backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase mb-16 flex items-center gap-4">
          <span className="w-4 h-12 bg-orange-500 block" />
          Trust Pillars
        </h2>

        <div className="space-y-12">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-slate-800 border-2 border-slate-700 p-8 hover:border-orange-500 transition-colors group"
              >
                <div className="w-16 h-16 shrink-0 bg-slate-700 border-2 border-slate-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-600 transition-colors">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold uppercase tracking-tight">{pillar.title}</h3>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 uppercase border ${pillar.for === 'OEM' ? 'border-blue-400 text-blue-400' : 'border-emerald-400 text-emerald-400'}`}>
                      FOR {pillar.for}
                    </span>
                  </div>
                  <p className="text-slate-400 text-lg leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
