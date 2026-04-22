"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { RfqRow } from "~/app/api/contracts";
import { markRfqThreadNotificationsReadAction } from "~/app/api/notifications/actions";
import { unreadNotificationsQueryKey } from "~/features/notifications/use-unread-notification-count";
import { FlashToast } from "~/components/flash-toast";
import {
	useMyActiveContracts,
	useMyCompletedContracts,
	useMyRfqs,
} from "../../hooks/use-contracts";
import { useArtisanDashboardStats } from "../../hooks/use-dashboard-stats";
import {
	useCreateContractFromRfqProducer,
	useSubmitProducerRfqQuote,
	useTransitionProducerRfq,
	useUpdateProducerRfqQuote,
} from "../../hooks/use-producer-rfq-mutations";
import { ContractHistoryTable } from "./contract-history-table";
import { ContractList } from "./contract-list";
import { CONTRACTS_TABS, type ContractsTab } from "./contracts-constants";
import {
	mapContractToDisplay,
	mapContractToHistoryDisplay,
} from "./contracts-mappers";
import { ContractsStatsCards } from "./contracts-stats-cards";
import { ContractsTabList } from "./contracts-tab-list";
import type { ContractsCounts } from "./contracts-types";
import { RfqList } from "./rfq-list";
import { RfqQuoteModal } from "./rfq-quote-modal";

