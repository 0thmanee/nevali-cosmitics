"use client";

import { Suspense } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { AuthLayout, LoginForm } from "~/features/auth";

export function LoginRouteClient() {
	const { t } = useI18n();
	return (
		<Suspense
			fallback={
				<AuthLayout
					showRegisterLink
					subtitle={
						<>
							{t("auth.loginWelcomeLine1")}
							<br />
							<span
								className="italic"
								style={{ color: "var(--color-text-muted)" }}
							>
								{t("auth.loginWelcomeLine2")}
							</span>
						</>
					}
					title={t("auth.loginTitle")}
				>
					<div className="font-sans text-white/50">
						{t("auth.signInLoading")}
					</div>
				</AuthLayout>
			}
		>
			<LoginForm />
		</Suspense>
	);
}
