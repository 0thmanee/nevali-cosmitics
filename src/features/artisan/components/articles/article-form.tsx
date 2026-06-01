"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { ProducerArticleRow } from "~/app/api/articles/articles.types";
import { ArticleMarkdown } from "~/components/article-markdown";
import {
	ARTICLE_COVER_PRESETS,
	DEFAULT_ARTICLE_COVER,
} from "~/lib/article-cover-presets";
import { uploadMedia } from "~/lib/media";
import {
	useCreateArticle,
	useDeleteArticle,
	useUpdateArticle,
} from "../../hooks/use-articles";

type Props = { mode: "create" } | { mode: "edit"; article: ProducerArticleRow };

const MARKDOWN_SNIPPETS = [
	{ label: "H2", snippet: "\n\n## Section title\n\n" },
	{ label: "Quote", snippet: "\n\n> Quote text\n\n" },
	{
		label: "Bullet list",
		snippet: "\n\n- First point\n- Second point\n- Third point\n\n",
	},
	{
		label: "Numbered list",
		snippet: "\n\n1. First step\n2. Second step\n3. Third step\n\n",
	},
	{ label: "Link", snippet: "\n\n[Link label](https://example.com)\n\n" },
	{
		label: "Table",
		snippet:
			"\n\n| Ingredient | Benefit |\n| --- | --- |\n| Argan oil | Nourishes |\n| Rose water | Soothes |\n\n",
	},
	{
		label: "Code block",
		snippet: "\n\n```txt\nAdd your technical notes here\n```\n\n",
	},
	{ label: "Divider", snippet: "\n\n---\n\n" },
] as const;

type ArticleDraftPayload = {
	title: string;
	tag: string;
	excerpt: string;
	body: string;
	coverGradient: string;
	coverImageUrl: string | null;
	status: "DRAFT" | "PUBLISHED";
	updatedAt: string;
};

