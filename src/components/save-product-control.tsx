"use client";

import { useState } from "react";
import {
	useAddProductToSavedList,
	useBuyerSavedListsPicker,
} from "~/features/buyer/hooks/use-buyer-saved";
import { useSession } from "~/lib/auth-client";

type Props = { productId: string };

export function SaveProductControl({ productId }: Props) {
	const { data: session, isPending: sessionLoading } = useSession();
	const role = (session?.user as { role?: string } | undefined)?.role;
	const { data: lists, isPending: listsLoading } = useBuyerSavedListsPicker();
	const addProduct = useAddProductToSavedList();
	const [listId, setListId] = useState<string>("");

	if (sessionLoading) return null;
	if (!session?.user || role !== "buyer") return null;

	if (listsLoading || !lists?.length) {
		return (
			<p className="font-sans text-stone-500 text-xs">Loading your lists…</p>
		);
	}

	const effectiveListId = listId || lists[0]?.id || "";

	return (
		<div className="flex max-w-md flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50/80 p-4">
			<p className="font-sans font-semibold text-stone-600 text-xs uppercase tracking-wide">
				Save to a list
			</p>
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
				<select
					className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-2 font-sans text-sm text-stone-800"
					onChange={(e) => setListId(e.target.value)}
					value={effectiveListId}
				>
					{lists.map((l) => (
						<option key={l.id} value={l.id}>
							{l.name}
						</option>
					))}
				</select>
				<button
					className="rounded-lg bg-[#000000] px-4 py-2 font-sans font-semibold text-sm text-white hover:opacity-90 disabled:opacity-50"
					disabled={addProduct.isPending || !effectiveListId}
					onClick={async () => {
						const res = await addProduct.mutateAsync({
							listId: effectiveListId,
							productId,
						});
						if (res.error) window.alert(res.error);
						else window.alert("Saved to your list.");
					}}
					type="button"
				>
					{addProduct.isPending ? "Saving…" : "Save product"}
				</button>
			</div>
			<LinkBuyerSaved />
		</div>
	);
}

function LinkBuyerSaved() {
	return (
		<a
			className="font-sans text-[#000000] text-xs hover:underline"
			href="/buyer/saved"
		>
			View saved lists →
		</a>
	);
}
