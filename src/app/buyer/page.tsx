import Link from "next/link";
import { env } from "~/env";
import { PLATFORM_OWNED_ORG_SLUG, SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

const DEFAULT_CONTACT_EMAIL = "hello@nevali-cosmetics.ma";

export default function BuyerHomePage() {
	const contactEmail = env.CONTACT_PUBLIC_EMAIL ?? DEFAULT_CONTACT_EMAIL;
	return (
		<div className="max-w-2xl space-y-6">
			<p className="font-sans text-sm text-text-muted leading-relaxed">
				Welcome to nevali. Anyone can shop the catalog and check out as a guest—no account
				needed. If you do sign in as a buyer, orders placed with the same email as on checkout
				show under{" "}
				<Link
					className="font-medium text-forest-mid hover:underline"
					href="/buyer/orders"
				>
					My orders
				</Link>
				. Save products into{" "}
				<Link
					className="font-medium text-forest-mid hover:underline"
					href="/buyer/saved"
				>
					named lists
				</Link>{" "}
				to compare or shortlist.
			</p>
			<div className="flex flex-wrap gap-3">
				<Link
					className="rounded-sm bg-forest-mid px-5 py-2.5 font-medium font-sans text-sm text-white transition-opacity hover:opacity-90"
					href="/products"
				>
					Browse products
				</Link>
				<Link
					className="rounded-sm border border-cream-dark px-5 py-2.5 font-medium font-sans text-sm text-text-dark transition-colors hover:bg-cream"
					href={
						SHOW_MULTI_PRODUCER_EXPERIENCE ? "/artisans" : `/artisans/${PLATFORM_OWNED_ORG_SLUG}`
					}
				>
					{SHOW_MULTI_PRODUCER_EXPERIENCE ? "Our brands" : "Our brand"}
				</Link>
			</div>

			<div className="rounded-sm border border-cream-dark bg-white p-5">
				<h2 className="font-bold font-serif text-text-dark">Buying teams &amp; organizations</h2>
				<p className="mt-2 font-sans text-sm text-text-muted leading-relaxed">
					Shared buyer workspaces (multiple colleagues on one account, approvals, and procurement
					roles) are not enabled in the self-serve portal yet. If you represent a retailer,
					distributor, or hotel group and need a team setup, contact us and we will onboard you
					manually.
				</p>
				<a
					className="mt-3 inline-block font-sans font-semibold text-forest-mid text-sm hover:underline"
					href={`mailto:${contactEmail}?subject=nevali%20buyer%20team%20access`}
				>
					Email {contactEmail}
				</a>
			</div>
		</div>
	);
}
