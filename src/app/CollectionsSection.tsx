import Image from "next/image";
import Link from "next/link";
import { listApprovedProductsForPublicRepo } from "~/app/api/products/repo/products.repo";
import { getCategoryGradient } from "~/lib/public-product-gradient";

type MosaicProduct = {
	id: string;
	name: string;
	category: string;
	firstImageUrl: string | null;
};

function MosaicTile({ product }: { product: MosaicProduct }) {
	const hasImage = Boolean(product.firstImageUrl);
	return (
		<div className="relative h-full w-full">
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: hasImage ? undefined : getCategoryGradient(product.category),
				}}
			/>
			{hasImage && product.firstImageUrl ? (
				<Image
					alt={product.name}
					className="object-cover"
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
					src={product.firstImageUrl}
				/>
			) : null}
			<div
				className="absolute inset-0 flex items-end p-3"
				style={{
					background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 68%)",
				}}
			>
				<span className="line-clamp-2 font-sans text-sm font-medium uppercase tracking-widest text-white/95">
					{product.name}
				</span>
			</div>
		</div>
	);
}

export default async function CollectionsSection() {
	const products = await listApprovedProductsForPublicRepo(8).catch(() => []);

	const row1 = products.slice(0, 3);
	const row2 = products.slice(3, 5);

	return (
		<section className="w-full bg-white py-28">
			<div className="mx-auto max-w-7xl px-6">
				<div className="mb-8 flex flex-col gap-2">
					<h2
						className="font-display font-bold uppercase leading-[1.0] text-text-dark"
						style={{ fontSize: "clamp(28px, 3.5vw, 48px)", letterSpacing: "-0.01em" }}
					>
						From Moroccan labs
						<br />
						to your shelf
					</h2>
					<p className="max-w-md font-sans text-base leading-relaxed text-text-muted">
						Live picks from the catalog—tap through for ingredients, brand story, variants, and guest-friendly checkout.
					</p>
				</div>

				{products.length === 0 ? (
					<div className="flex flex-col items-start gap-3 rounded-sm border border-stone-200 bg-stone-50/80 py-10 px-6">
						<p className="font-sans font-semibold text-text-dark">
							No approved products to highlight yet
						</p>
						<p className="max-w-md font-sans text-sm text-text-muted">
							When partners publish approved listings, they will show here automatically.
						</p>
						<Link
							className="font-sans text-xs font-semibold uppercase tracking-wide text-white px-5 py-2.5 transition-opacity hover:opacity-90"
							href="/products"
							style={{ background: "#7B1F0A" }}
						>
							Browse catalog
						</Link>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{row1.length > 0 ? (
							<div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
								{row1.map((p) => (
									<Link
										className="group relative flex-1 overflow-hidden rounded-sm"
										href={`/products/${p.id}`}
										key={p.id}
										style={{ height: "clamp(200px, 24vw, 340px)" }}
									>
										<MosaicTile product={p} />
									</Link>
								))}
							</div>
						) : null}

						{row2.length > 0 ? (
							<div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
								{row2[0] ? (
									<Link
										className="group relative flex-[1.6] overflow-hidden rounded-sm"
										href={`/products/${row2[0].id}`}
										key={row2[0].id}
										style={{ height: "clamp(180px, 20vw, 280px)" }}
									>
										<MosaicTile product={row2[0]} />
									</Link>
								) : null}
								{row2[1] ? (
									<Link
										className="group relative flex-1 overflow-hidden rounded-sm"
										href={`/products/${row2[1].id}`}
										key={row2[1].id}
										style={{ height: "clamp(180px, 20vw, 280px)" }}
									>
										<MosaicTile product={row2[1]} />
									</Link>
								) : null}
							</div>
						) : null}
					</div>
				)}
			</div>
		</section>
	);
}
