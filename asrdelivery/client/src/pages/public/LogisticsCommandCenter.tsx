import { motion } from "framer-motion";
import { useMemo } from "react";

/* ---------------- COUNTRY COORDINATES ---------------- */
const countryCoords = {
  USA: { x: 200, y: 250 },
  Germany: { x: 550, y: 200 },
  Brazil: { x: 350, y: 350 },
  India: { x: 700, y: 250 },
  UK: { x: 500, y: 180 },
};

/* ---------------- SAMPLE LIVE ROUTES ---------------- */
const liveRoutes = [
  { id: 1, from: "USA", to: "Germany", status: "In Transit" },
  { id: 2, from: "Brazil", to: "UK", status: "In Transit" },
  { id: 3, from: "India", to: "USA", status: "Delayed" },
];

/* ---------------- BEZIER CURVE GENERATOR ---------------- */
function generateCurve(start: { x: number; y: number }, end: { x: number; y: number }) {
  const midX = (start.x + end.x) / 2;
  const curveHeight = 100;
  const controlY = Math.min(start.y, end.y) - curveHeight;

  return `M${start.x} ${start.y} Q${midX} ${controlY} ${end.x} ${end.y}`;
}

export default function LogisticsCommandCenter() {
  const routes = useMemo(() => {
    return liveRoutes.map(route => {
      const start = countryCoords[route.from];
      const end = countryCoords[route.to];
      return {
        ...route,
        path: generateCurve(start, end),
      };
    });
  }, []);

  return (
    <section className="relative bg-slate-950 text-white min-h-screen p-10">
      
      {/* ================= KPI HEADER ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">Active Shipments</p>
          <p className="text-3xl font-bold text-blue-400">1,248</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">On-Time Rate</p>
          <p className="text-3xl font-bold text-green-400">98.9%</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">Delayed</p>
          <p className="text-3xl font-bold text-yellow-400">32</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">Countries</p>
          <p className="text-3xl font-bold text-cyan-400">42</p>
        </div>
      </div>

      {/* ================= MAP AREA ================= */}
      <div className="relative h-[500px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

        <svg viewBox="0 0 1000 500" className="absolute w-full h-full">

          {/* Render dynamic routes */}
          {routes.map(route => (
            <g key={route.id}>
              <motion.path
                d={route.path}
                stroke={
                  route.status === "Delayed"
                    ? "#facc15"
                    : "#3b82f6"
                }
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Moving shipment */}
              <motion.circle
                r="5"
                fill={
                  route.status === "Delayed"
                    ? "#facc15"
                    : "#3b82f6"
                }
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  offsetPath: `path('${route.path}')`,
                }}
              />
            </g>
          ))}

        </svg>
      </div>



    </section>
  );
}