export function ArticleForm(props: Props) {
	const router = useRouter();
	const bodyRef = useRef<HTMLTextAreaElement>(null);
	const coverInputRef = useRef<HTMLInputElement>(null);
	const inlineImageInputRef = useRef<HTMLInputElement>(null);
	const [pending, startTransition] = useTransition();
	const createMutation = useCreateArticle();
	const updateMutation = useUpdateArticle();
	const deleteMutation = useDeleteArticle();

	const initial = props.mode === "edit" ? props.article : null;
	const [title, setTitle] = useState(initial?.title ?? "");
	const [tag, setTag] = useState(initial?.tag ?? "");
	const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
	const [body, setBody] = useState(initial?.body ?? "");
	const [coverGradient, setCoverGradient] = useState(
		initial?.coverGradient ?? DEFAULT_ARTICLE_COVER,
	);
	const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
		initial?.coverImageUrl ?? null,
	);
	const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
		(initial?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as
			| "DRAFT"
			| "PUBLISHED",
	);
	const [error, setError] = useState<string | null>(null);
	const [uploadingCover, setUploadingCover] = useState(false);
	const [uploadingInline, setUploadingInline] = useState(false);
	const [editorView, setEditorView] = useState<"write" | "split" | "preview">(
		"split",
	);
	const [hasRecoveredDraft, setHasRecoveredDraft] = useState(false);
	const [lastAutosaveAt, setLastAutosaveAt] = useState<string | null>(null);
	const [initialHydrated, setInitialHydrated] = useState(false);

	const busy =
		pending ||
		createMutation.isPending ||
		updateMutation.isPending ||
		deleteMutation.isPending;

	const readingMeta = useMemo(() => {
		const plain = body
			.replace(/```[\s\S]*?```/g, " ")
			.replace(/`[^`]+`/g, " ")
			.replace(/!\[[^\]]*]\([^)]+\)/g, " ")
			.replace(/\[[^\]]+]\([^)]+\)/g, "$1")
			.replace(/[#>*_\-|]/g, " ")
			.trim();
		const words = plain ? plain.split(/\s+/).length : 0;
		const minutes = Math.max(1, Math.ceil(words / 210));
		return { words, minutes };
	}, [body]);

	const draftStorageKey = useMemo(
		() =>
			props.mode === "edit"
				? `nevali:article-draft:edit:${props.article.id}`
				: "nevali:article-draft:create",
		[props],
	);

	const baseSnapshot = useMemo(
		() =>
			JSON.stringify({
				title: initial?.title ?? "",
				tag: initial?.tag ?? "",
				excerpt: initial?.excerpt ?? "",
				body: initial?.body ?? "",
				coverGradient: initial?.coverGradient ?? DEFAULT_ARTICLE_COVER,
				coverImageUrl: initial?.coverImageUrl ?? null,
				status: (initial?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as
					| "DRAFT"
					| "PUBLISHED",
			}),
		[initial],
	);

	const currentSnapshot = useMemo(
		() =>
			JSON.stringify({
				title,
				tag,
				excerpt,
				body,
				coverGradient,
				coverImageUrl,
				status,
			}),
		[title, tag, excerpt, body, coverGradient, coverImageUrl, status],
	);

	useEffect(() => {
		if (typeof window === "undefined") return;
		setInitialHydrated(true);
		try {
			const raw = window.localStorage.getItem(draftStorageKey);
			if (!raw) return;
			const parsed = JSON.parse(raw) as ArticleDraftPayload;
			if (!parsed || typeof parsed !== "object") return;

			const savedSnapshot = JSON.stringify({
				title: parsed.title ?? "",
				tag: parsed.tag ?? "",
				excerpt: parsed.excerpt ?? "",
				body: parsed.body ?? "",
				coverGradient: parsed.coverGradient ?? DEFAULT_ARTICLE_COVER,
				coverImageUrl: parsed.coverImageUrl ?? null,
				status: parsed.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
			});
			if (savedSnapshot === baseSnapshot) {
				window.localStorage.removeItem(draftStorageKey);
				return;
			}

			setTitle(parsed.title ?? "");
			setTag(parsed.tag ?? "");
			setExcerpt(parsed.excerpt ?? "");
			setBody(parsed.body ?? "");
			setCoverGradient(parsed.coverGradient ?? DEFAULT_ARTICLE_COVER);
			setCoverImageUrl(parsed.coverImageUrl ?? null);
			setStatus(parsed.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT");
			setHasRecoveredDraft(true);
			setLastAutosaveAt(parsed.updatedAt ?? null);
		} catch {
			// Ignore malformed local drafts.
		}
	}, [draftStorageKey, baseSnapshot]);

	useEffect(() => {
		if (typeof window === "undefined" || !initialHydrated) return;
		const timer = window.setTimeout(() => {
			try {
				if (currentSnapshot === baseSnapshot) {
					window.localStorage.removeItem(draftStorageKey);
					setLastAutosaveAt(null);
					return;
				}
				const payload: ArticleDraftPayload = {
					title,
					tag,
					excerpt,
					body,
					coverGradient,
					coverImageUrl,
					status,
					updatedAt: new Date().toISOString(),
				};
				window.localStorage.setItem(draftStorageKey, JSON.stringify(payload));
				setLastAutosaveAt(payload.updatedAt);
			} catch {
				// Ignore storage quota / privacy mode failures.
			}
		}, 600);
		return () => window.clearTimeout(timer);
	}, [
		initialHydrated,
		draftStorageKey,
		currentSnapshot,
		baseSnapshot,
		title,
		tag,
		excerpt,
		body,
		coverGradient,
		coverImageUrl,
		status,
	]);

	function clearLocalDraft(resetToInitial: boolean) {
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(draftStorageKey);
		}
		setHasRecoveredDraft(false);
		setLastAutosaveAt(null);
		if (resetToInitial) {
			setTitle(initial?.title ?? "");
			setTag(initial?.tag ?? "");
			setExcerpt(initial?.excerpt ?? "");
			setBody(initial?.body ?? "");
			setCoverGradient(initial?.coverGradient ?? DEFAULT_ARTICLE_COVER);
			setCoverImageUrl(initial?.coverImageUrl ?? null);
			setStatus(
				(initial?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as
					| "DRAFT"
					| "PUBLISHED",
			);
		}
	}

	async function onCoverFile(file: File | null) {
		if (!file) return;
		setError(null);
		setUploadingCover(true);
		try {
			const { url } = await uploadMedia(file, "articleMedia");
			setCoverImageUrl(url);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Cover upload failed.");
		} finally {
			setUploadingCover(false);
			if (coverInputRef.current) coverInputRef.current.value = "";
		}
	}

	function insertSnippet(snippet: string) {
		const ta = bodyRef.current;
		if (!ta) {
			setBody((b) => `${b}${snippet}`);
			return;
		}
		const start = ta.selectionStart;
		const end = ta.selectionEnd;
		setBody((current) => {
			const before = current.slice(0, start);
			const after = current.slice(end);
			const next = `${before}${snippet}${after}`;
			const caret = start + snippet.length;
			requestAnimationFrame(() => {
				ta.setSelectionRange(caret, caret);
				ta.focus();
			});
			return next;
		});
	}

	async function onInlineImageFile(file: File | null) {
		if (!file) return;
		setError(null);
		setUploadingInline(true);
		try {
			const { url } = await uploadMedia(file, "articleMedia");
			const alt = file.name.replace(/\.[^/.]+$/, "").slice(0, 80) || "Image";
			const snippet = `\n\n![${alt}](${url})\n\n`;
			insertSnippet(snippet);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Image upload failed.");
		} finally {
			setUploadingInline(false);
			if (inlineImageInputRef.current) inlineImageInputRef.current.value = "";
		}
	}

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		startTransition(async () => {
			try {
				if (props.mode === "create") {
					const row = await createMutation.mutateAsync({
						title,
						tag: tag.trim() || null,
						excerpt: excerpt.trim() || null,
						body,
						coverGradient,
						coverImageUrl,
						status,
					});
					clearLocalDraft(false);
					router.push(`/artisan/articles/${row.id}/edit`);
					router.refresh();
				} else {
					await updateMutation.mutateAsync({
						id: props.article.id,
						title,
						tag: tag.trim() || null,
						excerpt: excerpt.trim() || null,
						body,
						coverGradient,
						coverImageUrl,
						status,
					});
					clearLocalDraft(false);
					router.refresh();
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Something went wrong.");
			}
		});
	}

	function onDelete() {
		if (props.mode !== "edit") return;
		if (!window.confirm("Delete this article? This cannot be undone.")) return;
		setError(null);
		startTransition(async () => {
			try {
				await deleteMutation.mutateAsync(props.article.id);
				router.push("/artisan/articles");
				router.refresh();
			} catch (err) {
				setError(err instanceof Error ? err.message : "Delete failed.");
			}
		});
	}

	return (
		<form className="flex max-w-3xl flex-col gap-6" onSubmit={onSubmit}>
			<div className="flex flex-wrap gap-2">
				<Link
					className="font-sans text-sm text-text-muted hover:text-text-dark"
					href="/artisan/articles"
				>
					← Journal
				</Link>
			</div>

			{error && (
				<div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 font-sans text-red-800 text-sm">
					{error}
				</div>
			)}

			{hasRecoveredDraft && (
				<div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-amber-900 text-sm">
					<p className="font-semibold">
						Recovered unsaved draft from this browser.
					</p>
					<div className="mt-2 flex flex-wrap items-center gap-3">
						{lastAutosaveAt ? (
							<span className="text-[12px] text-amber-800">
								Last autosave: {new Date(lastAutosaveAt).toLocaleString()}
							</span>
						) : null}
						<button
							className="rounded-sm border border-amber-300 bg-white px-2.5 py-1 font-semibold text-[12px] hover:bg-amber-100"
							onClick={() => clearLocalDraft(true)}
							type="button"
						>
							Discard recovered draft
						</button>
					</div>
				</div>
			)}

			<div className="flex flex-col gap-1.5">
				<label
					className="font-sans font-semibold text-text-muted text-xs uppercase tracking-wide"
					htmlFor="article-title"
				>
					Title
				</label>
				<input
					className="rounded-sm border border-cream-dark bg-white px-3 py-2 font-sans text-sm"
					id="article-title"
					maxLength={200}
					onChange={(e) => setTitle(e.target.value)}
					required
					value={title}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label
					className="font-sans font-semibold text-text-muted text-xs uppercase tracking-wide"
					htmlFor="article-tag"
				>
					Tag (optional)
				</label>
				<input
					className="rounded-sm border border-cream-dark bg-white px-3 py-2 font-sans text-sm"
					id="article-tag"
					maxLength={60}
					onChange={(e) => setTag(e.target.value)}
					placeholder="e.g. Compliance, Community"
					value={tag}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label
					className="font-sans font-semibold text-text-muted text-xs uppercase tracking-wide"
					htmlFor="article-excerpt"
				>
					Excerpt (optional)
				</label>
				<textarea
					className="min-h-[72px] resize-y rounded-sm border border-cream-dark bg-white px-3 py-2 font-sans text-sm"
					id="article-excerpt"
					maxLength={800}
					onChange={(e) => setExcerpt(e.target.value)}
					rows={3}
					value={excerpt}
				/>
			</div>

			<div className="flex flex-col gap-3 rounded-sm border border-cream-dark bg-white p-4">
				<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
					<span className="font-sans font-semibold text-text-muted text-xs uppercase tracking-wide">
						Cover media
					</span>
					<div className="flex flex-wrap gap-2">
						<input
							accept="image/jpeg,image/png,image/webp"
							className="hidden"
							onChange={(e) => void onCoverFile(e.target.files?.[0] ?? null)}
							ref={coverInputRef}
							type="file"
						/>
						<button
							className="rounded-sm border border-cream-dark bg-paper px-3 py-1.5 font-sans font-semibold text-xs hover:bg-cream disabled:opacity-50"
							disabled={busy || uploadingCover}
							onClick={() => coverInputRef.current?.click()}
							type="button"
						>
							{uploadingCover ? "Uploading…" : "Upload cover photo"}
						</button>
						{coverImageUrl && (
							<button
								className="rounded-sm px-3 py-1.5 font-sans font-semibold text-red-700 text-xs hover:bg-red-50 disabled:opacity-50"
								disabled={busy}
								onClick={() => setCoverImageUrl(null)}
								type="button"
							>
								Remove photo
							</button>
						)}
					</div>
				</div>
				<p className="font-sans text-[12px] text-text-muted leading-relaxed">
					When set, this photo is the hero on the public article and on listing
					cards. You can still pick a gradient accent for places without the
					photo.
				</p>
				<div className="relative h-40 w-full max-w-md overflow-hidden rounded-sm border border-cream-dark">
					{coverImageUrl ? (
						<Image
							alt="Cover preview"
							className="object-cover"
							fill
							sizes="(max-width: 768px) 100vw, 448px"
							src={coverImageUrl}
						/>
					) : (
						<div
							className="h-full w-full"
							style={{ background: coverGradient }}
						/>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<span className="font-sans font-semibold text-text-muted text-xs uppercase tracking-wide">
					Cover gradient
				</span>
				<div className="flex flex-wrap gap-2">
					{ARTICLE_COVER_PRESETS.map((p) => (
						<button
							aria-label={p.label}
							className={`h-10 w-16 rounded-sm border-2 transition-all ${
								coverGradient === p.value
									? "border-forest-dark ring-2 ring-forest-dark/20"
									: "border-cream-dark"
							}`}
							key={p.id}
							onClick={() => setCoverGradient(p.value)}
							style={{ background: p.value }}
							title={p.label}
							type="button"
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
					<label
						className="font-sans font-semibold text-text-muted text-xs uppercase tracking-wide"
						htmlFor="article-body"
					>
						Body (Markdown)
					</label>
					<div className="flex flex-wrap gap-2">
						<div className="inline-flex overflow-hidden rounded-sm border border-cream-dark bg-white">
							<button
								className={`px-3 py-1.5 font-sans font-semibold text-xs ${
									editorView === "write"
										? "bg-ink text-white"
										: "hover:bg-cream"
								}`}
								onClick={() => setEditorView("write")}
								type="button"
							>
								Write
							</button>
							<button
								className={`border-cream-dark border-x px-3 py-1.5 font-sans font-semibold text-xs ${
									editorView === "split"
										? "bg-ink text-white"
										: "hover:bg-cream"
								}`}
								onClick={() => setEditorView("split")}
								type="button"
							>
								Split
							</button>
							<button
								className={`px-3 py-1.5 font-sans font-semibold text-xs ${
									editorView === "preview"
										? "bg-ink text-white"
										: "hover:bg-cream"
								}`}
								onClick={() => setEditorView("preview")}
								type="button"
							>
								Preview
							</button>
						</div>
						<input
							accept="image/jpeg,image/png,image/webp"
							className="hidden"
							onChange={(e) =>
								void onInlineImageFile(e.target.files?.[0] ?? null)
							}
							ref={inlineImageInputRef}
							type="file"
						/>
						<button
							className="rounded-sm border border-cream-dark bg-paper px-3 py-1.5 font-sans font-semibold text-xs hover:bg-cream disabled:opacity-50"
							disabled={busy || uploadingInline}
							onClick={() => inlineImageInputRef.current?.click()}
							type="button"
						>
							{uploadingInline ? "Uploading…" : "Insert image"}
						</button>
						<button
							className="rounded-sm border border-cream-dark bg-paper px-3 py-1.5 font-sans font-semibold text-xs hover:bg-cream disabled:opacity-50"
							disabled={busy}
							onClick={() => insertSnippet("\n\n## Section title\n\n")}
							type="button"
						>
							Insert heading
						</button>
					</div>
				</div>
				<div className="flex items-center justify-between rounded-sm border border-cream-dark/70 bg-paper/80 px-3 py-2">
					<div className="font-sans text-[12px] text-text-muted">
						<p>
							{readingMeta.words} words · {readingMeta.minutes} min read
						</p>
						{lastAutosaveAt ? (
							<p className="text-[11px]">
								Autosaved {new Date(lastAutosaveAt).toLocaleTimeString()}
							</p>
						) : null}
					</div>
					<div className="flex flex-wrap gap-1">
						{MARKDOWN_SNIPPETS.map((item) => (
							<button
								className="rounded-sm border border-cream-dark bg-white px-2.5 py-1 font-sans font-semibold text-[11px] hover:bg-cream disabled:opacity-50"
								disabled={busy}
								key={item.label}
								onClick={() => insertSnippet(item.snippet)}
								type="button"
							>
								{item.label}
							</button>
						))}
					</div>
				</div>
				<div
					className={`grid gap-4 ${
						editorView === "split" ? "lg:grid-cols-2" : "grid-cols-1"
					}`}
				>
					{editorView !== "preview" && (
						<textarea
							className="min-h-[360px] resize-y rounded-sm border border-cream-dark bg-white px-3 py-2 font-mono text-[13px] leading-relaxed"
							id="article-body"
							onChange={(e) => setBody(e.target.value)}
							ref={bodyRef}
							required
							rows={20}
							value={body}
						/>
					)}
					{editorView !== "write" && (
						<div className="min-h-[360px] rounded-sm border border-cream-dark bg-white p-4">
							<p className="mb-3 font-bold font-sans text-[11px] text-text-muted uppercase tracking-wide">
								Live preview
							</p>
							{body.trim().length > 0 ? (
								<ArticleMarkdown markdown={body} />
							) : (
								<p className="font-sans text-sm text-text-muted">
									Start writing markdown to preview your article here.
								</p>
							)}
						</div>
					)}
				</div>
				<details className="font-sans text-[12px] text-text-muted">
					<summary className="cursor-pointer font-semibold text-text-dark">
						Markdown tips
					</summary>
					<ul className="mt-2 list-disc space-y-1 pl-5">
						<li>
							<code className="rounded bg-cream px-1">**bold**</code>,{" "}
							<code className="rounded bg-cream px-1">*italic*</code>
						</li>
						<li>Headings: lines starting with ## or ###</li>
						<li>Bullets: lines starting with - or *</li>
						<li>Links: [label](https://…)</li>
						<li>
							Images: ![description](https://…) — use Insert image to upload
						</li>
						<li>
							Tables: use | columns | with a separator row (see GitHub-flavored
							Markdown)
						</li>
					</ul>
				</details>
			</div>

			<div className="flex max-w-xs flex-col gap-1.5">
				<label
					className="font-sans font-semibold text-text-muted text-xs uppercase tracking-wide"
					htmlFor="article-visibility"
				>
					Visibility
				</label>
				<select
					className="rounded-sm border border-cream-dark bg-white px-3 py-2 font-sans text-sm"
					id="article-visibility"
					onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
					value={status}
				>
					<option value="DRAFT">Draft — not on the public site</option>
					<option value="PUBLISHED">
						Published — visible on nevali home and journal
					</option>
				</select>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<button
					className="rounded-sm bg-forest-dark px-5 py-2.5 font-sans font-semibold text-sm text-white disabled:opacity-60"
					disabled={busy}
					type="submit"
				>
					{props.mode === "create" ? "Create article" : "Save changes"}
				</button>
				{props.mode === "edit" && (
					<button
						className="rounded-sm border border-red-300 px-5 py-2.5 font-sans font-semibold text-red-700 text-sm hover:bg-red-50 disabled:opacity-60"
						disabled={busy}
						onClick={onDelete}
						type="button"
					>
						Delete
					</button>
				)}
			</div>
		</form>
	);
}
