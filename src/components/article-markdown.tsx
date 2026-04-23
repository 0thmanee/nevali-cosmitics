import Link from "next/link";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const articleComponents: Components = {
	h1: ({ children }) => (
		<h1 className="mt-10 mb-4 font-bold font-display text-2xl text-text-dark uppercase tracking-wide first:mt-0">
			{children}
		</h1>
	),
	h2: ({ children }) => (
		<h2 className="mt-10 mb-3 border-cream-dark border-b pb-2 font-bold font-serif text-text-dark text-xl">
			{children}
		</h2>
	),
	h3: ({ children }) => (
		<h3 className="mt-8 mb-2 font-bold font-serif text-lg text-text-dark">
			{children}
		</h3>
	),
	h4: ({ children }) => (
		<h4 className="mt-6 mb-2 font-bold font-sans text-base text-text-dark">
			{children}
		</h4>
	),
	p: ({ children }) => (
		<p className="font-sans text-[1.05rem] text-text-dark leading-[1.78]">
			{children}
		</p>
	),
	ul: ({ children }) => (
		<ul className="my-4 list-disc space-y-2 pl-6 font-sans text-[1.05rem] text-text-dark leading-relaxed marker:text-forest-light">
			{children}
		</ul>
	),
	ol: ({ children }) => (
		<ol className="my-4 list-decimal space-y-2 pl-6 font-sans text-[1.05rem] text-text-dark leading-relaxed marker:font-semibold">
			{children}
		</ol>
	),
	li: ({ children }) => <li className="pl-1">{children}</li>,
	blockquote: ({ children }) => (
		<blockquote className="my-6 border-forest-light border-l-[3px] bg-paper/80 py-3 pr-4 pl-5 font-sans text-[1.02rem] text-text-muted italic leading-relaxed">
			{children}
		</blockquote>
	),
	a: ({ href, children }) => {
		if (href?.startsWith("/")) {
			return (
				<Link
					className="font-semibold text-forest-dark underline underline-offset-[3px] hover:text-text-dark"
					href={href}
				>
					{children}
				</Link>
			);
		}
		return (
			<a
				className="wrap-break-word font-semibold text-forest-dark underline underline-offset-[3px] hover:text-text-dark"
				href={href}
				rel="noopener noreferrer"
				target="_blank"
			>
				{children}
			</a>
		);
	},
	strong: ({ children }) => (
		<strong className="font-bold text-text-dark">{children}</strong>
	),
	em: ({ children }) => <em className="text-text-muted italic">{children}</em>,
	hr: () => <hr className="my-10 border-0 border-cream-dark border-t" />,
	code: ({ className, children, ...props }) => {
		const isBlock = className?.includes("language-");
		if (isBlock) {
			return (
				<code className={`${className ?? ""} font-mono text-[13px]`} {...props}>
					{children}
				</code>
			);
		}
		return (
			<code
				className="rounded bg-cream-dark/60 px-1.5 py-0.5 font-mono text-[0.9em] text-text-dark"
				{...props}
			>
				{children}
			</code>
		);
	},
	pre: ({ children }) => (
		<pre className="my-6 overflow-x-auto rounded-sm border border-cream-dark bg-paper p-4 font-mono text-[13px] text-text-dark leading-relaxed shadow-sm">
			{children}
		</pre>
	),
	img: ({ src, alt }) =>
		src ? (
			// biome-ignore lint/performance/noImgElement: Markdown embeds arbitrary producer image URLs.
			<img
				alt={alt ?? ""}
				className="my-8 max-h-[560px] w-full rounded-sm border border-cream-dark bg-paper object-contain"
				decoding="async"
				loading="lazy"
				src={src}
			/>
		) : null,
	table: ({ children }) => (
		<div className="my-8 overflow-x-auto rounded-sm border border-cream-dark bg-white shadow-sm">
			<table className="min-w-full border-collapse text-left text-sm">
				{children}
			</table>
		</div>
	),
	thead: ({ children }) => (
		<thead className="bg-cream/80 font-sans text-text-muted text-xs uppercase tracking-wide">
			{children}
		</thead>
	),
	th: ({ children }) => (
		<th className="border-cream-dark border-b px-4 py-3 font-semibold text-text-dark">
			{children}
		</th>
	),
	td: ({ children }) => (
		<td className="border-cream-dark border-b px-4 py-3 text-text-dark">
			{children}
		</td>
	),
};

export function ArticleMarkdown({ markdown }: { markdown: string }) {
	return (
		<div className="article-md">
			<ReactMarkdown components={articleComponents} remarkPlugins={[remarkGfm]}>
				{markdown}
			</ReactMarkdown>
		</div>
	);
}
