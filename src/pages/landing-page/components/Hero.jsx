export default function Hero() {
  return (
    <section className="bg-white text-gray-900 py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        {/* Left */}
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block">Micro Pipelines.</span>
            <span className="block">Micro Analytics.</span>
            <span className="block text-gray-500">Macro Results.</span>
          </h1>

          <p className="text-lg text-gray-600 mb-5 max-w-lg leading-relaxed">
            Bring your machines, assets, floors, or properties online — just
            plug and start logging. Minimal setup, instant dashboards, and chat
            with your data using our Bot.
          </p>

          <p className="text-sm text-gray-500 italic mb-10">
            Websites run on Google Analytics. Floors, machines, and properties
            run on Spectra — track, analyze, act, and talk to your data.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 text-base font-semibold text-white bg-black rounded-md hover:bg-gray-900 transition">
              Start Observing →
            </button>
            <button className="px-6 py-3 text-base font-semibold border border-gray-300 text-gray-800 rounded-md hover:bg-gray-100 transition">
              Book a Demo
            </button>
          </div>
        </div>

        {/* Right — Diagram */}
        <div className="flex-1">
          <div className="border border-gray-300 rounded-xl p-8">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="150"
                y="130"
                width="100"
                height="60"
                rx="6"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              <text
                x="200"
                y="165"
                textAnchor="middle"
                fill="black"
                fontSize="14"
                fontWeight="bold"
              >
                Spectra
              </text>

              {[
                { cx: 80, cy: 60, label: "Device" },
                { cx: 320, cy: 60, label: "Sensor" },
                { cx: 80, cy: 240, label: "Machine" },
                { cx: 320, cy: 240, label: "Asset" },
              ].map((item, i) => (
                <g key={i}>
                  <circle
                    cx={item.cx}
                    cy={item.cy}
                    r="28"
                    stroke="black"
                    strokeDasharray="5 5"
                    fill="none"
                  />
                  <line
                    x1="item.cx"
                    y1="item.cy"
                    x2="200"
                    y2="160"
                    stroke="black"
                    strokeDasharray="5 5"
                  />
                  <text
                    x={item.cx}
                    y={item.cy + 5}
                    textAnchor="middle"
                    fontSize="12"
                  >
                    {item.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
