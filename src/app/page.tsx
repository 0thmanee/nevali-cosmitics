import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import EcosystemSection from "./EcosystemSection";
import NewFutureSection from "./NewFutureSection";
import FeaturedCategorySection from "./FeaturedCategorySection";
import CollectionsSection from "./CollectionsSection";
import QuoteSection from "./QuoteSection";
import ProductsSection from "./ProductsSection";
import StoriesSection from "./StoriesSection";
import Footer from "./Footer";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full min-h-screen">
      <Navbar />
      <div className="pt-[56px]" />
      <HeroSection />
      <NewFutureSection />
      <EcosystemSection />
      <QuoteSection />
      <StoriesSection />
      <FeaturedCategorySection />
      <CollectionsSection />
      <ProductsSection />
      <Footer />
    </main>
  );
}
