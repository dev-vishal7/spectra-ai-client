export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Anything",
      description:
        "Devices, machines, assets, spreadsheets — plug and start logging.",
      diagram: (
        <svg
          className="w-full h-full"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="150"
            cy="150"
            r="45"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-foreground"
          />
          <text
            x="150"
            y="158"
            textAnchor="middle"
            className="text-base fill-foreground font-bold"
          >
            Hub
          </text>

          <circle
            cx="80"
            cy="80"
            r="28"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
            strokeDasharray="3 5"
          />
          <circle
            cx="220"
            cy="80"
            r="28"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
            strokeDasharray="3 5"
          />
          <circle
            cx="80"
            cy="220"
            r="28"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
            strokeDasharray="3 5"
          />
          <circle
            cx="220"
            cy="220"
            r="28"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
            strokeDasharray="3 5"
          />

          <path
            d="M 102 95 L 125 125"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-foreground"
          />
          <path
            d="M 198 95 L 175 125"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-foreground"
          />
          <path
            d="M 102 205 L 125 175"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-foreground"
          />
          <path
            d="M 198 205 L 175 175"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-foreground"
          />

          <circle
            cx="102"
            cy="95"
            r="4"
            fill="currentColor"
            className="text-foreground"
          />
          <circle
            cx="198"
            cy="95"
            r="4"
            fill="currentColor"
            className="text-foreground"
          />
          <circle
            cx="102"
            cy="205"
            r="4"
            fill="currentColor"
            className="text-foreground"
          />
          <circle
            cx="198"
            cy="205"
            r="4"
            fill="currentColor"
            className="text-foreground"
          />
        </svg>
      ),
      features: ["IoT sensors", "Legacy machines", "Spreadsheets", "APIs"],
    },
    {
      number: "02",
      title: "Stream & Normalize",
      description:
        "Spectra builds micro pipelines, structuring logs automatically.",
      diagram: (
        <svg
          className="w-full h-full"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="130"
            width="60"
            height="40"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
            transform="rotate(-2 50 150)"
          />
          <rect
            x="120"
            y="80"
            width="60"
            height="40"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
            transform="rotate(1 150 100)"
          />
          <rect
            x="120"
            y="180"
            width="60"
            height="40"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
            transform="rotate(-1 150 200)"
          />
          <rect
            x="220"
            y="130"
            width="60"
            height="40"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
            transform="rotate(2 250 150)"
          />

          <path
            d="M 80 150 L 120 100"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-foreground"
          />
          <path
            d="M 80 150 L 120 200"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-foreground"
          />
          <path
            d="M 180 100 L 220 150"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-foreground"
          />
          <path
            d="M 180 200 L 220 150"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-foreground"
          />

          <text
            x="50"
            y="153"
            textAnchor="middle"
            className="text-xs fill-foreground font-medium"
          >
            Raw
          </text>
          <text
            x="150"
            y="103"
            textAnchor="middle"
            className="text-xs fill-foreground font-medium"
          >
            Process
          </text>
          <text
            x="150"
            y="203"
            textAnchor="middle"
            className="text-xs fill-foreground font-medium"
          >
            Process
          </text>
          <text
            x="250"
            y="153"
            textAnchor="middle"
            className="text-xs fill-foreground font-medium"
          >
            Clean
          </text>
        </svg>
      ),
      features: [
        "Auto-structuring",
        "Real-time processing",
        "Data normalization",
        "Custom pipelines",
      ],
    },
    {
      number: "03",
      title: "Observe & Act",
      description:
        "Dashboards, workflows, and Bot deliver macro insights in real time. Chat directly with dashboards or pipelines to get instant answers. Send dashboards or reports with one click. Trigger workflows based on conditions you define.",
      diagram: (
        <svg
          className="w-full h-full"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="100"
            y="50"
            width="100"
            height="80"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
            rx="4"
          />

          <rect
            x="110"
            y="60"
            width="35"
            height="25"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-muted-foreground"
          />
          <path
            d="M 115 78 L 120 73 L 125 76 L 130 70 L 135 74 L 140 68"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-foreground"
          />

          <rect
            x="155"
            y="60"
            width="35"
            height="25"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-muted-foreground"
          />
          <rect
            x="162"
            y="75"
            width="6"
            height="8"
            fill="currentColor"
            className="text-foreground"
          />
          <rect
            x="172"
            y="70"
            width="6"
            height="13"
            fill="currentColor"
            className="text-foreground"
          />
          <rect
            x="182"
            y="72"
            width="6"
            height="11"
            fill="currentColor"
            className="text-foreground"
          />

          <rect
            x="110"
            y="95"
            width="80"
            height="25"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-muted-foreground"
          />
          <line
            x1="115"
            y1="102"
            x2="180"
            y2="102"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
          <line
            x1="115"
            y1="108"
            x2="165"
            y2="108"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
          <line
            x1="115"
            y1="114"
            x2="175"
            y2="114"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />

          <circle
            cx="60"
            cy="200"
            r="32"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
          />
          <path
            d="M 50 200 L 58 208 L 70 188"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
          />

          <circle
            cx="150"
            cy="200"
            r="32"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
          />
          <path
            d="M 150 185 L 150 200 L 162 193"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
          />

          <circle
            cx="240"
            cy="200"
            r="32"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
          />
          <rect
            x="228"
            y="188"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-foreground"
          />

          <path
            d="M 150 130 L 60 168"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground"
            strokeDasharray="3 3"
          />
          <path
            d="M 150 130 L 150 168"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground"
            strokeDasharray="3 3"
          />
          <path
            d="M 150 130 L 240 168"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground"
            strokeDasharray="3 3"
          />
        </svg>
      ),
      features: [
        "Live dashboards",
        "Chat with data",
        "Automated reports",
        "Workflow triggers",
      ],
    },
  ];

  return (
    <section className="py-24 bg-muted/10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-foreground">Simple process, </span>
            <span className="text-muted-foreground">powerful results</span>
          </h2>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-background rounded-lg p-8 border border-border h-full">
                  <div className="text-5xl font-bold text-muted-foreground mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-1 h-1 rounded-full bg-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-1/2 z-10">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M 5 12 L 19 12"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M 14 7 L 19 12 L 14 17"
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
