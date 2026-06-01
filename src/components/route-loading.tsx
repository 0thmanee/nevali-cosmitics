import { getTranslator } from "~/lib/i18n/server";

/** Minimal centered loading state shared by customer-facing route `loading.tsx` files. */
export async function RouteLoading() {
	const t = await getTranslator();
	return (
		<div
			className="flex min-h-[60vh] w-full items-center justify-center"
			style={{ background: "var(--color-cream)" }}
		>
			<div className="flex flex-col items-center gap-3">
				<div
					aria-hidden
					className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent"
					style={{ color: "var(--color-ink)" }}
				/>
				<p className="font-sans text-[13px] text-text-muted">
					{t("common.loading")}
				</p>
			</div>
		</div>
	);
}
