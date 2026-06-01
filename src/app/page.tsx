import CollectionsSection from "./CollectionsSection";
import FAQSection from "./FAQSection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import NewFutureSection from "./NewFutureSection";
import ProductsSection from "./ProductsSection";
import QuoteSection from "./QuoteSection";
import StoriesSection from "./StoriesSection";

export default function HomePage() {
	return (
		<main className="flex min-h-screen w-full flex-col">
			<Navbar />
			<div className="pt-[56px]" />
			<HeroSection />
			<NewFutureSection />
			<CollectionsSection />
			<ProductsSection />
			<QuoteSection />
			<StoriesSection />
			<FeaturesSection />
			<FAQSection />
			<Footer />
		</main>
	);
}
