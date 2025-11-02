import React from "react";

export function FeaturesSection() {
  const features = [
    {
      number: "01",
      title: "Plug & Play Hardware",
      description:
        "Connect any device, sensor, machine, or asset — start logging instantly. Works with multiple protocols. Structure data your way.",
      details: [
        "Multiple protocol support",
        "Instant data logging",
        "Custom data structures",
        "Zero configuration",
      ],
    },
    {
      number: "02",
      title: "Micro Analytics",
      description:
        "Build dashboards for floors, units, machines, assets, or properties. Prompt-driven templates generate layouts or reports instantly.",
      details: [
        "Custom dashboards",
        "Prompt-driven templates",
        "Real-time tracking",
        "Instant report generation",
      ],
    },
    {
      number: "03",
      title: "Macro Results",
      description:
        "Teams save hours every day. Faster decisions, fewer errors. Full operational visibility across all floors, units, and assets.",
      details: [
        "Save hours daily",
        "Faster decisions",
        "Full visibility",
        "Reduced errors",
      ],
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-widest">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gray-900">Micro Setup → </span>
            <span className="text-gray-500">Macro Impact</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={feature.number} className="relative">
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                  <div className="text-5xl font-bold text-gray-300 mb-4">
                    {feature.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-900 flex-shrink-0 mt-2" />
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow between cards */}
                {index < features.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 12L19 12"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M14 7L19 12L14 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
