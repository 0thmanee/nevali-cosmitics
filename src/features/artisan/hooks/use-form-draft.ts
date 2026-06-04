"use client";

import { useEffect, useMemo, useState } from "react";

type DraftEnvelope<T> = { data: T; updatedAt: string };

/**
 * Generic localStorage draft/autosave for forms (debounced). Mirrors the article
 * editor's recovery UX: on mount, if a stored draft differs from the baseline, it
 * is applied and `recovered` becomes true; edits autosave after `debounceMs`; an
 * unchanged form (equals baseline) clears the draft.
 *
 * - `current`: the serializable form state to persist.
 * - `base`: the baseline (empty for create, prefilled for edit) — used to detect
 *   "no real edits" so we don't store noise.
 * - `apply`: hydrate the form from a recovered/base snapshot.
 * Returns `discard()` (reset to base + clear) and `clear()` (clear only — call on submit).
 */
export function useFormDraft<T>(params: {
	storageKey: string;
	current: T;
	base: T;
	apply: (data: T) => void;
	debounceMs?: number;
	/** Gate the draft until the form is ready (e.g. an edit form whose data loads async). */
	enabled?: boolean;
}): {
	recovered: boolean;
	lastSavedAt: string | null;
	discard: () => void;
	clear: () => void;
} {
	const {
		storageKey,
		current,
		base,
		apply,
		debounceMs = 600,
		enabled = true,
	} = params;
	const [recovered, setRecovered] = useState(false);
	const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
	const [hydrated, setHydrated] = useState(false);

	const baseSnapshot = useMemo(() => JSON.stringify(base), [base]);
	const currentSnapshot = JSON.stringify(current);

	// Recover on mount.
	// biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount per key
	useEffect(() => {
		if (typeof window === "undefined" || !enabled) return;
		setHydrated(true);
		try {
			const raw = window.localStorage.getItem(storageKey);
			if (!raw) return;
			const parsed = JSON.parse(raw) as DraftEnvelope<T>;
			if (!parsed || typeof parsed !== "object" || !("data" in parsed)) return;
			if (JSON.stringify(parsed.data) === baseSnapshot) {
				window.localStorage.removeItem(storageKey);
				return;
			}
			apply(parsed.data);
			setRecovered(true);
			setLastSavedAt(parsed.updatedAt ?? null);
		} catch {
			// ignore malformed drafts
		}
	}, [storageKey, baseSnapshot, enabled]);

	// Debounced autosave.
	useEffect(() => {
		if (typeof window === "undefined" || !hydrated || !enabled) return;
		const timer = window.setTimeout(() => {
			try {
				if (currentSnapshot === baseSnapshot) {
					window.localStorage.removeItem(storageKey);
					setLastSavedAt(null);
					return;
				}
				const updatedAt = new Date().toISOString();
				window.localStorage.setItem(
					storageKey,
					JSON.stringify({ data: current, updatedAt }),
				);
				setLastSavedAt(updatedAt);
			} catch {
				// ignore quota / privacy-mode failures
			}
		}, debounceMs);
		return () => window.clearTimeout(timer);
	}, [
		hydrated,
		storageKey,
		currentSnapshot,
		baseSnapshot,
		current,
		debounceMs,
	]);

	const clear = () => {
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(storageKey);
		}
		setRecovered(false);
		setLastSavedAt(null);
	};

	const discard = () => {
		clear();
		apply(base);
	};

	return { recovered, lastSavedAt, discard, clear };
}
