import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";

export default function QuoteSection() {
  return (
    <section
      className="w-full py-28 flex items-center justify-center text-center px-6"
      style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--color-cream) 80%, var(--color-paper)) 0%, color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper)) 100%)" }}
    >
      <AnimateOnScroll className="mx-auto max-w-2xl" direction="up" scale>
        <blockquote>
          <p
            className="font-serif italic text-primary-darker leading-relaxed"
            style={{ fontSize: "clamp(18px, 2.5vw, 26px)" }}
          >
            &ldquo;Beauty can be both soft and strong: rituals that honor skin, origin, and the women who create them.&rdquo;
          </p>
        </blockquote>
      </AnimateOnScroll>
    </section>
  );
}
