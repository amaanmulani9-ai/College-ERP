import React from "react";
import { Hero } from "../../components/public/Hero";
import { Stats } from "../../components/public/Stats";
import { FeatureSection } from "../../components/public/FeatureSection";
import { ModuleShowcase } from "../../components/public/ModuleShowcase";
import { IndustrySection } from "../../components/public/IndustrySection";
import { WhyChooseUs } from "../../components/public/WhyChooseUs";
import { CTASection } from "../../components/public/CTASection";

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Key Statistics Cards */}
      <Stats />

      {/* 3. Feature Section: Everything Your Institution Needs */}
      <FeatureSection />

      {/* 4. Enterprise Modules Showcase (Tasks 001 - 020 Interactive Modal Grid) */}
      <ModuleShowcase />

      {/* 5. Industries We Serve */}
      <IndustrySection />

      {/* 6. Why Choose College ERP Comparison */}
      <WhyChooseUs />

      {/* 7. Call to Action */}
      <CTASection />
    </div>
  );
};
