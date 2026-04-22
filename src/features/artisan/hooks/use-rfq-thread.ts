"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	listRfqMessagesForMyRfq,
	postRfqMessageOnMyRfq,
} from "~/app/api/contracts";
import { markRfqThreadNotificationsReadAction } from "~/app/api/notifications/actions";
import { buyerRfqsQueryKey } from "~/features/buyer/hooks/use-buyer-rfqs";
import { unreadNotificationsQueryKey } from "~/features/notifications/use-unread-notification-count";
import { producerRfqsQueryKey } from "./use-contracts";
import { producerDashboardStatsQueryKey } from "./use-dashboard-stats";

export const rfqMessagesQueryKey = (rfqId: string) =>
	["rfq", rfqId, "messages"] as const;

export function useRfqMessages(rfqId: string | null) {
	return useQuery({
		queryKey: rfqId ? rfqMessagesQueryKey(rfqId) : ["rfq", "none", "messages"],
		queryFn: async () => {
			const id = rfqId;
			if (!id) return { messages: [] };
			return listRfqMessagesForMyRfq(id);
		},
		enabled: !!rfqId,
	});
}

export function usePostRfqMessage() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: postRfqMessageOnMyRfq,
		onSettled: (_data, _err, variables) => {
			void qc.invalidateQueries({
				queryKey: rfqMessagesQueryKey(variables.rfqId),
			});
			void qc.invalidateQueries({ queryKey: producerRfqsQueryKey });
			void qc.invalidateQueries({ queryKey: buyerRfqsQueryKey });
			void qc.invalidateQueries({ queryKey: producerDashboardStatsQueryKey });
			void (async () => {
				await markRfqThreadNotificationsReadAction(variables.rfqId);
				await qc.invalidateQueries({
					queryKey: unreadNotificationsQueryKey,
				});
			})();
		},
	});
}
