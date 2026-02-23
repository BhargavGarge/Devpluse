import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { Integrations } from "@/components/Integrations";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative z-10 w-full overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <HeroSection />
        <Integrations />
        <FeaturesGrid />
        <Testimonials />
        <CTA />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
