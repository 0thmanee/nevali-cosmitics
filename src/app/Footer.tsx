import Link from "next/link";

const LINKS = {
	Platform: [
		{ label: "Browse Artisans", href: "/artisans" },
		{ label: "Browse Products", href: "/products" },
		{ label: "Become an Artisan", href: "/auth/register" },
	],
	Company: [
		{ label: "About CraftHouse", href: "/#about" },
		{ label: "Our Mission", href: "/#mission" },
		{ label: "Contact", href: "/contact" },
	],
	Resources: [
		{ label: "Training & readiness", href: "/training" },
		{ label: "Quality Standards", href: "/products" },
		{ label: "Partner Program", href: "/auth/register" },
	],
};

const SOCIAL = [
	{ label: "Instagram", href: "https://www.instagram.com", icon: "IG" },
	{ label: "LinkedIn", href: "https://www.linkedin.com", icon: "LI" },
	{ label: "Facebook", href: "https://www.facebook.com", icon: "FB" },
];

export default function Footer() {
	return (
		<footer style={{ background: "#1a0500" }}>
			{/* Main grid */}
			<div className="mx-auto max-w-7xl px-6 pt-16 pb-12">
				<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand column */}
					<div className="flex flex-col gap-5">
						<Link className="flex flex-col gap-1" href="/">
							<span
								className="font-bold font-display uppercase leading-none"
								style={{
									fontSize: "22px",
									letterSpacing: "0.08em",
									color: "#FAF5EE",
								}}
							>
								CraftHouse
							</span>
							<span
								className="font-sans text-xs uppercase tracking-[0.2em]"
								style={{ color: "#C87020" }}
							>
								From artisan hands to markets
							</span>
						</Link>
						<p
							className="font-sans text-xs leading-relaxed"
							style={{ color: "rgba(250,245,238,0.5)", maxWidth: "200px" }}
						>
							Connecting Morocco&apos;s finest artisans with buyers who value
							authentic craftsmanship.
						</p>
						{/* Social */}
						<div className="mt-1 flex items-center gap-3">
							{SOCIAL.map((s) => (
								<a
									aria-label={s.label}
									className="border border-[rgba(250,245,238,0.2)] px-2 py-1 font-bold font-sans text-xs text-[rgba(250,245,238,0.6)] uppercase tracking-wider transition-colors duration-200 hover:border-[#C87020] hover:text-[#C87020]"
									href={s.href}
									key={s.label}
									rel="noopener noreferrer"
									target="_blank"
								>
									{s.icon}
								</a>
							))}
						</div>
					</div>

					{/* Link columns */}
					{Object.entries(LINKS).map(([heading, items]) => (
						<div className="flex flex-col gap-4" key={heading}>
							<span
								className="font-sans font-semibold text-xs uppercase tracking-[0.2em]"
								style={{ color: "#C87020" }}
							>
								{heading}
							</span>
							<ul className="flex flex-col gap-2.5">
								{items.map((item) => {
									const external = item.href.startsWith("http");
									return (
										<li key={item.label}>
											{external ? (
												<a
													className="font-sans text-sm text-[rgba(250,245,238,0.55)] transition-colors duration-200 hover:text-[#FAF5EE]"
													href={item.href}
													rel="noopener noreferrer"
													target="_blank"
												>
													{item.label}
												</a>
											) : (
												<Link
													className="font-sans text-sm text-[rgba(250,245,238,0.55)] transition-colors duration-200 hover:text-[#FAF5EE]"
													href={item.href}
												>
													{item.label}
												</Link>
											)}
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</div>
			</div>

			{/* Bottom strip */}
			<div
				className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 border-t px-6 py-4 sm:flex-row sm:items-center"
				style={{ borderColor: "rgba(250,245,238,0.1)" }}
			>
				<span
					className="font-sans text-xs"
					style={{ color: "rgba(250,245,238,0.3)" }}
				>
					© 2027 CraftHouse. All rights reserved. Casablanca, Morocco.
				</span>
				<div className="flex items-center gap-4">
					<Link
						className="font-sans text-xs text-[rgba(250,245,238,0.3)] transition-colors duration-200 hover:text-[rgba(250,245,238,0.6)]"
						href="/contact#privacy"
					>
						Privacy Policy
					</Link>
					<Link
						className="font-sans text-xs text-[rgba(250,245,238,0.3)] transition-colors duration-200 hover:text-[rgba(250,245,238,0.6)]"
						href="/contact#terms"
					>
						Terms of Service
					</Link>
				</div>
			</div>
		</footer>
	);
}
