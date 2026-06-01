"use client";

import { useEffect } from "react";
import { reportError } from "~/lib/report-error";

// global-error replaces the root layout entirely, so it cannot rely on the i18n
// provider or app styles. Keep it fully self-contained with inline styles.
export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		reportError(error, { boundary: "global-error" });
	}, [error]);

	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#ffffff",
					color: "#000000",
					fontFamily: "system-ui, sans-serif",
					padding: "24px",
				}}
			>
				<div style={{ maxWidth: "28rem", textAlign: "center" }}>
					<h1 style={{ fontSize: "32px", fontWeight: 700, margin: 0 }}>
						Something went wrong
					</h1>
					<p style={{ color: "#727272", lineHeight: 1.6, marginTop: "16px" }}>
						An unexpected error occurred. Please try again, or return to the
						homepage.
					</p>
					<div
						style={{
							marginTop: "28px",
							display: "flex",
							gap: "12px",
							justifyContent: "center",
							flexWrap: "wrap",
						}}
					>
						<button
							onClick={() => reset()}
							style={{
								background: "#000000",
								color: "#ffffff",
								border: "none",
								borderRadius: "9999px",
								padding: "12px 20px",
								fontSize: "13px",
								fontWeight: 600,
								textTransform: "uppercase",
								letterSpacing: "0.04em",
								cursor: "pointer",
							}}
							type="button"
						>
							Try again
						</button>
						<a
							href="/"
							style={{
								color: "#000000",
								border: "1px solid #d8d0c4",
								borderRadius: "9999px",
								padding: "12px 20px",
								fontSize: "13px",
								fontWeight: 600,
								textTransform: "uppercase",
								letterSpacing: "0.04em",
								textDecoration: "none",
							}}
						>
							Back to homepage
						</a>
					</div>
				</div>
			</body>
		</html>
	);
}
