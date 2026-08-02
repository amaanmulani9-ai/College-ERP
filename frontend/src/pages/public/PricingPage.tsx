import React from "react";
import { PricingSection } from "../../components/public/PricingSection";
import { FAQSection } from "../../components/public/FAQSection";
import { CTASection } from "../../components/public/CTASection";

export const PricingPage: React.FC = () => {
  return (
    <div className="pt-10 pb-20 space-y-16">
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};
