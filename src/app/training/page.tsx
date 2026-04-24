import Link from "next/link";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { getSession } from "~/app/api/auth/actions";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { Lock, BookOpen, Clock, Users, ChevronRight } from "lucide-react";
import { FREE_COURSES, LOCKED_COURSES_DATA as LOCKED_COURSES } from "./courses/data";
import { getTranslator } from "~/lib/i18n/server";
import { interpolate } from "~/lib/i18n/interpolate";

export const metadata = {
  title: "Training — nevali",
  description:
    "Compliance, packaging, and export-readiness programs for verified nevali beauty partners.",
};

export default async function TrainingMarketingPage() {
  const session = await getSession();
  const t = await getTranslator();
  const role = (session?.user as { role?: string } | null)?.role;
  const isPartner = !!session?.user && (role === "partner" || role === "artisan");

  return (
    <main className="flex min-h-screen w-full flex-col bg-cream pt-[56px]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-6">

          <AnimateOnScroll className="py-4 flex items-center gap-2 font-sans text-xs tracking-[0.08em] uppercase text-white/40 border-b border-white/10" direction="down">
            <Link href="/" className="hover:text-white/70 transition-colors">{t("nav.home")}</Link>
            <span>/</span>
            <span className="text-white/70">{t("trainingPage.breadcrumbTraining")}</span>
          </AnimateOnScroll>

          <div className="py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <AnimateOnScroll direction="up" delay={0}>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-5">
                {interpolate(t("trainingPage.heroEyebrow"), {
                  freeCount: FREE_COURSES.length,
                  partnerCount: LOCKED_COURSES.length,
                })}
              </p>
              <h1
                className="font-serif font-bold uppercase text-white leading-none"
                style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
              >
                {t("trainingPage.heroTitleLine1")}<br />{t("trainingPage.heroTitleLine2")}<br />{t("trainingPage.heroTitleLine3")}
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={150} className="md:max-w-xs shrink-0">
              <p className="font-sans text-white/60 leading-relaxed text-sm mb-8">
                {SHOW_MULTI_PRODUCER_EXPERIENCE
                  ? t("trainingPage.heroBodyMulti")
                  : t("trainingPage.heroBodySingle")}
              </p>
              {!session?.user && (
                <div className="flex flex-wrap gap-3">
                  {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
                    <Link
                      className="inline-flex items-center justify-center bg-secondary px-6 py-3 font-sans font-semibold text-white text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-90"
                      href="/auth/register"
                    >
                      {t("trainingPage.becomePartner")}
                    </Link>
                  ) : null}
                  <Link
                    className="inline-flex items-center justify-center border border-white/30 px-6 py-3 font-sans font-semibold text-xs tracking-[0.15em] uppercase text-white transition-colors hover:bg-white/10"
                    href="/auth/login"
                  >
                    {t("trainingPage.signIn")}
                  </Link>
                </div>
              )}
              {isPartner && (
                <Link
                  className="inline-flex items-center gap-2 bg-secondary px-6 py-3 font-sans font-semibold text-white text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-90"
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
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 w-full">
        <AnimateOnScroll direction="up">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-sans text-xs tracking-[0.2em] uppercase text-secondary font-semibold">
              {t("trainingPage.freeForEveryone")}
            </span>
            <div className="flex-1 h-px bg-cream-dark" />
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-cream-dark divide-y md:divide-y-0 md:divide-x divide-cream-dark">
          {FREE_COURSES.map((course, i) => (
            <AnimateOnScroll key={course.slug} direction="up" delay={i * 100}>
              <div className="bg-white h-full flex flex-col p-8">
                {/* Tag */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="font-sans text-xs tracking-[0.15em] uppercase text-secondary font-semibold bg-secondary/10 px-2 py-1">
                    {course.tag} — EN / FR / AR
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-5 text-text-muted">
                  <span className="flex items-center gap-1.5 font-sans text-xs">
                    <Clock size={12} /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-xs">
                    <BookOpen size={12} /> {course.level}
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-xs">
                    <Users size={12} /> {interpolate(t("trainingPage.enrolled"), { count: course.students })}
                  </span>
                </div>

                <h2
                  className="font-serif font-bold uppercase text-forest-dark leading-tight mb-4"
                  style={{ fontSize: "clamp(18px, 1.8vw, 24px)" }}
                >
                  {course.i18n.en.title}
                </h2>

                <p className="font-sans text-sm text-text-muted leading-relaxed mb-6">
                  {course.i18n.en.description}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {course.i18n.en.topics.map((t) => (
                    <span
                      key={t}
                      className="font-sans text-xs text-text-muted border border-cream-dark px-2 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <Link
                    href={`/training/courses/${course.slug}`}
                    className="inline-flex items-center gap-2 font-sans font-semibold text-xs tracking-[0.15em] uppercase text-white bg-primary px-6 py-3 hover:opacity-90 transition-opacity"
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
        <AnimateOnScroll direction="up" className="max-w-7xl mx-auto px-6 py-6 w-full">
          <div className="bg-primary flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-7">
            <div>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-2">
                {interpolate(t("trainingPage.partnerAccess"), { count: LOCKED_COURSES.length })}
              </p>
              <h3 className="font-serif font-bold uppercase text-white text-xl leading-tight">
                {t("trainingPage.partnerBannerTitle")}
              </h3>
              <p className="font-sans text-white/60 text-sm mt-2">
                {t("trainingPage.partnerBannerBody")}
              </p>
            </div>
            <Link
              href="/auth/register"
              className="shrink-0 inline-flex items-center gap-2 bg-secondary px-8 py-4 font-sans font-semibold text-white text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {t("trainingPage.becomePartner")} <ChevronRight size={14} />
            </Link>
          </div>
        </AnimateOnScroll>
      )}

      {/* ── Locked Courses ── */}
      <section className="max-w-7xl mx-auto px-6 pt-4 pb-20 w-full">
        <AnimateOnScroll direction="up">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-sans text-xs tracking-[0.2em] uppercase text-text-muted font-semibold">
              {isPartner ? t("trainingPage.partnerCourses") : t("trainingPage.partnerCoursesLocked")}
            </span>
            <div className="flex-1 h-px bg-cream-dark" />
            {!isPartner && (
              <span className="flex items-center gap-1.5 font-sans text-xs text-text-muted">
                <Lock size={11} />{" "}
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("trainingPage.partnersOnly") : t("trainingPage.studioAccess")}
              </span>
            )}
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-cream-dark divide-y md:divide-y-0 md:divide-x divide-cream-dark">
          {LOCKED_COURSES.map((course, i) => (
            <AnimateOnScroll key={course.slug} direction="up" delay={i * 80}>
              <div className={`relative bg-white h-full flex flex-col p-8 border-b border-cream-dark ${!isPartner ? "select-none" : ""}`}>

                {/* Lock overlay */}
                {!isPartner && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 bg-primary flex items-center justify-center">
                        <Lock size={18} className="text-white" />
                      </div>
                      <p className="font-sans text-xs text-text-muted text-center max-w-[180px]">
                        {SHOW_MULTI_PRODUCER_EXPERIENCE
                          ? t("trainingPage.partnerToAccessCourse")
                          : t("trainingPage.fullCurriculumReserved")}
                      </p>
                      {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
                        <Link
                          href="/auth/register"
                          className="font-sans text-xs tracking-widest uppercase font-semibold text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-white transition-colors"
                        >
                          {t("trainingPage.applyNow")}
                        </Link>
                      ) : (
                        <Link
                          href="/auth/login"
                          className="font-sans text-xs tracking-widest uppercase font-semibold text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-white transition-colors"
                        >
                          {t("trainingPage.teamSignIn")}
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center gap-4 mb-5 text-text-muted">
                  <span className="flex items-center gap-1.5 font-sans text-xs">
                    <Clock size={12} /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-xs">
                    <BookOpen size={12} /> {course.level}
                  </span>
                </div>

                <h2
                  className="font-serif font-bold uppercase text-forest-dark leading-tight mb-4"
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
                      href="/artisan/training"
                      className="inline-flex items-center gap-2 font-sans font-semibold text-xs tracking-[0.15em] uppercase text-white bg-primary px-6 py-3 hover:opacity-90 transition-opacity"
                    >
                      {t("trainingPage.startLearning")} <ChevronRight size={14} />
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
