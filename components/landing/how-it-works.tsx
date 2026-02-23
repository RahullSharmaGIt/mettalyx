"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode, Settings, Factory, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "1. Upload CAD",
    desc: "Drag and drop your STEP/IGES files.",
    icon: FileCode,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "2. AI Analysis",
    desc: "Instant manufacturability extraction & tolerances.",
    icon: Settings,
    color: "bg-orange-500",
  },
  {
    id: 3,
    title: "3. Local Matching",
    desc: "Assigned to an available local verified workshop.",
    icon: Factory,
    color: "bg-indigo-500",
  },
  {
    id: 4,
    title: "4. Quality Part",
    desc: "Inspected and delivered with certs.",
    icon: CheckCircle,
    color: "bg-emerald-500",
  },
];

export const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-slate-50 border-b-2 border-slate-900 border-t-2">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase text-slate-900 inline-block relative">
            Blueprint-to-Part
            <div className="absolute -bottom-2 -right-4 w-8 h-8 bg-orange-500 border-2 border-slate-900 rounded-none -z-10" />
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeStep;
            
            return (
              <div key={step.id} className="w-full flex-1 flex flex-col items-center relative group">
                <motion.div 
                  layout
                  className={`relative w-24 h-24 flex items-center justify-center border-2 border-slate-900 z-10 bg-white transition-all duration-300 ${
                    isActive ? "shadow-[8px_8px_0_0_#F97316] scale-110" : "shadow-[4px_4px_0_0_#111827]"
                  }`}
                >
                  {/* Scanning line animation for active state */}
                  {isActive && idx === 1 && (
                    <motion.div 
                      className="absolute inset-x-0 h-1 bg-orange-500 z-20 opacity-80"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  
                  <Icon className={`w-10 h-10 ${isActive ? "text-orange-500" : "text-slate-900"}`} />
                </motion.div>

                <div className="mt-8 text-center px-2">
                  <h3 className="font-mono font-bold text-lg text-slate-900 mb-2 uppercase">{step.title}</h3>
                  <p className="text-slate-600 text-sm">{step.desc}</p>
                </div>

                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-slate-400 z-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
