import Link from "next/link";
import { RegisterForm } from "~/features/auth";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

export default function RegisterPage() {
	if (!SHOW_MULTI_PRODUCER_EXPERIENCE) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-20">
				<p className="max-w-md text-center font-serif text-2xl font-semibold text-text-dark">
					Partner registration is paused while nevali runs as a single house brand.
				</p>
				<p className="mt-4 max-w-md text-center font-sans text-sm leading-relaxed text-text-muted">
					You can still browse the catalog, check out as a guest, or create a buyer account for orders and
					saved lists.
				</p>
				<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
					<Link
						href="/products"
						className="inline-flex rounded-sm bg-[#000000] px-6 py-3 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90"
					>
						Shop products
					</Link>
					<Link
						href="/auth/register-buyer"
						className="inline-flex rounded-sm border border-cream-dark bg-white px-6 py-3 font-sans text-sm font-semibold text-text-dark transition-colors hover:bg-cream"
					>
						Create buyer account
					</Link>
					<Link
						href="/auth/login"
						className="inline-flex rounded-sm px-6 py-3 font-sans text-sm font-medium text-text-muted underline-offset-4 hover:underline"
					>
						Sign in
					</Link>
				</div>
				<Link className="mt-10 font-sans text-xs text-text-muted/70 hover:text-text-muted" href="/">
					← Back to home
				</Link>
			</div>
		);
	}

	return <RegisterForm />;
}
