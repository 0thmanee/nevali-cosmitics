"use client";

import { useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";

type Props = {
	contactEmail: string;
};

const inputClass =
	"w-full rounded-sm border border-cream-dark bg-white px-4 py-3 font-sans text-sm text-text-dark transition-colors focus:outline-none focus:ring-2 focus:ring-ink/40";

export function ContactForm({ contactEmail }: Props) {
	const { t } = useI18n();
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [submitted, setSubmitted] = useState(false);

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		if (!name.trim() || !phone.trim() || !subject.trim() || !message.trim()) {
			setError(t("contact.form.requiredError"));
			return;
		}

		const mailSubject = `[Contact] ${subject.trim()}`;
		const mailBody = [
			`${t("contact.form.nameLabel")}: ${name.trim()}`,
			`${t("contact.form.phoneLabel")}: ${phone.trim()}`,
			`${t("contact.form.emailLabel")}: ${email.trim() || t("contact.form.notProvided")}`,
			"",
			`${t("contact.form.messageLabel")}:`,
			message.trim(),
		].join("\n");

		const href = `mailto:${contactEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
		window.location.href = href;
		setSubmitted(true);
	}

	return (
		<div className="rounded-sm border border-cream-dark bg-white p-6">
			<h2 className="mb-4 font-bold font-serif text-text-dark text-xl">
				{t("contact.form.title")}
			</h2>

			{submitted ? (
				<p className="mb-4 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 font-sans text-emerald-800 text-sm">
					{t("contact.form.success")}
				</p>
			) : null}
			{error ? (
				<p className="mb-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 font-sans text-red-700 text-sm">
					{error}
				</p>
			) : null}

			<form className="space-y-4" onSubmit={onSubmit}>
				<label className="block">
					<span className="mb-1 block font-medium font-sans text-sm text-text-dark">
						{t("contact.form.nameLabel")}
					</span>
					<input
						className={inputClass}
						onChange={(e) => setName(e.target.value)}
						value={name}
					/>
				</label>
				<label className="block">
					<span className="mb-1 block font-medium font-sans text-sm text-text-dark">
						{t("contact.form.phoneLabel")}
					</span>
					<input
						className={inputClass}
						onChange={(e) => setPhone(e.target.value)}
						type="tel"
						value={phone}
					/>
				</label>
				<label className="block">
					<span className="mb-1 block font-medium font-sans text-sm text-text-dark">
						{t("contact.form.emailLabel")}
					</span>
					<span className="mb-1 block font-sans text-text-muted text-xs">
						{t("contact.form.emailOptional")}
					</span>
					<input
						className={inputClass}
						onChange={(e) => setEmail(e.target.value)}
						placeholder={t("contact.form.emailPlaceholder")}
						type="email"
						value={email}
					/>
				</label>
				<label className="block">
					<span className="mb-1 block font-medium font-sans text-sm text-text-dark">
						{t("contact.form.subjectLabel")}
					</span>
					<input
						className={inputClass}
						onChange={(e) => setSubject(e.target.value)}
						value={subject}
					/>
				</label>
				<label className="block">
					<span className="mb-1 block font-medium font-sans text-sm text-text-dark">
						{t("contact.form.messageLabel")}
					</span>
					<textarea
						className={`${inputClass} min-h-[130px] resize-y`}
						onChange={(e) => setMessage(e.target.value)}
						value={message}
					/>
				</label>
				<button
					className="rounded-sm bg-ink px-6 py-3 font-sans font-semibold text-sm text-white transition-opacity hover:opacity-90"
					type="submit"
				>
					{t("contact.form.submit")}
				</button>
			</form>
		</div>
	);
}
