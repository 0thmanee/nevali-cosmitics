import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";
import type { ProductCertificateData } from "./schemas/certificate.schema";

const colors = {
	primary: "var(--color-ink)",
	primaryLight: "var(--color-ink)",
	muted: "var(--color-text-muted)",
	border: "var(--color-cream-dark)",
	cream: "var(--color-cream)",
	paper: "var(--color-paper)",
};

const styles = StyleSheet.create({
	page: { padding: 48, backgroundColor: colors.paper },
	border: {
		position: "absolute",
		top: 32,
		left: 32,
		right: 32,
		bottom: 32,
		borderWidth: 2,
		borderColor: colors.border,
		borderRadius: 4,
	},
	header: { marginBottom: 32, alignItems: "center" },
	logo: {
		fontSize: 22,
		fontWeight: 700,
		color: colors.primary,
		letterSpacing: 0.5,
		marginBottom: 4,
	},
	tagline: {
		fontSize: 9,
		color: colors.muted,
		letterSpacing: 2,
		textTransform: "uppercase",
	},
	badge: {
		marginTop: 12,
		paddingVertical: 6,
		paddingHorizontal: 14,
		backgroundColor: colors.primary,
		borderRadius: 2,
	},
	badgeText: {
		fontSize: 10,
		fontWeight: 700,
		color: colors.paper,
		letterSpacing: 1.2,
	},
	title: {
		fontSize: 18,
		fontWeight: 700,
		color: colors.primaryLight,
		textAlign: "center",
		marginTop: 28,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 10,
		color: colors.muted,
		textAlign: "center",
		marginBottom: 28,
	},
	card: {
		backgroundColor: colors.cream,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 6,
		padding: 20,
		marginBottom: 16,
	},
	cardTitle: {
		fontSize: 9,
		fontWeight: 700,
		color: colors.muted,
		letterSpacing: 1.2,
		marginBottom: 10,
		textTransform: "uppercase",
	},
	row: { flexDirection: "row", marginBottom: 6 },
	label: { fontSize: 9, color: colors.muted, width: "32%" },
	value: { fontSize: 10, color: colors.primaryLight, flex: 1 },
	footer: {
		position: "absolute",
		bottom: 48,
		left: 48,
		right: 48,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	footerLeft: { fontSize: 8, color: colors.muted },
	footerRight: { fontSize: 8, color: colors.muted },
});

export function ProductCertificateDocument({
	data,
}: {
	data: ProductCertificateData;
}) {
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.border} />
				<View style={styles.header}>
					<Text style={styles.logo}>nevali</Text>
					<Text style={styles.tagline}>
						From Moroccan Soil to Global Markets
					</Text>
					<View style={styles.badge}>
						<Text style={styles.badgeText}>Certified Product</Text>
					</View>
				</View>
				<Text style={styles.title}>Product Certification</Text>
				<Text style={styles.subtitle}>
					This certifies that the following cosmetics listing has been approved
					in the Nevali public catalog.
				</Text>
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Product</Text>
					<View style={styles.row}>
						<Text style={styles.label}>Name</Text>
						<Text style={styles.value}>{data.productName}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Category</Text>
						<Text style={styles.value}>{data.category}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Organization</Text>
						<Text style={styles.value}>{data.organizationName}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Certified on</Text>
						<Text style={styles.value}>{data.certifiedAt}</Text>
					</View>
				</View>
				<View style={styles.footer}>
					<Text style={styles.footerLeft}>nevali · Casablanca, Morocco</Text>
					<Text style={styles.footerRight}>
						Document generated from nevali-cosmetics platform
					</Text>
				</View>
			</Page>
		</Document>
	);
}
