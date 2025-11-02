import React from "react";

export function UseCasesSection() {
  const useCases = [
    {
      title: "Floor Efficiency",
      description: "Track tasks, identify bottlenecks, optimize output.",
      metrics: [
        "Task completion rates",
        "Bottleneck detection",
        "Output optimization",
        "Real-time monitoring",
      ],
    },
    {
      title: "Unit & Outlet Performance",
      description: "Build layouts, visualize outputs, measure trends.",
      metrics: [
        "Performance layouts",
        "Output visualization",
        "Trend analysis",
        "Comparative metrics",
      ],
    },
    {
      title: "Assets & Equipment",
      description: "Know machine status and maintenance needs.",
      metrics: [
        "Status monitoring",
        "Maintenance alerts",
        "Uptime tracking",
        "Predictive maintenance",
      ],
    },
    {
      title: "Properties & Facilities",
      description: "Track building-level KPIs, energy usage, and workflows.",
      metrics: [
        "Building KPIs",
        "Energy tracking",
        "Workflow automation",
        "Compliance monitoring",
      ],
    },
    {
      title: "Prompt-Driven Templates",
      description: "Generate dashboards or reports instantly.",
      metrics: [
        "Instant generation",
        "Custom layouts",
        "Auto reports",
        "Template library",
      ],
    },
  ];

  return (
    <section id="use-cases" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Use Cases
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-foreground">Built for every </span>
            <span className="text-muted-foreground">operational need</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="bg-background rounded-lg p-6 border border-border"
            >
              <h3 className="text-lg font-bold mb-2">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {useCase.description}
              </p>
              <ul className="space-y-1.5">
                {useCase.metrics.map((metric) => (
                  <li key={metric} className="flex items-center gap-2 text-sm">
                    <div className="w-1 h-1 rounded-full bg-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
