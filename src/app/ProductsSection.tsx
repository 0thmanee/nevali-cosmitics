import Link from "next/link";
import {
	getFeaturedHomeHeroProductRepo,
	listApprovedProductsForPublicRepo,
} from "~/app/api/products/repo/products.repo";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { PublicProductCard } from "~/components/public-product-card";
import { getTranslator } from "~/lib/i18n/server";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";

export default async function ProductsSection() {
	const t = await getTranslator();
	const brand = NEVALI_HOUSE_BRAND.legalName;
	const hero = await getFeaturedHomeHeroProductRepo().catch(() => null);
	const dbProducts = await listApprovedProductsForPublicRepo(6, {
		excludeIds: hero?.id ? [hero.id] : undefined,
	}).catch(() => []);

	return (
		<section className="w-full bg-cream py-14">
			<AnimateOnScroll className="mx-auto max-w-7xl px-6" direction="up" scale>
				<h2
					className="mb-8 text-center font-bold font-display text-text-dark uppercase"
					style={{
						fontSize: "clamp(22px, 2.5vw, 34px)",
						letterSpacing: "0.05em",
					}}
				>
					{t("productsSection.title")}
				</h2>

				{dbProducts.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-cream-dark bg-white/70 px-6 py-16 text-center">
						<p className="font-semibold font-serif text-lg text-text-dark">
							{t("productsSection.emptyTitle")}
						</p>
						<p className="max-w-md font-sans text-sm text-text-muted leading-relaxed">
							{t("productsSection.emptyBody", { brand })}
						</p>
						<Link
							className="rounded-sm bg-primary px-5 py-2.5 font-sans font-semibold text-white text-xs uppercase tracking-wide transition-opacity hover:opacity-90"
							href="/products"
						>
							{t("productsSection.viewAll")}
						</Link>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{dbProducts.map((p) => (
								<PublicProductCard key={p.id} product={p} />
							))}
						</div>
						<div className="mt-10 flex justify-center">
							<Link
								className="rounded-sm bg-primary px-6 py-3 font-sans font-semibold text-white text-xs uppercase tracking-wide transition-opacity hover:opacity-90"
								href="/products"
							>
								{t("productsSection.viewAll")}
							</Link>
						</div>
					</>
				)}
			</AnimateOnScroll>
		</section>
	);
}
