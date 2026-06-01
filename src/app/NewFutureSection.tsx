import Image from "next/image";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { COSMETICS_MARKETING } from "~/lib/cosmetics-image-placeholders";
import { getTranslator } from "~/lib/i18n/server";

export default async function NewFutureSection() {
	const t = await getTranslator();
	return (
		<section className="w-full bg-paper py-16 lg:py-28" id="mission">
			<AnimateOnScroll
				className="mx-auto flex max-w-7xl flex-col items-start gap-10 px-6 lg:flex-row lg:gap-16"
				direction="up"
			>
				<div className="flex w-full flex-col gap-5 lg:flex-1">
					<h2
						className="font-bold font-display text-text-dark uppercase leading-none"
						style={{
							fontSize: "clamp(32px, 5vw, 44px)",
							letterSpacing: "-0.01em",
						}}
					>
						{t("newFuture.titleLine1")}
						<br />
						{t("newFuture.titleLine2")}
						<br />
						{t("newFuture.titleLine3")}
					</h2>
					<p className="max-w-sm font-sans text-sm text-text-muted leading-relaxed">
						{t("newFuture.body")}
					</p>
					<div className="mt-1">
						<a
							className="inline-block rounded-sm border border-primary bg-primary px-5 py-2.5 font-display font-semibold text-sm text-white uppercase tracking-[0.15em]"
							href="/training"
						>
							{t("newFuture.readMore")}
						</a>
					</div>
				</div>

				<div className="grid w-full grid-cols-2 gap-3 lg:flex-1">
					<div className="relative h-48 overflow-hidden rounded-sm sm:h-64 lg:h-[340px]">
						<Image
							alt={t("newFuture.image1Alt")}
							className="object-cover object-center"
							fill
							src={COSMETICS_MARKETING.flatlay}
						/>
						<div
							className="absolute inset-0"
							style={{
								background:
									"linear-gradient(to top, color-mix(in srgb, var(--color-primary-darker) 32%, transparent) 0%, color-mix(in srgb, var(--color-primary-darker) 8%, transparent) 60%, transparent 100%)",
							}}
						/>
					</div>

					<div className="relative h-48 overflow-hidden rounded-sm sm:h-64 lg:h-[340px]">
						<Image
							alt={t("newFuture.image2Alt")}
							className="object-cover object-center"
							fill
							src={COSMETICS_MARKETING.creams}
						/>
						<div
							className="absolute inset-0"
							style={{
								background:
									"linear-gradient(to top, color-mix(in srgb, var(--color-primary-darker) 32%, transparent) 0%, color-mix(in srgb, var(--color-primary-darker) 8%, transparent) 60%, transparent 100%)",
							}}
						/>
					</div>
				</div>
			</AnimateOnScroll>
		</section>
	);
}
