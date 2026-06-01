"use client";

import React, { useState } from "react";
import type { ProductImageItem } from "~/app/api/products/schemas/products.schema";

const cardStyle = {
	background: "white",
	border: "1px solid var(--color-cream-dark)",
} as const;

type Props = {
	images: ProductImageItem[];
	alt?: string;
};

export function ProductGallery({ images, alt = "Product" }: Props) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const main = images[selectedIndex] ?? images[0];

	if (images.length === 0) {
		return (
			<div
				className="flex flex-col items-center justify-center gap-3 overflow-hidden rounded-sm py-16"
				style={cardStyle}
			>
				<div
					className="flex h-24 w-24 items-center justify-center rounded-sm"
					style={{
						background: "var(--color-paper)",
						border: "1px solid var(--color-cream-dark)",
					}}
				>
					<svg
						className="text-text-muted/50"
						fill="none"
						height="40"
						viewBox="0 0 40 40"
						width="40"
					>
						<rect
							height="22"
							rx="2"
							stroke="currentColor"
							strokeWidth="1.5"
							width="28"
							x="6"
							y="8"
						/>
						<circle
							cx="14"
							cy="16"
							r="4"
							stroke="currentColor"
							strokeWidth="1.5"
						/>
						<path
							d="M6 26l8-6 6 4 10-8 4 4v6H6v-0z"
							stroke="currentColor"
							strokeLinejoin="round"
							strokeWidth="1.5"
						/>
					</svg>
				</div>
				<p className="font-sans text-sm text-text-muted">No images yet</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
			<div className="border-cream-dark border-b px-6 py-4">
				<h2 className="font-bold font-serif text-[15px] text-text-dark">
					Gallery
				</h2>
			</div>
			<div className="flex flex-col gap-4 p-6">
				{/* Thumbnails */}
				{images.length > 1 && (
					<div className="flex flex-wrap gap-2">
						{images.map((img, i) => (
							<button
								className="h-48 w-auto shrink-0 overflow-hidden rounded-sm transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/30"
								key={img.id}
								onClick={() => setSelectedIndex(i)}
								style={{
									border:
										selectedIndex === i
											? "2px solid var(--color-ink)"
											: "1px solid var(--color-cream-dark)",
									opacity: selectedIndex === i ? 1 : 0.85,
								}}
								type="button"
							>
								<img
									alt=""
									className="h-full w-full object-cover"
									src={img.url}
								/>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
