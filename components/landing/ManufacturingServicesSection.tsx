"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

import injectionMolding from "@/public/images/injection-molding.jpg";
import cncMachining from "@/public/images/cnc-machining.jpg";
import threeDPrinting from "@/public/images/3d-printing.jpg";
import sheetMetal from "@/public/images/sheet-metal.jpg";

import { StaticImageData } from "next/image";

import Image from "next/image";


type ServiceTab = {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: StaticImageData;
};

const services: ServiceTab[] = [
  {
    id: "injection-molding",
    title: "Injection Molding",
    description: "Get affordable, high-quality molded parts and bridge tooling within days. No MOQ required.",
    features: [
      "Low-volume molding up to 100,000+ parts",
      "100+ plastic, elastomeric, and silicone materials",
      "Automated CMM for fast quality documentation"
    ],
    image: injectionMolding,
  },
  {
    id: "cnc-machining",
    title: "CNC Machining",
    description: "High-precision CNC machined parts for prototyping or production with tight tolerances.",
    features: [
      "Precision tolerances down to +/- 0.001\"",
      "Wide range of metals and plastics",
      "Fast turnarounds as quick as 1 day"
    ],
    image: cncMachining,
  },
  {
    id: "3d-printing",
    title: "3D Printing",
    description: "Industrial-grade additive manufacturing for complex geometries and rapid prototyping.",
    features: [
      "FDM, SLA, SLS, and DMLS technologies",
      "High-performance engineering materials",
      "Instant quoting and fast production"
    ],
    image: threeDPrinting,
  },
  {
    id: "sheet-metal",
    title: "Sheet Metal Fabrication",
    description: "Custom sheet metal parts, enclosures, and assemblies with various finishes available.",
    features: [
      "Laser cutting, bending, and welding",
      "Multiple plating and coating options",
      "Scalable from prototypes to production"
    ],
    image: sheetMetal,
  }
];

export default function ManufacturingServicesSection() {
  const [activeTab, setActiveTab] = useState(services[0].id);

  const activeService = services.find((s) => s.id === activeTab) || services[0];

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-[#F8FAFC] text-[#0F172A] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">
            Our Manufacturing Services
          </h2>
          <div className="h-2 w-32 bg-[#F97316] border-2 border-[#0F172A]"></div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-8 md:justify-center gap-4 snap-x no-scrollbar">
          {services.map((service) => {
            const isActive = activeTab === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                className={`relative shrink-0 px-6 py-3 font-bold text-lg  transition-all duration-200 snap-center outline-none whitespace-nowrap
                  ${isActive ? "bg-[#F97316] text-white translate-x-[-2px] translate-y-[-2px] shadow-[4px_4px_0px_#0F172A]" : "bg-white hover:bg-[#F8FAFC]"}
                `}
              >
                {service.title}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 border-4 border-[#0F172A] pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Layout */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-white border-4 border-[#0F172A] shadow-[4px_4px_0px_#0F172A] p-6 md:p-10"
            >

              {/* LEFT COLUMN */}
              <div className="flex flex-col justify-center space-y-6">
                <h3 className="text-3xl font-black uppercase">{activeService.title}</h3>
                <p className="text-lg font-medium leading-relaxed">
                  {activeService.description}
                </p>
                <div>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-[#F97316] text-white font-black uppercase tracking-wider border-4 border-[#0F172A] shadow-[4px_4px_0px_#0F172A] hover:bg-[#EA580C] transition-colors"
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>

              {/* MIDDLE COLUMN */}
              <div className="flex flex-col justify-center border-t-4 lg:border-t-0 lg:border-l-4 border-[#0F172A] pt-6 lg:pt-0 lg:pl-10 space-y-4">
                {activeService.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1 bg-[#F97316] border-2 border-[#0F172A] p-1 shrink-0">
                      <Check className="w-5 h-5 text-white stroke-[3] hidden md:block" />
                      <Check className="w-4 h-4 text-white stroke-[3] block md:hidden" />
                    </div>
                    <span className="text-lg font-bold leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              {/* RIGHT COLUMN */}
              <div className="relative flex items-center justify-center overflow-hidden border-4 border-[#0F172A] bg-[#0F172A] min-h-[250px] lg:min-h-full">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <Image
                    src={activeService.image}
                    alt={activeService.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </motion.div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
