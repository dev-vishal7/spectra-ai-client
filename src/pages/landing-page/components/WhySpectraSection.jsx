import React from "react";

export function WhySpectraSection() {
  const features = [
    "Micro Pipelines & Analytics",
    "Plug & Play Hardware",
    "Workflow Automation",
    "Notifications-Ready",
    "One-Click Sharing",
    "Chat with dashboards and pipelines via Bot",
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Why Teams Choose </span>
            <span className="text-muted-foreground">Spectra</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-3 bg-background rounded-xl p-6 border border-border/50"
            >
              <svg
                className="h-5 w-5 text-primary shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <span className="font-semibold text-foreground">
              Expert Support:
            </span>{" "}
            Unsure about hardware or setup? Schedule a call with our experts.
          </p>
        </div>
      </div>
    </section>
  );
}
