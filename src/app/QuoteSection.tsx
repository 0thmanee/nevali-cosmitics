import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { getTranslator } from "~/lib/i18n/server";

export default async function QuoteSection() {
  const t = await getTranslator();
  return (
    <section
      className="flex w-full items-center justify-center px-6 py-28 text-center"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--color-cream) 80%, var(--color-paper)) 0%, color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper)) 100%)",
      }}
    >
      <AnimateOnScroll className="mx-auto max-w-2xl" direction="up" scale>
        <blockquote>
          <p
            className="font-serif text-primary-darker leading-relaxed italic"
            style={{ fontSize: "clamp(18px, 2.5vw, 26px)" }}
          >
            &ldquo;{t("quote.text")}&rdquo;
          </p>
        </blockquote>
      </AnimateOnScroll>
    </section>
  );
}
