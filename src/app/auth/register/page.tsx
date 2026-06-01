import Link from "next/link";
import { RegisterForm } from "~/features/auth";
import { getTranslator } from "~/lib/i18n/server";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

export default async function RegisterPage() {
	const t = await getTranslator();
	if (!SHOW_MULTI_PRODUCER_EXPERIENCE) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-20">
				<p className="max-w-md text-center font-semibold font-serif text-2xl text-text-dark">
					{t("registerPaused.title")}
				</p>
				<p className="mt-4 max-w-md text-center font-sans text-sm text-text-muted leading-relaxed">
					{t("registerPaused.body")}
				</p>
				<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
					<Link
						className="inline-flex rounded-sm bg-primary px-6 py-3 font-sans font-semibold text-sm text-white transition-opacity hover:opacity-90"
						href="/products"
					>
						{t("registerPaused.shopProducts")}
					</Link>
					<Link
						className="inline-flex rounded-sm border border-primary/30 bg-white px-6 py-3 font-sans font-semibold text-primary-dark text-sm transition-colors hover:bg-primary/10"
						href="/auth/register-buyer"
					>
						{t("registerPaused.createBuyerAccount")}
					</Link>
					<Link
						className="inline-flex rounded-sm px-6 py-3 font-medium font-sans text-sm text-text-muted underline-offset-4 hover:underline"
						href="/auth/login"
					>
						{t("registerPaused.signIn")}
					</Link>
				</div>
				<Link
					className="mt-10 font-sans text-text-muted/70 text-xs hover:text-text-muted"
					href="/"
				>
					{t("registerPaused.backToHome")}
				</Link>
			</div>
		);
	}

	return <RegisterForm />;
}
