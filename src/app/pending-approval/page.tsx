import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "~/app/api/auth/actions";
import { getTranslator } from "~/lib/i18n/server";
import { PendingApprovalContent } from "./PendingApprovalContent";

export default async function PendingApprovalPage() {
	const t = await getTranslator();
	const session = await getSession();
	if (!session?.user) {
		redirect(
			"/auth/login?callbackUrl=" + encodeURIComponent("/pending-approval"),
		);
	}

	return (
		<div
			className="flex min-h-screen flex-col"
			style={{ background: "var(--color-paper)" }}
		>
			{/* Top bar */}
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
					{t("pendingApproval.badge")}
				</span>
			</div>

			{/* Content */}
			<div className="flex flex-1 items-center justify-center px-6 py-16">
				<PendingApprovalContent />
			</div>
		</div>
	);
}
