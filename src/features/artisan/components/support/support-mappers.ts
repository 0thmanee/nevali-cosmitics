/**
 * Map API rows to display types for support UI.
 */

import type { SupportTicketRow } from "~/app/api/support/schemas/support.schema";
import { formatRelative } from "../../utils/format";
import type { TicketDisplay } from "./support-types";

export function mapTicketToDisplay(t: SupportTicketRow): TicketDisplay {
	return {
		id: t.id,
		subject: t.subject,
		category: t.category,
		status: t.status,
		priority: t.priority,
		created: formatRelative(t.createdAt),
		lastReply: formatRelative(t.updatedAt),
		messages: 1, // initial message only for now; add reply count when messages table exists
	};
}
