import { BookOpen, ChevronRight, Clock, Lock, Users } from "lucide-react";
import Link from "next/link";
import { getSession } from "~/app/api/auth/actions";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { interpolate } from "~/lib/i18n/interpolate";
import { getTranslator } from "~/lib/i18n/server";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import {
	FREE_COURSES,
	LOCKED_COURSES_DATA as LOCKED_COURSES,
} from "./courses/data";

export const metadata = {
	title: "Training — nevali",
	description:
		"Compliance, packaging, and export-readiness programs for verified nevali beauty partners.",
};

export default async function TrainingMarketingPage() {
	const session = await getSession();
	const t = await getTranslator();
	const role = (session?.user as { role?: string } | null)?.role;
	const isPartner =
		!!session?.user && (role === "partner" || role === "artisan");

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream pt-[56px]">
			<Navbar />

			{/* ── Hero ── */}
			<section className="bg-primary">
				<div className="mx-auto max-w-7xl px-6">
					<AnimateOnScroll
						className="flex items-center gap-2 border-white/10 border-b py-4 font-sans text-white/40 text-xs uppercase tracking-[0.08em]"
						direction="down"
					>
						<Link className="transition-colors hover:text-white/70" href="/">
							{t("nav.home")}
						</Link>
						<span>/</span>
						<span className="text-white/70">
							{t("trainingPage.breadcrumbTraining")}
						</span>
					</AnimateOnScroll>

					<div className="flex flex-col justify-between gap-10 py-20 md:flex-row md:items-end">
						<AnimateOnScroll delay={0} direction="up">
							<p className="mb-5 font-sans text-secondary text-xs uppercase tracking-[0.2em]">
								{interpolate(t("trainingPage.heroEyebrow"), {
									freeCount: FREE_COURSES.length,
									partnerCount: LOCKED_COURSES.length,
								})}
							</p>
							<h1
								className="font-bold font-serif text-white uppercase leading-none"
								style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
							>
								{t("trainingPage.heroTitleLine1")}
								<br />
								{t("trainingPage.heroTitleLine2")}
								<br />
								{t("trainingPage.heroTitleLine3")}
							</h1>
						</AnimateOnScroll>

						<AnimateOnScroll
							className="shrink-0 md:max-w-xs"
							delay={150}
							direction="up"
						>
							<p className="mb-8 font-sans text-sm text-white/60 leading-relaxed">
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("trainingPage.heroBodyMulti")
									: t("trainingPage.heroBodySingle")}
							</p>
							{!session?.user && (
								<div className="flex flex-wrap gap-3">
									{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
										<Link
											className="inline-flex items-center justify-center bg-secondary px-6 py-3 font-sans font-semibold text-white text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
											href="/auth/register"
										>
											{t("trainingPage.becomePartner")}
										</Link>
									) : null}
									<Link
										className="inline-flex items-center justify-center border border-white/30 px-6 py-3 font-sans font-semibold text-white text-xs uppercase tracking-[0.15em] transition-colors hover:bg-white/10"
										href="/auth/login"
									>
										{t("trainingPage.signIn")}
									</Link>
								</div>
							)}
							{isPartner && (
								<Link
									className="inline-flex items-center gap-2 bg-secondary px-6 py-3 font-sans font-semibold text-white text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
									href="/artisan/training"
								>
									{t("trainingPage.goToMyTraining")} <ChevronRight size={14} />
								</Link>
							)}
						</AnimateOnScroll>
					</div>
				</div>
			</section>

			{/* ── Free Courses ── */}
			<section className="mx-auto w-full max-w-7xl px-6 pt-16 pb-10">
				<AnimateOnScroll direction="up">
					<div className="mb-8 flex items-center gap-3">
						<span className="font-sans font-semibold text-secondary text-xs uppercase tracking-[0.2em]">
							{t("trainingPage.freeForEveryone")}
						</span>
						<div className="h-px flex-1 bg-cream-dark" />
					</div>
				</AnimateOnScroll>

				<div className="grid grid-cols-1 gap-0 divide-y divide-cream-dark border border-cream-dark md:grid-cols-2 md:divide-x md:divide-y-0">
					{FREE_COURSES.map((course, i) => (
						<AnimateOnScroll delay={i * 100} direction="up" key={course.slug}>
							<div className="flex h-full flex-col bg-white p-8">
								{/* Tag */}
								<div className="mb-5 flex items-center gap-2">
									<span className="bg-secondary/10 px-2 py-1 font-sans font-semibold text-secondary text-xs uppercase tracking-[0.15em]">
										{course.tag} — EN / FR / AR
									</span>
								</div>

								{/* Meta */}
								<div className="mb-5 flex items-center gap-4 text-text-muted">
									<span className="flex items-center gap-1.5 font-sans text-xs">
										<Clock size={12} /> {course.duration}
									</span>
									<span className="flex items-center gap-1.5 font-sans text-xs">
										<BookOpen size={12} /> {course.level}
									</span>
									<span className="flex items-center gap-1.5 font-sans text-xs">
										<Users size={12} />{" "}
										{interpolate(t("trainingPage.enrolled"), {
											count: course.students,
										})}
									</span>
								</div>

								<h2
									className="mb-4 font-bold font-serif text-forest-dark uppercase leading-tight"
									style={{ fontSize: "clamp(18px, 1.8vw, 24px)" }}
								>
									{course.i18n.en.title}
								</h2>

								<p className="mb-6 font-sans text-sm text-text-muted leading-relaxed">
									{course.i18n.en.description}
								</p>

								{/* Topics */}
								<div className="mb-8 flex flex-wrap gap-2">
									{course.i18n.en.topics.map((t) => (
										<span
											className="border border-cream-dark px-2 py-1 font-sans text-text-muted text-xs"
											key={t}
										>
											{t}
										</span>
									))}
								</div>

								<div className="mt-auto">
									<Link
										className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-sans font-semibold text-white text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
										href={`/training/courses/${course.slug}`}
									>
										{t("trainingPage.startLearning")} <ChevronRight size={14} />
									</Link>
								</div>
							</div>
						</AnimateOnScroll>
					))}
				</div>
			</section>

			{/* ── Gate Banner ── */}
			{!isPartner && SHOW_MULTI_PRODUCER_EXPERIENCE && (
				<AnimateOnScroll
					className="mx-auto w-full max-w-7xl px-6 py-6"
					direction="up"
				>
					<div className="flex flex-col items-center justify-between gap-6 bg-primary px-8 py-7 md:flex-row">
						<div>
							<p className="mb-2 font-sans text-secondary text-xs uppercase tracking-[0.2em]">
								{interpolate(t("trainingPage.partnerAccess"), {
									count: LOCKED_COURSES.length,
								})}
							</p>
							<h3 className="font-bold font-serif text-white text-xl uppercase leading-tight">
								{t("trainingPage.partnerBannerTitle")}
							</h3>
							<p className="mt-2 font-sans text-sm text-white/60">
								{t("trainingPage.partnerBannerBody")}
							</p>
						</div>
						<Link
							className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap bg-secondary px-8 py-4 font-sans font-semibold text-white text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
							href="/auth/register"
						>
							{t("trainingPage.becomePartner")} <ChevronRight size={14} />
						</Link>
					</div>
				</AnimateOnScroll>
			)}

			{/* ── Locked Courses ── */}
			<section className="mx-auto w-full max-w-7xl px-6 pt-4 pb-20">
				<AnimateOnScroll direction="up">
					<div className="mb-8 flex items-center gap-3">
						<span className="font-sans font-semibold text-text-muted text-xs uppercase tracking-[0.2em]">
							{isPartner
								? t("trainingPage.partnerCourses")
								: t("trainingPage.partnerCoursesLocked")}
						</span>
						<div className="h-px flex-1 bg-cream-dark" />
						{!isPartner && (
							<span className="flex items-center gap-1.5 font-sans text-text-muted text-xs">
								<Lock size={11} />{" "}
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("trainingPage.partnersOnly")
									: t("trainingPage.studioAccess")}
							</span>
						)}
					</div>
				</AnimateOnScroll>

				<div className="grid grid-cols-1 gap-0 divide-y divide-cream-dark border border-cream-dark md:grid-cols-2 md:divide-x md:divide-y-0">
					{LOCKED_COURSES.map((course, i) => (
						<AnimateOnScroll delay={i * 80} direction="up" key={course.slug}>
							<div
								className={`relative flex h-full flex-col border-cream-dark border-b bg-white p-8 ${!isPartner ? "select-none" : ""}`}
							>
								{/* Lock overlay */}
								{!isPartner && (
									<div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px]">
										<div className="flex flex-col items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center bg-primary">
												<Lock className="text-white" size={18} />
											</div>
											<p className="max-w-[180px] text-center font-sans text-text-muted text-xs">
												{SHOW_MULTI_PRODUCER_EXPERIENCE
													? t("trainingPage.partnerToAccessCourse")
													: t("trainingPage.fullCurriculumReserved")}
											</p>
											{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
												<Link
													className="border border-primary px-4 py-2 font-sans font-semibold text-primary text-xs uppercase tracking-widest transition-colors hover:bg-primary hover:text-white"
													href="/auth/register"
												>
													{t("trainingPage.applyNow")}
												</Link>
											) : (
												<Link
													className="border border-primary px-4 py-2 font-sans font-semibold text-primary text-xs uppercase tracking-widest transition-colors hover:bg-primary hover:text-white"
													href="/auth/login"
												>
													{t("trainingPage.teamSignIn")}
												</Link>
											)}
										</div>
									</div>
								)}

								{/* Meta */}
								<div className="mb-5 flex items-center gap-4 text-text-muted">
									<span className="flex items-center gap-1.5 font-sans text-xs">
										<Clock size={12} /> {course.duration}
									</span>
									<span className="flex items-center gap-1.5 font-sans text-xs">
										<BookOpen size={12} /> {course.level}
									</span>
								</div>

								<h2
									className="mb-4 font-bold font-serif text-forest-dark uppercase leading-tight"
									style={{ fontSize: "clamp(18px, 1.8vw, 24px)" }}
								>
									{course.title}
								</h2>

								<p className="font-sans text-sm text-text-muted leading-relaxed">
									{course.description}
								</p>

								{isPartner && (
									<div className="mt-auto pt-6">
										<Link
											className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-sans font-semibold text-white text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-90"
											href="/artisan/training"
										>
											{t("trainingPage.startLearning")}{" "}
											<ChevronRight size={14} />
										</Link>
									</div>
								)}
							</div>
						</AnimateOnScroll>
					))}
				</div>
			</section>

			<Footer />
		</main>
	);
}
