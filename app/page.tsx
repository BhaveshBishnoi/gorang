import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryGrid from "@/components/home/CategoryGrid";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import GrowingPlantLoader from "@/components/ui/GrowingPlantLoader";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <Suspense fallback={<GrowingPlantLoader />}>
        <FeaturedProducts />
      </Suspense>

      {/* Category Grid */}
      <Suspense fallback={<GrowingPlantLoader />}>
        <CategoryGrid />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={<GrowingPlantLoader />}>
        <Testimonials />
      </Suspense>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
