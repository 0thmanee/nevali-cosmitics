/**
 * Constants for support UI: tabs, categories, priorities, FAQ, styles.
 */

export const SUPPORT_TABS = ["My Tickets", "New Ticket", "FAQ"] as const;
export type SupportTab = (typeof SUPPORT_TABS)[number];
export const SUPPORT_TAB_LABEL_KEY: Record<SupportTab, string> = {
	"My Tickets": "support.tabs.myTickets",
	"New Ticket": "support.tabs.newTicket",
	FAQ: "support.tabs.faq",
};

export const SUPPORT_CATEGORIES = [
	"Certification",
	"Products",
	"Account",
	"Export",
	"Payments",
	"Technical",
	"Other",
] as const;
export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];
export const SUPPORT_CATEGORY_LABEL_KEY: Record<SupportCategory, string> = {
	Certification: "support.categories.certification",
	Products: "support.categories.products",
	Account: "support.categories.account",
	Export: "support.categories.export",
	Payments: "support.categories.payments",
	Technical: "support.categories.technical",
	Other: "support.categories.other",
};

export const SUPPORT_PRIORITIES = ["Low", "Medium", "High"] as const;
export type SupportPriority = (typeof SUPPORT_PRIORITIES)[number];
export const SUPPORT_PRIORITY_LABEL_KEY: Record<SupportPriority, string> = {
	Low: "support.priorityValues.low",
	Medium: "support.priorityValues.medium",
	High: "support.priorityValues.high",
};

export const SUPPORT_FAQ: ReadonlyArray<{ q: string; a: string }> = [
	{
		q: "How long does product approval take after submission?",
		a: "Product listings are typically reviewed within 3-5 business days. If additional documentation is requested, the review clock restarts once you resubmit. You'll receive a notification at each stage.",
	},
	{
		q: "What documents are required for GMP certification?",
		a: "GMP documentation includes your production facility's Standard Operating Procedures (SOPs), hygiene records, equipment maintenance logs, and batch testing reports. Templates are available in the Training section.",
	},
	{
		q: "Can I list products from multiple cooperatives?",
		a: "Each account is tied to one registered cooperative. If you manage multiple cooperatives, you'll need a separate nevali partner account for each entity.",
	},
	{
		q: "How do I see sales from the public catalog?",
		a: "Open Catalog orders under your portal. You will see aggregated units and revenue per approved product from checkout (no buyer personal data). Fulfillment is coordinated using the contact details sent to your organization email.",
	},
	{
		q: "What happens if my certification expires?",
		a: "30 days before expiry you'll receive reminders to begin the renewal process. If certification lapses, your listings are hidden from buyers until renewal is complete. No data is lost.",
	},
];

export const TICKET_STATUS_STYLE = {
	OPEN: {
		background: "color-mix(in srgb, var(--color-info) 12%, transparent)",
		color: "var(--color-info)",
		border: "1px solid color-mix(in srgb, var(--color-info) 25%, transparent)",
		label: "Open",
	},
	IN_REVIEW: {
		background: "color-mix(in srgb, var(--color-gold) 15%, transparent)",
		color: "var(--color-gold)",
		border: "1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
		label: "In Review",
	},
	RESOLVED: {
		background: "color-mix(in srgb, var(--color-gold) 12%, transparent)",
		color: "var(--color-text-muted)",
		border: "1px solid color-mix(in srgb, var(--color-gold) 25%, transparent)",
		label: "Resolved",
	},
} as const;
export const TICKET_STATUS_LABEL_KEY: Record<
	keyof typeof TICKET_STATUS_STYLE,
	string
> = {
	OPEN: "support.status.open",
	IN_REVIEW: "support.status.inReview",
	RESOLVED: "support.status.resolved",
};

export type TicketStatusStyle =
	(typeof TICKET_STATUS_STYLE)[keyof typeof TICKET_STATUS_STYLE];

/** Resolved style for any API status string — defaults to OPEN. */
export function getTicketStatusStyle(status: string): TicketStatusStyle {
	if (status in TICKET_STATUS_STYLE) {
		return TICKET_STATUS_STYLE[status as keyof typeof TICKET_STATUS_STYLE];
	}
	return TICKET_STATUS_STYLE.OPEN;
}

export const TICKET_PRIORITY_STYLE: Record<string, { color: string }> = {
	HIGH: { color: "var(--color-danger)" },
	MEDIUM: { color: "var(--color-gold)" },
	LOW: { color: "var(--color-text-muted)" },
};
