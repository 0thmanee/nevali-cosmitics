import { BookOpen, Clock, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { CourseViewer } from "../course-viewer";
import { COURSES } from "../data";

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
				<div className="mx-auto max-w-7xl px-6">
					<div className="flex items-center gap-2 border-white/10 border-b py-4 font-sans text-white/40 text-xs uppercase tracking-[0.08em]">
						<Link className="transition-colors hover:text-white/70" href="/">
							Home
						</Link>
						<span>/</span>
						<Link
							className="transition-colors hover:text-white/70"
							href="/training"
						>
							Training
						</Link>
						<span>/</span>
						<span className="truncate text-white/70">{en.title}</span>
					</div>

					<div className="flex flex-col justify-between gap-10 py-16 md:flex-row md:items-end">
						<AnimateOnScroll direction="up">
							<span className="mb-5 inline-block bg-secondary/15 px-3 py-1 font-sans text-secondary text-xs uppercase tracking-[0.2em]">
								{course.tag}
							</span>
							<h1
								className="font-bold font-serif text-white uppercase leading-[1.0]"
								style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
							>
								{en.title}
							</h1>
							<div className="mt-5 flex items-center gap-5 text-white/50">
								<span className="flex items-center gap-1.5 font-sans text-sm">
									<Clock size={13} /> {course.duration}
								</span>
								<span className="flex items-center gap-1.5 font-sans text-sm">
									<BookOpen size={13} /> {course.level}
								</span>
								<span className="flex items-center gap-1.5 font-sans text-sm">
									<Users size={13} /> {course.students} enrolled
								</span>
							</div>
						</AnimateOnScroll>

						<AnimateOnScroll
							className="shrink-0 md:max-w-xs"
							delay={150}
							direction="up"
						>
							<p className="mb-4 font-sans text-sm text-white/60 leading-relaxed">
								{en.description}
							</p>
							<div className="flex flex-wrap gap-2">
								{en.topics.map((t) => (
									<span
										className="border border-white/20 px-2 py-1 font-sans text-white/50 text-xs"
										key={t}
									>
										{t}
									</span>
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
