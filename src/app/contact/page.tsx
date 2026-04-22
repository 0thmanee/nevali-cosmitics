import Link from "next/link";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { env } from "~/env";

const DEFAULT_CONTACT_EMAIL = "hello@crafthouse.ma";

export const metadata = {
	title: "Contact — CraftHouse",
	description:
		"Reach the CraftHouse team for partnerships, press, and platform support.",
};

export default function ContactPage() {
	const contactEmail = env.CONTACT_PUBLIC_EMAIL ?? DEFAULT_CONTACT_EMAIL;
	const mailto = `mailto:${contactEmail}`;

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream">
			<Navbar />
			<div className="pt-[56px]" />

			<section className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
				<div className="flex flex-col gap-3">
					<span className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.2em]">
						Contact
					</span>
					<h1 className="font-bold font-display text-3xl text-text-dark uppercase tracking-wide md:text-4xl">
						Talk to CraftHouse
					</h1>
					<p className="font-sans text-[15px] text-text-muted leading-relaxed">
						We help artisans list certified products and connect with serious
						buyers. For onboarding, technical issues, or press enquiries, use
						the channel below that fits best.
					</p>
				</div>

				<div className="flex flex-col gap-6 rounded-2xl border border-cream-dark bg-white p-8">
					<div>
						<h2 className="mb-1 font-sans font-semibold text-sm text-text-dark">
							Artisan &amp; partner support
						</h2>
						<p className="mb-2 font-sans text-sm text-text-muted">
							Signed-in partners can open tickets from the dashboard for faster
							routing.
						</p>
						<Link
							className="font-medium font-sans text-forest-light text-sm hover:underline"
							href="/auth/login?callbackUrl=%2Fartisan%2Fsupport"
						>
							Sign in → Support
						</Link>
					</div>

					<div className="h-px bg-cream-dark" />

					<div>
						<h2 className="mb-1 font-sans font-semibold text-sm text-text-dark">
							General enquiries
						</h2>
						<a
							className="font-medium font-sans text-forest-light text-sm hover:underline"
							href={mailto}
						>
							{contactEmail}
						</a>
						<p className="mt-2 font-sans text-text-muted text-xs">
							{env.CONTACT_PUBLIC_EMAIL
								? "This address is configured via CONTACT_PUBLIC_EMAIL in your environment."
								: "Set CONTACT_PUBLIC_EMAIL in .env for production; until then the default above is shown."}
						</p>
					</div>
				</div>

				<Link
					className="w-fit font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
					href="/"
				>
					← Back to home
				</Link>
			</section>

			<section
				className="mx-auto flex max-w-2xl flex-col gap-4 border-cream-dark border-t px-6 py-12"
				id="privacy"
			>
				<h2 className="font-bold font-display text-lg text-text-dark uppercase tracking-wide">
					Privacy information
				</h2>
				{env.LEGAL_POLICY_EFFECTIVE_DATE ? (
					<p className="mb-1 font-sans text-text-muted text-xs leading-relaxed">
						Optional operator label from{" "}
						<code className="font-mono text-[11px]">LEGAL_POLICY_EFFECTIVE_DATE</code>
						: {env.LEGAL_POLICY_EFFECTIVE_DATE}. This is for your own versioning
						notes only; it does not make this page a binding or counsel-reviewed
						privacy policy.
					</p>
				) : null}
				<p className="font-sans text-sm text-text-muted leading-relaxed">
					This section describes how CraftHouse handles personal data in plain
					language. It is <strong>not</strong> a substitute for a
					jurisdiction-specific privacy policy reviewed by your counsel. Before
					you rely on it for compliance (GDPR, CCPA, Morocco Law 09-08, etc.),
					have qualified legal advisors adapt it to your processing activities,
					retention periods, and subprocessors.
				</p>
				<div className="flex flex-col gap-3 font-sans text-sm text-text-muted leading-relaxed">
					<div>
						<h3 className="mb-1 font-semibold text-text-dark">
							What we collect
						</h3>
						<p>
							Account identifiers (name, email), authentication data managed by
							our auth provider, profile and organization details you submit as
							a partner, buyer inquiry content (product interest, quantities,
							messages), support ticket text, training progress metadata, and
							technical logs needed to secure the service (IP address, device
							type, timestamps).
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-text-dark">Why we use it</h3>
						<p>
							To create and maintain accounts, match buyers with artisans,
							deliver transactional emails you request, operate RFQ and contract
							workflows, improve reliability, respond to legal requests, and
							detect abuse. Marketing uses, if any, will be based on consent
							where required.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-text-dark">
							Sharing &amp; hosting
						</h3>
						<p>
							We use infrastructure and email providers you configure in
							production (for example database hosting, object storage for
							uploads, and transactional mail). Those providers process data on
							our instructions. We do not sell personal data.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-text-dark">
							Retention &amp; your choices
						</h3>
						<p>
							We retain data while the account is active and for a limited
							period afterwards for legal, security, and dispute-resolution
							purposes. You may request access, correction, or deletion where
							applicable by contacting us; some records must be kept to meet
							accounting or regulatory obligations.
						</p>
					</div>
				</div>
			</section>

			<section
				className="mx-auto flex max-w-2xl flex-col gap-4 px-6 pb-20"
				id="terms"
			>
				<h2 className="font-bold font-display text-lg text-text-dark uppercase tracking-wide">
					Terms of use (summary)
				</h2>
				{env.LEGAL_POLICY_EFFECTIVE_DATE ? (
					<p className="mb-1 font-sans text-text-muted text-xs leading-relaxed">
						Same optional display date as under Privacy (
						{env.LEGAL_POLICY_EFFECTIVE_DATE}); still not a substitute for
						executed terms with counsel.
					</p>
				) : null}
				<p className="font-sans text-sm text-text-muted leading-relaxed">
					By using CraftHouse you agree to follow these rules in addition to any
					separate agreement you sign with us. This summary is{" "}
					<strong>not</strong> a binding contract; publish counsel-approved
					terms for partners, buyers, and visitors before commercial launch.
				</p>
				<div className="flex flex-col gap-3 font-sans text-sm text-text-muted leading-relaxed">
					<div>
						<h3 className="mb-1 font-semibold text-text-dark">
							Accounts &amp; eligibility
						</h3>
						<p>
							You must provide accurate information. Partner accounts may
							require approval. You are responsible for safeguarding credentials
							and for activity under your account.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-text-dark">
							Marketplace conduct
						</h3>
						<p>
							Users must negotiate in good faith, avoid fraudulent listings or
							inquiries, and comply with export and sanctions laws applicable to
							their trade. CraftHouse may suspend access for violations or risk
							to other users.
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-text-dark">
							Content &amp; intellectual property
						</h3>
						<p>
							You retain rights to content you upload. You grant CraftHouse a
							licence to host, display, and distribute that content as needed to
							operate the platform (for example showing product pages to
							buyers).
						</p>
					</div>
					<div>
						<h3 className="mb-1 font-semibold text-text-dark">
							Disclaimers &amp; liability
						</h3>
						<p>
							The platform is provided on an “as is” basis to the extent
							permitted by law. CraftHouse is not a party to contracts between
							buyers and artisans unless explicitly stated otherwise; users are
							responsible for their own commercial terms, inspections, and
							compliance.
						</p>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
