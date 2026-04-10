import HeroSection from "../components/home/HeroSection";
import ProductGame from "../components/home/ProductGame";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import TrustSection from "../components/home/TrustSection";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      <HeroSection />
      <ProductGame />
      <CategoriesSection />
      <FeaturedProducts />
      <TrustSection />
      <CTASection />
    </main>
  );
}
