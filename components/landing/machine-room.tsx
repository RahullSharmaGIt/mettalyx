import { Cog, Scissors, Wrench, Settings2, Hammer, Server } from "lucide-react";

const capabilities = [
  {
    title: "CNC TURNING",
    desc: "High-speed precision turning for cylindrical parts.",
    tolerance: "0.01mm",
    icon: Cog,
    colSpan: "col-span-1 md:col-span-2",
    color: "bg-blue-100",
  },
  {
    title: "5-AXIS MILLING",
    desc: "Complex geometries and tight tolerances.",
    tolerance: "0.005mm",
    icon: Server,
    colSpan: "col-span-1",
    color: "bg-orange-100",
  },
  {
    title: "GEAR HOBBING",
    desc: "Precision gear cutting and manufacturing.",
    tolerance: "0.02mm",
    icon: Settings2,
    colSpan: "col-span-1",
    color: "bg-emerald-100",
  },
  {
    title: "LASER CUTTING",
    desc: "Sheet metal cutting with zero burrs.",
    tolerance: "0.1mm",
    icon: Scissors,
    colSpan: "col-span-1 md:col-span-2",
    color: "bg-indigo-100",
  },
];

export const MachineRoom = () => {
  return (
    <section className="py-24 bg-white border-b-2 border-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-2 border-slate-900 pb-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold uppercase text-slate-900">
              The Machine Room
            </h2>
            <p className="text-xl text-slate-600 font-mono mt-4">
              [CAPABILITY GRID_V1.0]
            </p>
          </div>
          <div className="mt-6 md:mt-0 font-bold bg-orange-500 text-slate-900 px-4 py-2 border-2 border-slate-900 uppercase">
            Network Status: Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className={`${item.colSpan} border-2 border-industrial-border bg-slate-50 p-8 shadow-neo hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_var(--color-industrial-border)] transition-all flex flex-col justify-between`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-16 h-16 rounded-full border-2 border-slate-900 flex items-center justify-center ${item.color}`}>
                    <Icon className="w-8 h-8 text-slate-900" />
                  </div>
                  <div className="bg-slate-900 text-white font-mono text-xs px-3 py-1 font-bold uppercase">
                    MIN TOLERANCE: {item.tolerance}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-extrabold uppercase text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
