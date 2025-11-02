import React from "react";

export function PricingSection() {
  const features = [
    "Unlimited parameters & alerts",
    "5 workflows included",
    "Notifications: Trigger SMS/WhatsApp/email via your local provider packs",
    "Plug & play, micro setup, macro results",
  ];

  const handleGetStarted = () => {
    const demoSection = document.getElementById("demo-form");
    demoSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16 text-center ">
          <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Simple & </span>
            <span className="text-muted-foreground">Clear</span>
          </h2>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl p-8 border-2 border-primary bg-primary/5 shadow-lg">
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold">$15</span>
                <span className="text-muted-foreground text-lg">/ month</span>
              </div>
            </div>

            <button
              onClick={handleGetStarted}
              className="w-full mb-8 bg-black text-white hover:bg-primary/90 text-primary-foreground py-3 rounded-lg text-lg font-semibold"
            >
              Get Started →
            </button>

            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
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
                  <span className="text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-muted-foreground mt-6 pt-6 border-t border-border/50">
              Note: Notifications handled by your local packs — you stay in
              control.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
