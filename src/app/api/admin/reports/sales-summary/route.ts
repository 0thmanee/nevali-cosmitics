import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import React from "react";
import { getAdminSalesAnalytics } from "~/app/api/admin/actions";
import { getSession } from "~/app/api/auth/actions";
import { SalesSummaryPdfDocument } from "../sales-summary-document";

export async function GET() {
	const session = await getSession();
	const role = (session?.user as { role?: string })?.role;
	if (role !== "superadmin") {
		return new NextResponse("Forbidden", { status: 403 });
	}

	const data = await getAdminSalesAnalytics(null);
	const el = React.createElement(SalesSummaryPdfDocument, { data });
	const pdfBuffer = await renderToBuffer(
		el as React.ReactElement<import("@react-pdf/renderer").DocumentProps>,
	);

	return new NextResponse(Buffer.from(pdfBuffer), {
		status: 200,
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition":
				'attachment; filename="craft-house-sales-summary.pdf"',
		},
	});
}
