import Link from "next/link";
import {
	getFeaturedHomeHeroProductRepo,
	listApprovedProductsForPublicRepo,
} from "~/app/api/products/repo/products.repo";
import { PublicProductCard } from "~/components/public-product-card";

export default async function ProductsSection() {
	const hero = await getFeaturedHomeHeroProductRepo().catch(() => null);
	const dbProducts = await listApprovedProductsForPublicRepo(12, {
		excludeIds: hero?.id ? [hero.id] : undefined,
	}).catch(() => []);

	return (
		<section className="w-full bg-cream py-14">
			<div className="mx-auto max-w-7xl px-6">
				<h2
					className="mb-8 text-center font-bold font-display text-text-dark uppercase"
					style={{
						fontSize: "clamp(22px, 2.5vw, 34px)",
						letterSpacing: "0.05em",
					}}
				>
					Our Products
				</h2>

				{dbProducts.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-cream-dark bg-white/70 py-16 px-6 text-center">
						<p className="font-serif font-semibold text-lg text-text-dark">
							No live listings yet
						</p>
						<p className="max-w-md font-sans text-sm leading-relaxed text-text-muted">
							Approved products from verified partners will appear here. Open the
							catalog to see what is available today.
						</p>
						<Link
							className="font-sans text-xs font-semibold uppercase tracking-wide text-white px-5 py-2.5 transition-opacity hover:opacity-90"
							href="/products"
							style={{ background: "#000000" }}
						>
							Open catalog
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{dbProducts.map((p) => (
							<PublicProductCard key={p.id} product={p} />
						))}
					</div>
				)}
			</div>
		</section>
	);
}
