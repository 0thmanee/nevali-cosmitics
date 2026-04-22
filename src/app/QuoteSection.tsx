export default function QuoteSection() {
  return (
    <section
      className="w-full py-28 flex items-center justify-center text-center px-6"
      style={{ background: "#1A0500" }}
    >
      <blockquote className="max-w-2xl">
        <p
          className="font-serif italic text-white leading-relaxed"
          style={{ fontSize: "clamp(18px, 2.5vw, 26px)" }}
        >
          &ldquo;Every handmade piece carries a story woven, shaped, and crafted through generations of Moroccan heritage.&rdquo;
        </p>
      </blockquote>
    </section>
  );
}
