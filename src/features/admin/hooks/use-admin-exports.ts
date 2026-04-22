"use client";

import { useMutation } from "@tanstack/react-query";
import {
	exportAdminContractsCsv,
	exportAdminRfqsCsv,
} from "~/app/api/admin/actions";

function downloadTextFile(filename: string, content: string, mime: string) {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export function useExportAdminRfqsCsv() {
	return useMutation({
		mutationFn: (organizationId?: string | null) =>
			exportAdminRfqsCsv(organizationId),
		onSuccess: ({ filename, csv }) => {
			downloadTextFile(filename, csv, "text/csv;charset=utf-8");
		},
	});
}

export function useExportAdminContractsCsv() {
	return useMutation({
		mutationFn: (organizationId?: string | null) =>
			exportAdminContractsCsv(organizationId),
		onSuccess: ({ filename, csv }) => {
			downloadTextFile(filename, csv, "text/csv;charset=utf-8");
		},
	});
}
