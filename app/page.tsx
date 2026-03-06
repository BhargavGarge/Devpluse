"use client";

import { Navigation } from "@/components/Navigation";
import Hero from "@/components/ui/animated-shader-hero";
import { Integrations } from "@/components/Integrations";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { DashboardMockup } from "@/components/DashboardMockup";
import ClientFeedback from "@/components/ui/testimonial";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { BadgeCheck, ArrowRight, Router } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handlePrimaryClick = () => {
    router.push("/demo");
    // Navigate or trigger action
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10 w-full overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <Hero
          trustBadge={{
            text: "Trusted by 120+ engineering teams",
            icon: <BadgeCheck className="w-4 h-4" />
          }}
          headline={{
            line1: "AI-Powered",
            line2: " The Engineering Intelligence"
          }}
          subtitle="Unlock the full potential of your development team with calm, data-driven insights. No noise, just clarity for high-performing organizations."
          buttons={{
            primary: {
              text: "Get Started Free",
              icon: <ArrowRight className="w-5 h-5" />,
              // onClick: handlePrimaryClick,
            },
            secondary: {
              text: "View Demo",
              onClick: handlePrimaryClick,





            }
          }}
        >
          {/* Mockup in the right column */}
          <DashboardMockup />
        </Hero>
        <Integrations />
        <FeaturesGrid />
        <ClientFeedback />
        <CTA />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
