import React from "react";

const WhyChoose = () => (
  <section className="py-20 px-6 md:px-16 text-center">
    <h2 className="text-3xl font-bold mb-10">Why Teams Choose Spectra</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {[
        "More than Data Analytics",
        "Plug & Play Interface",
        "Realtime Automation",
        "Performance at Scale",
        "Zero-Code Setup",
        "Built for Industrial Operations",
      ].map((text, idx) => (
        <span
          key={idx}
          className="px-5 py-2 bg-gray-100 rounded-full text-gray-700 font-medium"
        >
          {text}
        </span>
      ))}
    </div>
  </section>
);

export default WhyChoose;
