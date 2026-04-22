/** Public URLs from `rfqMessageAttachments` uploads include this path segment + uploader id. */
export function isRfqMessageAttachmentUrlForUser(
	userId: string,
	url: string,
): boolean {
	const needle = `/rfq-message-attachments/${userId}/`;
	try {
		const u = new URL(url.trim());
		return u.protocol === "https:" && u.pathname.includes(needle);
	} catch {
		return false;
	}
}
