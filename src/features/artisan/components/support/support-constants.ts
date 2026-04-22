/**
 * Constants for support UI: tabs, categories, priorities, FAQ, styles.
 */

export const SUPPORT_TABS = ["My Tickets", "New Ticket", "FAQ"] as const;
export type SupportTab = (typeof SUPPORT_TABS)[number];

export const SUPPORT_CATEGORIES = [
	"Certification",
	"Products",
	"Account",
	"Export",
	"Payments",
	"Technical",
	"Other",
] as const;

export const SUPPORT_PRIORITIES = ["Low", "Medium", "High"] as const;

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
		background: "rgba(96,165,250,0.12)",
		color: "#60A5FA",
		border: "1px solid rgba(96,165,250,0.25)",
		label: "Open",
	},
	IN_REVIEW: {
		background: "rgba(201,145,61,0.15)",
		color: "#E8B84B",
		border: "1px solid rgba(201,145,61,0.3)",
		label: "In Review",
	},
	RESOLVED: {
		background: "rgba(200,150,60,0.12)",
		color: "#C8963C",
		border: "1px solid rgba(200,150,60,0.25)",
		label: "Resolved",
	},
} as const;

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
	HIGH: { color: "#f87171" },
	MEDIUM: { color: "#E8B84B" },
	LOW: { color: "#7a4d38" },
};
