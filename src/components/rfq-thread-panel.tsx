"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { markRfqThreadNotificationsReadAction } from "~/app/api/notifications/actions";
import {
	usePostRfqMessage,
	useRfqMessages,
} from "~/features/artisan/hooks/use-rfq-thread";
import { unreadNotificationsQueryKey } from "~/features/notifications/use-unread-notification-count";

type Props = {
	rfqId: string;
	/** Shown when NEGOTIATING + turn is enforced */
	turnHint?: string;
};

const MAX_ATTACHMENTS = 5;
const ACCEPT = "application/pdf,image/jpeg,image/png,image/webp" as const;

export function RfqThreadPanel({ rfqId, turnHint }: Props) {
	const queryClient = useQueryClient();
	const { data, isPending, isError } = useRfqMessages(rfqId);
	const postMessage = usePostRfqMessage();
	const [body, setBody] = useState("");
	const [pendingFiles, setPendingFiles] = useState<
		{ id: string; file: File }[]
	>([]);

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			await markRfqThreadNotificationsReadAction(rfqId);
			if (!cancelled) {
				await queryClient.invalidateQueries({
					queryKey: unreadNotificationsQueryKey,
				});
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [rfqId, queryClient]);

	const messages = data?.messages ?? [];
	const loadError = data?.error;

	const send = useCallback(async () => {
		const trimmed = body.trim();
		if (!trimmed) return;
		const uploaded: {
			url: string;
			fileName: string;
			mimeType: string;
			sizeBytes: number;
		}[] = [];
		for (const { file: f } of pendingFiles) {
			const fd = new FormData();
			fd.set("type", "rfqMessageAttachments");
			fd.set("file", f);
			const res = await fetch("/api/media/upload", {
				method: "POST",
				body: fd,
			});
			const j = (await res.json()) as { url?: string; error?: string };
			if (!res.ok) {
				window.alert(j.error ?? "Upload failed.");
				return;
			}
			if (!j.url) {
				window.alert("Upload did not return a URL.");
				return;
			}
			uploaded.push({
				url: j.url,
				fileName: f.name,
				mimeType: f.type || "application/octet-stream",
				sizeBytes: f.size,
			});
		}
		const res = await postMessage.mutateAsync({
			rfqId,
			body: trimmed,
			attachments: uploaded.length > 0 ? uploaded : undefined,
		});
		if (res.error) {
			window.alert(res.error);
			return;
		}
		setBody("");
		setPendingFiles([]);
	}, [body, pendingFiles, postMessage, rfqId]);

	const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
		const picked = Array.from(e.target.files ?? []);
		e.target.value = "";
		if (picked.length === 0) return;
		setPendingFiles((prev) => {
			const next = [
				...prev,
				...picked.map((file) => ({ id: crypto.randomUUID(), file })),
			].slice(0, MAX_ATTACHMENTS);
			return next;
		});
	};

	if (isPending && !data) {
		return <p className="font-sans text-text-muted text-xs">Loading thread…</p>;
	}
	if (isError || loadError) {
		return (
			<p className="font-sans text-red-600 text-xs">
				{loadError ?? "Could not load messages."}
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{turnHint ? (
				<p className="font-medium font-sans text-[11px] text-forest-mid">
					{turnHint}
				</p>
			) : null}
			<div className="max-h-52 space-y-2 overflow-y-auto rounded-xl border border-cream-dark bg-white p-3">
				{messages.length === 0 ? (
					<p className="font-sans text-text-muted text-xs">No messages yet.</p>
				) : (
					messages.map((m) => (
						<div
							className={`rounded-lg px-3 py-2 font-sans text-xs leading-relaxed ${
								m.authorRole === "BUYER"
									? "ml-4 bg-cream text-text-dark"
									: "mr-4 bg-forest-mid/10 text-text-dark"
							}`}
							key={m.id}
						>
							<span className="mb-0.5 block font-bold text-[10px] text-text-muted uppercase tracking-wide">
								{m.authorRole === "BUYER" ? "Buyer" : "Partner"} ·{" "}
								{new Date(m.createdAt).toLocaleString(undefined, {
									dateStyle: "short",
									timeStyle: "short",
								})}
							</span>
							<span className="whitespace-pre-wrap">{m.body}</span>
							{m.attachments.length > 0 ? (
								<ul className="mt-2 list-inside list-disc font-sans text-[11px] text-forest-mid">
									{m.attachments.map((a) => (
										<li key={a.id}>
											<a
												className="underline"
												href={a.url}
												rel="noopener noreferrer"
												target="_blank"
											>
												{a.fileName || "Attachment"}
											</a>
										</li>
									))}
								</ul>
							) : null}
						</div>
					))
				)}
			</div>
			<div className="flex flex-col gap-2">
				<label className="font-sans text-[11px] text-text-muted">
					Attachments (optional, max {MAX_ATTACHMENTS}, PDF or images)
					<input
						accept={ACCEPT}
						className="mt-1 block w-full font-sans text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-cream file:px-3 file:py-1.5"
						multiple
						onChange={onPickFiles}
						type="file"
					/>
				</label>
				{pendingFiles.length > 0 ? (
					<ul className="font-sans text-[11px] text-text-muted">
						{pendingFiles.map(({ id, file: f }) => (
							<li className="flex items-center justify-between gap-2" key={id}>
								<span className="truncate">{f.name}</span>
								<button
									className="shrink-0 text-red-600"
									onClick={() =>
										setPendingFiles((prev) => prev.filter((p) => p.id !== id))
									}
									type="button"
								>
									Remove
								</button>
							</li>
						))}
					</ul>
				) : null}
			</div>
			<div className="flex flex-col gap-2 sm:flex-row sm:items-end">
				<textarea
					className="min-h-[72px] flex-1 resize-y rounded-xl border border-cream-dark bg-white px-3 py-2 font-sans text-sm text-text-dark placeholder:text-text-muted"
					maxLength={4000}
					onChange={(e) => setBody(e.target.value)}
					placeholder="Write a reply…"
					rows={3}
					value={body}
				/>
				<button
					className="shrink-0 rounded-xl bg-forest-mid px-4 py-2 font-sans font-semibold text-sm text-white disabled:opacity-50"
					disabled={postMessage.isPending || !body.trim()}
					onClick={() => void send()}
					type="button"
				>
					{postMessage.isPending ? "Sending…" : "Send"}
				</button>
			</div>
		</div>
	);
}
