"use client";

import { Suspense } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { AuthLayout, ResetPasswordForm } from "~/features/auth";

export function ResetPasswordRouteClient() {
	const { t } = useI18n();
	return (
		<Suspense
			fallback={
				<AuthLayout
					showLoginLink
					subtitle={t("auth.resetHint")}
					title={t("auth.resetTitle")}
				>
					<div className="font-sans text-white/50">{t("common.loading")}</div>
				</AuthLayout>
			}
		>
			<ResetPasswordForm />
		</Suspense>
	);
}
