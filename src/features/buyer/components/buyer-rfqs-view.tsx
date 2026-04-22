"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { RfqRow } from "~/app/api/contracts";
import { markRfqThreadNotificationsReadAction } from "~/app/api/notifications/actions";
import { unreadNotificationsQueryKey } from "~/features/notifications/use-unread-notification-count";
import { FlashToast } from "~/components/flash-toast";
import { RfqThreadPanel } from "~/components/rfq-thread-panel";
import { mapRfqToDisplay } from "~/features/artisan/components/contracts/contracts-mappers";
import {
	buyerRfqsQueryKey,
	useBuyerRfqs,
	useCreateContractFromRfqBuyer,
} from "../hooks/use-buyer-rfqs";

export { buyerRfqsQueryKey };

function statusLabel(s: RfqRow["status"]): string {
	switch (s) {
		case "NEW":
			return "New";
		case "QUOTED":
			return "Quoted";
		case "NEGOTIATING":
			return "Negotiating";
		case "DECLINED":
			return "Declined";
		case "CANCELLED":
			return "Cancelled";
		default:
			return s;
	}
}

export function BuyerRfqsView() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data, isPending, isError } = useBuyerRfqs();
	const recordContract = useCreateContractFromRfqBuyer();
	const [pendingRfqId, setPendingRfqId] = useState<string | null>(null);
	const [flashMessage, setFlashMessage] = useState<string | null>(null);
	const [threadRfqId, setThreadRfqId] = useState<string | null>(null);
	const clearFlash = useCallback(() => setFlashMessage(null), []);

	useEffect(() => {
		const thread = searchParams.get("thread");
		const list = data ?? [];
		if (!thread || isPending || isError) return;
		if (!list.some((r) => r.id === thread)) return;
		setThreadRfqId(thread);
		void (async () => {
			await markRfqThreadNotificationsReadAction(thread);
			await queryClient.invalidateQueries({
				queryKey: unreadNotificationsQueryKey,
			});
		})();
		router.replace("/buyer/rfqs", { scroll: false });
	}, [searchParams, data, router, isPending, isError, queryClient]);

	async function handleRecordContract(r: RfqRow) {
		if (
			!window.confirm(
				"Accept and record this as an active contract? The inquiry will close and the partner will be notified.",
			)
		) {
			return;
		}
		setPendingRfqId(r.id);
		try {
			const res = await recordContract.mutateAsync({ rfqId: r.id });
			if (res.error) window.alert(res.error);
			else if (res.contract) {
				setFlashMessage(`Contract recorded.\n\nReference: ${res.contract.id}`);
			}
		} finally {
			setPendingRfqId(null);
		}
	}

	const rows = data ?? [];
	const threadRfq = threadRfqId
		? rows.find((x) => x.id === threadRfqId)
		: undefined;
	const threadHint =
		threadRfq != null
			? mapRfqToDisplay(threadRfq, rows.indexOf(threadRfq), "buyer")
					.negotiationHint || undefined
			: undefined;

	return (
		<>
			<FlashToast message={flashMessage} onDismiss={clearFlash} />
			{threadRfqId ? (
				<div
					aria-labelledby="rfq-thread-title"
					aria-modal="true"
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
					role="dialog"
				>
					<div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-cream-dark bg-white p-5 shadow-xl">
						<div className="mb-3 flex items-start justify-between gap-3">
							<h2
								className="font-bold font-serif text-text-dark"
								id="rfq-thread-title"
							>
								Inquiry thread
							</h2>
							<button
								className="rounded-lg px-2 py-1 font-sans text-sm text-text-muted hover:bg-cream"
								onClick={() => setThreadRfqId(null)}
								type="button"
							>
								Close
							</button>
						</div>
						<RfqThreadPanel rfqId={threadRfqId} turnHint={threadHint} />
					</div>
				</div>
			) : null}
			{isPending ? (
				<p className="font-sans text-sm text-text-muted">Loading inquiries…</p>
			) : isError ? (
				<p className="font-sans text-red-600 text-sm">
					Could not load inquiries. Try refreshing the page.
				</p>
			) : rows.length === 0 ? (
				<div className="rounded-xl border border-cream-dark bg-white p-8 text-center">
					<p className="mx-auto max-w-md font-sans text-sm text-text-muted">
						No inquiries yet. When you request a quote or add-to-cart from a
						product page while signed in, it will show up here.
					</p>
					<a
						className="mt-4 inline-block font-medium font-sans text-forest-mid text-sm hover:underline"
						href="/products"
					>
						Browse products
					</a>
				</div>
			) : (
				<div className="overflow-hidden rounded-xl border border-cream-dark bg-white">
					<div className="overflow-x-auto">
						<table className="w-full text-left font-sans text-sm">
							<thead className="border-cream-dark border-b bg-cream">
								<tr>
									<th className="px-4 py-3 font-semibold text-text-dark">
										Product
									</th>
									<th className="px-4 py-3 font-semibold text-text-dark">
										Qty
									</th>
									<th className="px-4 py-3 font-semibold text-text-dark">
										Status
									</th>
									<th className="px-4 py-3 font-semibold text-text-dark">
										Date
									</th>
									<th className="whitespace-nowrap px-4 py-3 font-semibold text-text-dark">
										Thread
									</th>
									<th className="whitespace-nowrap px-4 py-3 font-semibold text-text-dark">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((r) => (
									<tr
										className="border-cream-dark border-b last:border-0"
										key={r.id}
									>
										<td className="max-w-[240px] px-4 py-3 text-text-dark">
											<span className="line-clamp-2">{r.product}</span>
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-text-muted">
											{r.quantity}
										</td>
										<td className="whitespace-nowrap px-4 py-3">
											<span className="rounded-full border border-cream-dark bg-cream px-2 py-0.5 font-medium text-forest-mid text-xs">
												{statusLabel(r.status)}
											</span>
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-text-muted">
											{new Date(r.createdAt).toLocaleDateString()}
										</td>
										<td className="whitespace-nowrap px-4 py-3">
											{r.status === "QUOTED" || r.status === "NEGOTIATING" ? (
												<button
													className="rounded-lg border border-cream-dark bg-white px-3 py-1.5 font-sans font-semibold text-text-dark text-xs hover:bg-cream"
													onClick={() => setThreadRfqId(r.id)}
													type="button"
												>
													Messages
												</button>
											) : (
												<span className="text-text-muted text-xs">—</span>
											)}
										</td>
										<td className="whitespace-nowrap px-4 py-3">
											{r.status === "QUOTED" || r.status === "NEGOTIATING" ? (
												<button
													className="rounded-lg border border-forest-mid/30 bg-forest-mid/10 px-3 py-1.5 font-sans font-semibold text-forest-mid text-xs hover:bg-forest-mid/15 disabled:opacity-50"
													disabled={
														pendingRfqId === r.id && recordContract.isPending
													}
													onClick={() => void handleRecordContract(r)}
													type="button"
												>
													{pendingRfqId === r.id && recordContract.isPending
														? "Recording…"
														: "Accept & record contract"}
												</button>
											) : (
												<span className="text-text-muted text-xs">—</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</>
	);
}
