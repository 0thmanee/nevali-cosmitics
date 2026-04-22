import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "~/app/Navbar";
import Footer from "~/app/Footer";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { COURSES } from "../data";
import { CourseViewer } from "../course-viewer";
import { Clock, BookOpen, Users } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return COURSES.filter((c) => c.free).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = COURSES.find((c) => c.slug === slug && c.free);
  if (!course) return {};
  return { title: `${course.i18n.en.title} — nevali Training` };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = COURSES.find((c) => c.slug === slug && c.free);
  if (!course) notFound();

  const en = course.i18n.en;

  return (
    <main className="flex min-h-screen w-full flex-col bg-cream pt-[56px]">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-4 flex items-center gap-2 font-sans text-xs tracking-[0.08em] uppercase text-white/40 border-b border-white/10">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/training" className="hover:text-white/70 transition-colors">Training</Link>
            <span>/</span>
            <span className="text-white/70 truncate">{en.title}</span>
          </div>

          <div className="py-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <AnimateOnScroll direction="up">
              <span className="inline-block font-sans text-xs tracking-[0.2em] uppercase text-secondary bg-secondary/15 px-3 py-1 mb-5">
                {course.tag}
              </span>
              <h1 className="font-serif font-bold uppercase text-white leading-[1.0]"
                style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
              >
                {en.title}
              </h1>
              <div className="flex items-center gap-5 mt-5 text-white/50">
                <span className="flex items-center gap-1.5 font-sans text-sm"><Clock size={13} /> {course.duration}</span>
                <span className="flex items-center gap-1.5 font-sans text-sm"><BookOpen size={13} /> {course.level}</span>
                <span className="flex items-center gap-1.5 font-sans text-sm"><Users size={13} /> {course.students} enrolled</span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={150} className="md:max-w-xs shrink-0">
              <p className="font-sans text-white/60 leading-relaxed text-sm mb-4">{en.description}</p>
              <div className="flex flex-wrap gap-2">
                {en.topics.map((t) => (
                  <span key={t} className="font-sans text-xs text-white/50 border border-white/20 px-2 py-1">{t}</span>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Course content with language switcher */}
      <CourseViewer course={course} />

      <Footer />
    </main>
  );
}
