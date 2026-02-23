"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  "20+ VERIFIED WORKSHOPS",
  "0.01MM MAX TOLERANCE",
  "45KM LOCAL SOURCING",
  "ISO 9001 COMPLIANT",
  "FASTER TURNAROUND",
  "FULL MATERIAL CERTIFICATION"
];

export const NetworkStats = () => {
  return (
    <div className="w-full overflow-hidden bg-slate-900 border-y-2 border-industrial-border py-4 flex relative">
      <div 
        className="absolute inset-0 bg-industrial-orange w-2 shrink-0 z-10"
      />
      <div 
        className="absolute inset-y-0 right-0 bg-industrial-orange w-2 shrink-0 z-10"
      />
      
      {/* Infinite scroller */}
      <motion.div
        className="flex whitespace-nowrap gap-12 px-6"
        animate={{
          x: [0, -1000] // adjust to ensure seamless loop depending on actual width
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20
        }}
      >
        {/* We map the array multiple times to create the infinite effect */}
        {[...stats, ...stats, ...stats].map((stat, idx) => (
          <div key={idx} className="flex items-center gap-12 font-mono text-industrial-orange font-bold tracking-widest text-lg md:text-xl">
            <span>{stat}</span>
            <span className="w-2 h-2 bg-slate-50 border border-industrial-orange rotate-45 transform" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
