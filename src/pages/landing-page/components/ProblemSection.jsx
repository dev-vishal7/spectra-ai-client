import React from "react";

export function ProblemSection() {
  const problems = [
    {
      title: "Limited Visibility",
      description:
        "Floors, units, machines, assets, and properties often run in the dark.",
      diagram: (
        <svg
          className="w-full h-full"
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="20"
            width="40"
            height="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            transform="rotate(-2 40 40)"
          />
          <rect
            x="80"
            y="20"
            width="40"
            height="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            transform="rotate(1 100 40)"
          />
          <rect
            x="140"
            y="20"
            width="40"
            height="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            transform="rotate(-1 160 40)"
          />
          <rect
            x="50"
            y="90"
            width="40"
            height="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            transform="rotate(2 70 110)"
          />
          <rect
            x="110"
            y="90"
            width="40"
            height="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            transform="rotate(-2 130 110)"
          />

          {/* Broken connection lines */}
          <line
            x1="40"
            y1="60"
            x2="40"
            y2="75"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <line
            x1="100"
            y1="60"
            x2="70"
            y2="90"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <line
            x1="160"
            y1="60"
            x2="130"
            y2="90"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* X marks for disconnection */}
          <path
            d="M38 73L42 77M42 73L38 77"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M68 88L72 92M72 88L68 92"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M128 88L132 92M132 88L128 92"
            stroke="currentColor"
            strokeWidth="2"
          />

          <text
            x="100"
            y="150"
            textAnchor="middle"
            className="text-xs fill-gray-500 font-medium"
          >
            Disconnected Systems
          </text>
        </svg>
      ),
    },
    {
      title: "Time Lost",
      description: "Teams spend hours manually collecting logs.",
      diagram: (
        <svg
          className="w-full h-full"
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="40"
            cy="40"
            r="18"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
          />
          <path d="M40 40L40 25" stroke="currentColor" strokeWidth="2" />
          <path d="M40 40L50 45" stroke="currentColor" strokeWidth="2" />

          {/* Stacked papers */}
          {[25, 70, 115].map((y, i) => (
            <g key={i}>
              <rect
                x="80"
                y={y}
                width="100"
                height="30"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="90"
                y1={y + 10}
                x2="160"
                y2={y + 10}
                stroke="gray"
                strokeWidth="1"
              />
              <line
                x1="90"
                y1={y + 20}
                x2="140"
                y2={y + 20}
                stroke="gray"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* Arrow */}
          <path
            d="M58 40L75 40L70 35M75 40L70 45"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      title: "Slower Decisions",
      description: "Without structured data, operations and maintenance lag.",
      diagram: (
        <svg
          className="w-full h-full"
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="20"
            width="60"
            height="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="120"
            y="20"
            width="60"
            height="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="70"
            y="90"
            width="60"
            height="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />

          {/* Tangled lines */}
          <path
            d="M50 60 Q80 75 100 90"
            stroke="gray"
            strokeWidth="2"
            fill="none"
            strokeDasharray="3 3"
          />
          <path
            d="M150 60 Q120 80 100 90"
            stroke="gray"
            strokeWidth="2"
            fill="none"
            strokeDasharray="3 3"
          />
          <path
            d="M60 50 Q90 70 110 95"
            stroke="gray"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="2 2"
          />

          {/* Question marks */}
          <text
            x="50"
            y="45"
            textAnchor="middle"
            className="text-2xl fill-black font-bold"
          >
            ?
          </text>
          <text
            x="150"
            y="45"
            textAnchor="middle"
            className="text-2xl fill-black font-bold"
          >
            ?
          </text>
          <text
            x="100"
            y="115"
            textAnchor="middle"
            className="text-2xl fill-black font-bold"
          >
            ?
          </text>

          <text
            x="100"
            y="150"
            textAnchor="middle"
            className="text-xs fill-gray-500 font-medium"
          >
            Unstructured Data
          </text>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900">The Physical Ops </span>
            <span className="text-gray-500">Problem</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {problems.map((problem) => (
            <div key={problem.title} className="text-center">
              <div className="mb-6">
                <div className="w-full h-40 rounded-lg bg-white border border-gray-300 flex items-center justify-center p-4 shadow-sm">
                  {problem.diagram}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {problem.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-lg font-medium text-gray-800 max-w-3xl mx-auto">
          Spectra brings analytics to your operations, assets, machines, and
          properties — in minutes.
        </p>
      </div>
    </section>
  );
}
