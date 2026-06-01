import Link from "next/link";
import { getTranslator } from "~/lib/i18n/server";

export default async function NotFound() {
	const t = await getTranslator();
	return (
		<div
			className="flex min-h-screen flex-col"
			style={{ background: "var(--color-paper)" }}
		>
			<div
				className="flex items-center justify-between px-8 py-5"
				style={{ borderBottom: "1px solid var(--color-cream-dark)" }}
			>
				<Link
					className="font-bold font-display text-[16px] text-text-dark uppercase tracking-wide"
					href="/"
				>
					nevali
				</Link>
				<span
					className="rounded-full px-3 py-1 font-bold font-sans text-[11px] uppercase tracking-[0.16em]"
					style={{
						background:
							"color-mix(in srgb, var(--color-text-muted) 10%, transparent)",
						color: "var(--color-text-muted)",
						border:
							"1px solid color-mix(in srgb, var(--color-text-muted) 25%, transparent)",
					}}
				>
					404
				</span>
			</div>

			<div className="flex flex-1 items-center justify-center px-6 py-16">
				<div className="max-w-md text-center">
					<h1 className="font-bold font-display text-[clamp(28px,5vw,40px)] text-text-dark">
						{t("notFound.title")}
					</h1>
					<p className="mt-4 font-sans text-[15px] text-text-muted leading-relaxed">
						{t("notFound.description")}
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						<Link
							className="rounded-full px-5 py-3 font-sans font-semibold text-[13px] text-white uppercase tracking-wide"
							href="/"
							style={{ background: "var(--color-ink)" }}
						>
							{t("notFound.home")}
						</Link>
						<Link
							className="rounded-full px-5 py-3 font-sans font-semibold text-[13px] uppercase tracking-wide"
							href="/products"
							style={{
								color: "var(--color-ink)",
								border: "1px solid var(--color-cream-dark)",
							}}
						>
							{t("notFound.browseProducts")}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
