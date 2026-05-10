import { motion } from "framer-motion";

export default function WorldLogisticsMap() {
  return (
    <section  className="relative overflow-hidden text-white">
      <div className="container mx-auto px-6 max-w-6xl text-center">

        <div className="mb-12 ">
          <p className="text-gray-800">
            Visualize real-time shipment routes and hub activity across the world.
          </p>
        </div>

        <div         style={{
          backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg")',
        }} className="relative w-full h-[450px]">

          {/* WORLD MAP (Optimized simplified outline) */}
          <svg
            viewBox="0 0 1000 500"
            className="absolute inset-0 w-full h-full opacity-20"
          >
            <path
              d="M120 260 L250 210 L400 240 L550 200 L700 230 L850 210"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>

          {/* ROUTES + MOVING SHIPMENTS */}
          <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full">

            {/* Route 1 */}
            <motion.path
              id="route1"
              d="M200 280 Q500 100 820 260"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1000, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Moving shipment dot */}
            <motion.circle
              r="5"
              fill="#3b82f6"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{
                offsetPath: "path('M200 280 Q500 100 820 260')",
              }}
            />

            {/* Route 2 */}
            {/* <motion.path
              d="M150 200 Q450 350 750 220"
              stroke="#22d3ee"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            /> */}

            {/* Moving shipment dot */}
            {/* <motion.circle
              r="5"
              fill="#22d3ee"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{
                offsetPath: "path('M150 200 Q450 350 750 220')",
              }}
            /> */}
          </svg>

          {/* HUB MARKERS */}
          {/* <motion.div
            className="absolute w-4 h-4 bg-blue-500 rounded-full"
            style={{ top: "60%", left: "20%" }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          /> */}

          <motion.div
            className="absolute w-4 h-4 bg-cyan-400 rounded-full"
            style={{ top: "50%", left: "80%" }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

        </div>
      </div>
    </section>
  );
}