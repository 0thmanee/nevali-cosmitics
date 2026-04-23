"use client";

import Link from "next/link";
import { useState } from "react";
import {
	useBuyerSavedLists,
	useCreateBuyerSavedList,
	useDeleteBuyerSavedList,
	useRemoveProductFromSavedList,
	useRenameBuyerSavedList,
} from "../hooks/use-buyer-saved";

export function BuyerSavedView() {
	const { data: lists, isPending, isError, refetch } = useBuyerSavedLists();
	const createList = useCreateBuyerSavedList();
	const renameList = useRenameBuyerSavedList();
	const deleteList = useDeleteBuyerSavedList();
	const removeItem = useRemoveProductFromSavedList();
	const [newListName, setNewListName] = useState("");

	if (isPending) {
		return (
			<p className="font-sans text-sm text-text-muted">Loading saved lists…</p>
		);
	}
	if (isError) {
		return (
			<p className="font-sans text-red-600 text-sm">
				Could not load lists.{" "}
				<button
					className="underline"
					onClick={() => void refetch()}
					type="button"
				>
					Retry
				</button>
			</p>
		);
	}

	const rows = lists ?? [];

	return (
		<div className="flex flex-col gap-6">
			<div className="rounded-sm border border-cream-dark bg-white p-5">
				<h2 className="font-bold font-serif text-text-dark">Create a list</h2>
				<p className="mt-1 font-sans text-sm text-text-muted">
					Organize products you want to compare or shortlist for sourcing.
				</p>
				<div className="mt-3 flex flex-wrap gap-2">
					<input
						className="min-w-[200px] flex-1 rounded-sm border border-cream-dark px-3 py-2 font-sans text-sm"
						maxLength={80}
						onChange={(e) => setNewListName(e.target.value)}
						placeholder="List name"
						value={newListName}
					/>
					<button
						className="rounded-sm bg-forest-mid px-4 py-2 font-sans font-semibold text-sm text-white disabled:opacity-50"
						disabled={!newListName.trim() || createList.isPending}
						onClick={async () => {
							const res = await createList.mutateAsync(newListName);
							if (res.error) window.alert(res.error);
							else setNewListName("");
						}}
						type="button"
					>
						Add list
					</button>
				</div>
			</div>

			{rows.map((list) => (
				<div
					className="overflow-hidden rounded-sm border border-cream-dark bg-white"
					key={list.id}
				>
					<div className="flex flex-col gap-2 border-cream-dark border-b bg-cream px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
						<RenameListInline
							disabled={renameList.isPending}
							name={list.name}
							onSave={async (name) => {
								const res = await renameList.mutateAsync({
									listId: list.id,
									name,
								});
								if (res.error) window.alert(res.error);
							}}
						/>
						<button
							className="font-sans text-red-700 text-xs hover:underline disabled:opacity-40"
							disabled={deleteList.isPending || rows.length <= 1}
							onClick={async () => {
								if (!window.confirm("Delete this list and its saved products?"))
									return;
								const res = await deleteList.mutateAsync(list.id);
								if (res.error) window.alert(res.error);
							}}
							type="button"
						>
							Delete list
						</button>
					</div>
					<div className="divide-y divide-cream-dark">
						{list.items.length === 0 ? (
							<p className="px-4 py-6 text-center font-sans text-sm text-text-muted">
								No products in this list yet.
							</p>
						) : (
							list.items.map((it) => (
								<div
									className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center"
									key={it.id}
								>
									<div className="flex min-w-0 flex-1 items-center gap-3">
										<div
											className="h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-cream-dark bg-cream"
											style={
												it.firstImageUrl
													? {
															backgroundImage: `url(${it.firstImageUrl})`,
															backgroundSize: "cover",
															backgroundPosition: "center",
														}
													: undefined
											}
										/>
										<div className="min-w-0">
											<Link
												className="line-clamp-2 font-sans font-semibold text-text-dark hover:text-forest-mid"
												href={`/products/${it.productId}`}
											>
												{it.productName}
											</Link>
											<p className="font-sans text-text-muted text-xs">
												{it.organizationName}
											</p>
										</div>
									</div>
									<div className="flex shrink-0 gap-2">
										<Link
											className="rounded-sm border border-cream-dark px-3 py-1.5 font-medium font-sans text-forest-mid text-xs hover:bg-cream"
											href={`/artisans/${it.organizationSlug}`}
										>
											Artisan
										</Link>
										<button
											className="rounded-sm px-3 py-1.5 font-sans text-text-muted text-xs hover:text-red-700"
											disabled={removeItem.isPending}
											onClick={async () => {
												const res = await removeItem.mutateAsync({
													listId: list.id,
													productId: it.productId,
												});
												if (res.error) window.alert(res.error);
											}}
											type="button"
										>
											Remove
										</button>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			))}
		</div>
	);
}

function RenameListInline({
	name,
	onSave,
	disabled,
}: {
	name: string;
	onSave: (name: string) => Promise<void>;
	disabled: boolean;
}) {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(name);

	if (!editing) {
		return (
			<div className="flex items-center gap-2">
				<h3 className="font-bold font-serif text-text-dark">{name}</h3>
				<button
					className="font-sans text-forest-mid text-xs hover:underline"
					onClick={() => {
						setValue(name);
						setEditing(true);
					}}
					type="button"
				>
					Rename
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-wrap items-center gap-2">
			<input
				className="min-w-[160px] rounded-sm border border-cream-dark px-2 py-1 font-sans text-sm"
				maxLength={80}
				onChange={(e) => setValue(e.target.value)}
				value={value}
			/>
			<button
				className="rounded-sm bg-forest-mid px-3 py-1 font-sans font-semibold text-white text-xs"
				disabled={disabled}
				onClick={async () => {
					await onSave(value);
					setEditing(false);
				}}
				type="button"
			>
				Save
			</button>
			<button
				className="font-sans text-text-muted text-xs"
				onClick={() => setEditing(false)}
				type="button"
			>
				Cancel
			</button>
		</div>
	);
}
