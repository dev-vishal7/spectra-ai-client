import React from "react";
import ContactSection from "./components/ContactSection";
import HeroSection from "./components/HeroSection";
import MicroSetup from "./components/MicroSetup";
import PhysicalOpsProblem from "./components/PhysicalOpsProblem";
import Pricing from "./components/Pricing";
import SimpleProcess from "./components/SimpleProcess";
import WhyChoose from "./components/WhyChoose";

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-900">
      <HeroSection />
      <PhysicalOpsProblem />
      <MicroSetup />
      <SimpleProcess />
      <WhyChoose />
      <Pricing />
      <ContactSection />
      <footer className="py-10 bg-gray-900 text-white text-center text-sm">
        © 2025 Spectra. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
