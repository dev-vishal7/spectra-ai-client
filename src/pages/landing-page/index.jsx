import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { ProblemSection } from "./components/ProblemSection";
import { FeaturesSection } from "./components/FutureSection";
import { HowItWorks } from "./components/HowItWorks";
import { UseCasesSection } from "./components/UseCasesSection";
import { WhySpectraSection } from "./components/WhySpectraSection";
import { AnalogySection } from "./components/AnalogySection";
import { PricingSection } from "./components/PricingSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";
const LandingPage = () => {
  return (
    <div className="font-sans bg-gray-200 text-gray-900">
      <Header />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <UseCasesSection />
      <WhySpectraSection />
      <AnalogySection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
