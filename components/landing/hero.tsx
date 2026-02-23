"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Drill } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="relative w-full min-h-[90vh] bg-industrial-bg flex flex-col justify-center overflow-hidden pt-20">
      {/* Abstract industrial grid background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--color-industrial-text) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 border-2 border-slate-900 mb-6 font-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-none bg-orange-600 animate-pulse" />
              The Digital Factory
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-industrial-text tracking-tight leading-tight uppercase relative">
              Your Distributed Factory
              <br />
              For Precision Machining
              {/* Decorative accent */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-2 bg-industrial-orange border-2 border-industrial-border" />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-700 font-medium max-w-2xl mx-auto pt-6"
          >
            Upload CAD. Get Instant Quotes. Source within 45km. Guaranteed Quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link href="/auth/register?role=oem">
              <motion.button
                whileHover={{ y: -4, x: -4, boxShadow: "var(--shadow-neo)" }}
                whileTap={{ y: 0, x: 0, boxShadow: "0px 0px 0px #111827" }}
                className="w-full sm:w-auto px-8 py-4 bg-industrial-orange text-industrial-text font-bold text-lg border-2 border-industrial-border flex items-center justify-center gap-2 group transition-all"
              >
                Get a Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/auth/register?role=vendor">
              <motion.button
                whileHover={{ y: -4, x: -4, boxShadow: "var(--shadow-neo)" }}
                whileTap={{ y: 0, x: 0, boxShadow: "0px 0px 0px #111827" }}
                className="w-full sm:w-auto px-8 py-4 bg-white text-industrial-text font-bold text-lg border-2 border-industrial-border flex items-center justify-center gap-2 group transition-all"
              >
                <Drill className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Register Workshop
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
