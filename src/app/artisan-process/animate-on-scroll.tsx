"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right";

type Props = {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	direction?: Direction;
	/** When true, also animates scale from 0.97 → 1 (subtle depth). */
	scale?: boolean;
	durationMs?: number;
	distancePx?: number;
	threshold?: number;
};

function translateHidden(direction: Direction, distancePx: number): string {
	switch (direction) {
		case "left":
			return `translate3d(-${distancePx}px, 0, 0)`;
		case "right":
			return `translate3d(${distancePx}px, 0, 0)`;
		case "down":
			return `translate3d(0, -${distancePx}px, 0)`;
		default:
			return `translate3d(0, ${distancePx}px, 0)`;
	}
}

export function AnimateOnScroll({
	children,
	className = "",
	delay = 0,
	direction = "up",
	scale = false,
	durationMs = 700,
	distancePx = 36,
	threshold = 0.12,
}: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		if (
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			setVisible(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return;
				setVisible(true);
				observer.disconnect();
			},
			{ threshold },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [threshold]);

	const transform = scale
		? visible
			? "translate3d(0,0,0) scale(1)"
			: `${translateHidden(direction, distancePx)} scale(0.97)`
		: visible
			? "translate3d(0,0,0)"
			: translateHidden(direction, distancePx);

	return (
		<div
			className={className}
			ref={ref}
			style={{
				opacity: visible ? 1 : 0,
				transform,
				transition: `opacity ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
				willChange: visible ? "auto" : "opacity, transform",
			}}
		>
			{children}
		</div>
	);
}
