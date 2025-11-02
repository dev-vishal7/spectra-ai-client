import React from "react";

export function AnalogySection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
            Physical Ops Analogy
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-foreground">
              The Analytics Dashboard for Your{" "}
            </span>
            <span className="text-muted-foreground">
              Floors, Machines, Assets, and Properties
            </span>
          </h2>

          <div className="space-y-4 text-lg text-muted-foreground mb-8">
            <p>
              Digital tools get insights — now your physical operations can too.
            </p>
            <p>
              Track performance, downtime, trends, and outputs in real time.
            </p>
            <p className="font-medium text-foreground">
              Micro setup, macro insights, actionable decisions.
            </p>
          </div>

          <div className="bg-background rounded-2xl p-8 border border-border/50 inline-block">
            <p className="text-xl font-semibold">
              Spectra = the operational analytics system your floors, machines,
              assets, and properties always needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
