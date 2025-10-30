import React from "react";

const HeroSection = () => (
  <section className="flex flex-col md:flex-row items-center justify-between py-20 px-6 md:px-16 bg-white">
    <div className="md:w-1/2 space-y-6">
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
        Micro Pipelines.
        <br />
        Micro Analytics.
        <br />
        Macro Results.
      </h1>
      <p className="text-gray-600 text-lg">
        Every ops team needs instant, micro-optimized systems — just plug, play,
        and start seeing the right impact immediately. Build, track, and control
        your daily data using micro flows.
      </p>
      <div className="flex gap-4">
        <button className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition">
          Get Started
        </button>
        <button className="border border-gray-400 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
          Book a Demo
        </button>
      </div>
    </div>
    <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
      <div className="border border-gray-300 rounded-lg p-10">
        <img
          src="/diagram-placeholder.png"
          alt="Spectra diagram"
          className="w-64 h-auto"
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
