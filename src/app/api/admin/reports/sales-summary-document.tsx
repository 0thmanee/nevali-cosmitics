import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { AdminSalesAnalytics } from "~/app/api/admin/actions";

const styles = StyleSheet.create({
	page: { padding: 36, fontSize: 10, fontFamily: "Helvetica" },
	title: { fontSize: 16, marginBottom: 12, fontFamily: "Helvetica-Bold" },
	section: { marginTop: 10, marginBottom: 6 },
	label: { fontFamily: "Helvetica-Bold", marginBottom: 4 },
	row: { marginBottom: 2 },
});

type Props = { data: AdminSalesAnalytics };

export function SalesSummaryPdfDocument({ data }: Props) {
	const rfqLines = Object.entries(data.rfqByStatus).map(
		([k, v]) => `${k}: ${v}`,
	);
	const contractLines = Object.entries(data.contractByStatus).map(
		([k, v]) => `${k}: ${v}`,
	);
	const top = data.topOrganizationsByContractValue.slice(0, 8);

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<Text style={styles.title}>CraftHouse — Sales & pipeline summary</Text>
				<Text style={styles.row}>
					Generated for internal use. Figures are indicative (contract values
					when captured).
				</Text>

				<View style={styles.section}>
					<Text style={styles.label}>Totals</Text>
					<Text style={styles.row}>
						RFQs (all statuses): {data.rfqCountAll}
					</Text>
					<Text style={styles.row}>
						Contracts (all statuses): {data.contractCountAll}
					</Text>
					<Text style={styles.row}>
						Sum of contract value fields (€, integer):{" "}
						{data.contractValueSumEuro}
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.label}>RFQs by status</Text>
					{rfqLines.map((line) => (
						<Text key={line} style={styles.row}>
							{line}
						</Text>
					))}
				</View>

				<View style={styles.section}>
					<Text style={styles.label}>Contracts by status</Text>
					{contractLines.map((line) => (
						<Text key={line} style={styles.row}>
							{line}
						</Text>
					))}
				</View>

				<View style={styles.section}>
					<Text style={styles.label}>
						Organizations by recorded contract value (top)
					</Text>
					{top.map((o) => (
						<Text key={o.organizationId} style={styles.row}>
							{o.name} — €{Math.round(o.valueCents / 100)} ({o.contractCount}{" "}
							contracts)
						</Text>
					))}
				</View>
			</Page>
		</Document>
	);
}
