import { SupportTicketDetail } from "~/features/admin/components/support/support-ticket-detail";

type Props = { params: Promise<{ ticketId: string }> };

export default async function AdminSupportTicketPage({ params }: Props) {
  const { ticketId } = await params;
  return <SupportTicketDetail ticketId={ticketId} />;
}