function deadlineToDateInputValue(d: Date | null | undefined): string {
	if (!d) return "";
	const x = new Date(d);
	const y = x.getFullYear();
	const m = String(x.getMonth() + 1).padStart(2, "0");
	const day = String(x.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

type QuoteModalState =
	| { open: false }
	| {
			open: true;
			rfqId: string;
			mode: "new" | "edit";
			initialEstimated: string;
			initialDeadlineYmd: string;
	  };

export function ContractsView() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState<ContractsTab>("RFQs");
	const [expandedRfqId, setExpandedRfqId] = useState<string | null>(null);
	const [quoteModal, setQuoteModal] = useState<QuoteModalState>({
		open: false,
	});
	const [flashMessage, setFlashMessage] = useState<string | null>(null);
	const clearFlash = useCallback(() => setFlashMessage(null), []);

	const { data: stats } = useArtisanDashboardStats();
	const { data: rfqList = [], isLoading: rfqsLoading } = useMyRfqs();

	useEffect(() => {
		const thread = searchParams.get("thread");
		if (!thread || rfqsLoading) return;
		if (!rfqList.some((r) => r.id === thread)) return;
		setExpandedRfqId(thread);
		setActiveTab("RFQs");
		void (async () => {
			await markRfqThreadNotificationsReadAction(thread);
			await queryClient.invalidateQueries({
				queryKey: unreadNotificationsQueryKey,
			});
		})();
		router.replace("/artisan/contracts", { scroll: false });
	}, [searchParams, rfqList, router, rfqsLoading, queryClient]);
	const { data: activeContractsList = [], isLoading: contractsLoading } =
		useMyActiveContracts();
	const { data: completedList = [], isLoading: historyLoading } =
		useMyCompletedContracts();

	const submitQuote = useSubmitProducerRfqQuote();
	const updateQuote = useUpdateProducerRfqQuote();
	const transitionRfq = useTransitionProducerRfq();
	const createContractFromRfq = useCreateContractFromRfqProducer();

	const openRfqsCount =
		stats?.openRfqs ??
		rfqList.filter((r) => r.status !== "DECLINED" && r.status !== "CANCELLED")
			.length;
	const pendingReplyCount =
		stats?.pendingReplyCount ??
		rfqList.filter((r) => r.status === "NEW").length;
	const activeCount = stats?.activeContracts ?? activeContractsList.length;
	const revenueYtd = stats?.revenueYtd ?? "€0";

	const counts: ContractsCounts = useMemo(
		() => ({
			RFQs: openRfqsCount,
			Contracts: activeCount,
			History: completedList.length,
		}),
		[openRfqsCount, activeCount, completedList.length],
	);

	const contractsForUi = useMemo(
		() => activeContractsList.map((c, i) => mapContractToDisplay(c, i)),
		[activeContractsList],
	);

	const historyForUi = useMemo(
		() => completedList.map((c, i) => mapContractToHistoryDisplay(c, i)),
		[completedList],
	);

	const openQuoteNew = useCallback((r: RfqRow) => {
		setQuoteModal({
			open: true,
			rfqId: r.id,
			mode: "new",
			initialEstimated: "",
			initialDeadlineYmd: "",
		});
	}, []);

	const openQuoteEdit = useCallback((r: RfqRow) => {
		setQuoteModal({
			open: true,
			rfqId: r.id,
			mode: "edit",
			initialEstimated: r.estimatedValue?.trim() || "",
			initialDeadlineYmd: deadlineToDateInputValue(r.deadlineAt),
		});
	}, []);

	const closeQuoteModal = useCallback(() => setQuoteModal({ open: false }), []);

	const handleNegotiate = useCallback(
		async (r: RfqRow) => {
			const res = await transitionRfq.mutateAsync({
				rfqId: r.id,
				action: "negotiate",
			});
			if (res.error) {
				window.alert(res.error);
			}
		},
		[transitionRfq],
	);

	const handleRespond = useCallback((r: RfqRow) => {
		setExpandedRfqId(r.id);
		setActiveTab("RFQs");
	}, []);

	const handleDecline = useCallback(
		async (r: RfqRow) => {
			if (
				!window.confirm(
					"Decline this inquiry? The buyer will be notified if they used a CraftHouse buyer account.",
				)
			) {
				return;
			}
			const res = await transitionRfq.mutateAsync({
				rfqId: r.id,
				action: "decline",
			});
			if (res.error) window.alert(res.error);
		},
		[transitionRfq],
	);

	const handleCancel = useCallback(
		async (r: RfqRow) => {
			if (
				!window.confirm(
					"Cancel this thread? You can no longer quote or negotiate it.",
				)
			) {
				return;
			}
			const res = await transitionRfq.mutateAsync({
				rfqId: r.id,
				action: "cancel",
			});
			if (res.error) window.alert(res.error);
		},
		[transitionRfq],
	);

	const handleRecordContract = useCallback(
		async (r: RfqRow) => {
			if (
				!window.confirm(
					"Record an active contract from this inquiry? The thread will close and the buyer and your team will be notified.",
				)
			) {
				return;
			}
			const res = await createContractFromRfq.mutateAsync({ rfqId: r.id });
			if (res.error) {
				window.alert(res.error);
				return;
			}
			if (res.contract) {
				setFlashMessage(
					`Contract recorded.\n\nReference: ${res.contract.id}\n\nYou can review it under the Contracts tab.`,
				);
			}
			setExpandedRfqId(null);
			setActiveTab("Contracts");
		},
		[createContractFromRfq],
	);

	const quotePending = submitQuote.isPending || updateQuote.isPending;

	return (
		<div className="flex flex-col gap-4">
			<FlashToast message={flashMessage} onDismiss={clearFlash} />
			<RfqQuoteModal
				initialDeadlineYmd={
					quoteModal.open ? quoteModal.initialDeadlineYmd : ""
				}
				initialEstimatedValue={
					quoteModal.open ? quoteModal.initialEstimated : ""
				}
				isPending={quotePending}
				onClose={closeQuoteModal}
				onSave={async (input) => {
					if (!quoteModal.open) return { error: "Invalid state" };
					if (quoteModal.mode === "new") {
						return submitQuote.mutateAsync(input);
					}
					return updateQuote.mutateAsync(input);
				}}
				open={quoteModal.open}
				rfqId={quoteModal.open ? quoteModal.rfqId : null}
				title={
					quoteModal.open && quoteModal.mode === "edit"
						? "Edit quote"
						: "Send quote"
				}
			/>

			<ContractsStatsCards
				activeContracts={counts.Contracts}
				completedCount={counts.History}
				openRfqs={counts.RFQs}
				pendingReplyCount={pendingReplyCount}
				revenueYtd={revenueYtd}
			/>
			<ContractsTabList
				activeTab={activeTab}
				counts={counts}
				onTabChange={setActiveTab}
			/>
			{activeTab === CONTRACTS_TABS[0] && (
				<RfqList
					expandedId={expandedRfqId}
					isLoading={rfqsLoading}
					onCancel={handleCancel}
					onDecline={handleDecline}
					onEditQuote={openQuoteEdit}
					onNegotiate={handleNegotiate}
					onQuote={openQuoteNew}
					onRecordContract={handleRecordContract}
					onRespond={handleRespond}
					onToggleExpand={(id) => setExpandedRfqId(id || null)}
					rfqs={rfqList}
				/>
			)}
			{activeTab === CONTRACTS_TABS[1] && (
				<ContractList contracts={contractsForUi} isLoading={contractsLoading} />
			)}
			{activeTab === CONTRACTS_TABS[2] && (
				<ContractHistoryTable isLoading={historyLoading} rows={historyForUi} />
			)}
		</div>
	);
}
