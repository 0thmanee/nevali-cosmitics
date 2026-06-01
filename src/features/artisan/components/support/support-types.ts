/**
 * Display types for support UI (mapped from API rows).
 */

export type TicketDisplay = {
	id: string;
	subject: string;
	category: string;
	status: string;
	priority: string;
	created: string;
	lastReply: string;
	messages: number;
};

export type SupportFormState = {
	subject: string;
	category: string;
	priority: string;
	message: string;
};
