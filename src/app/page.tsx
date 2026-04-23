import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import NewFutureSection from "./NewFutureSection";
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
      <CollectionsSection />
      <ProductsSection />
      <QuoteSection />
      <StoriesSection />
      <Footer />
    </main>
  );
}
