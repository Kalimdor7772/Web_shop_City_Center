import HeroSection from "../components/home/HeroSection";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import TrustSection from "../components/home/TrustSection";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <TrustSection />
      <CTASection />
    </main>
  );
}
