"use client";

import { useEffect, useRef } from "react";

type FlashToastProps = {
	message: string | null;
	onDismiss: () => void;
	durationMs?: number;
};

/**
 * Short-lived fixed banner for success or neutral feedback (no extra dependencies).
 */
export function FlashToast({
	message,
	onDismiss,
	durationMs = 5200,
}: FlashToastProps) {
	const dismissRef = useRef(onDismiss);
	dismissRef.current = onDismiss;

	useEffect(() => {
		if (!message) return;
		const t = window.setTimeout(() => dismissRef.current(), durationMs);
		return () => window.clearTimeout(t);
	}, [message, durationMs]);

	if (!message) return null;

	return (
		<div className="fixed bottom-6 left-1/2 z-50 flex w-[min(100%-2rem,28rem)] -translate-x-1/2 items-start gap-3 rounded-xl border border-cream-dark bg-white px-4 py-3 font-sans text-sm text-text-dark shadow-lg">
			<output
				aria-live="polite"
				className="min-w-0 flex-1 whitespace-pre-line leading-snug"
			>
				{message}
			</output>
			<button
				className="shrink-0 rounded-lg px-2 py-1 font-semibold text-forest-mid text-xs hover:bg-cream"
				onClick={() => dismissRef.current()}
				type="button"
			>
				OK
			</button>
		</div>
	);
}
