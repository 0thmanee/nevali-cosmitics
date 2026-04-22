const STORIES = [
  {
    title: "How Moroccan Pottery Meets International Quality Standards",
    date: "March 10, 2027",
    tag: "Craft & Export",
    color: "linear-gradient(135deg, #1A7080 0%, #0D5060 60%, #2A9090 100%)",
  },
  {
    title: "Workshop Training for Artisans",
    date: "March 10, 2027",
    tag: "Education",
    color: "linear-gradient(135deg, #5A3010 0%, #7A4820 60%, #9A6830 100%)",
  },
  {
    title: "Women Weavers of the Atlas: A Cooperative Success Story",
    date: "March 10, 2027",
    tag: "Community",
    color: "linear-gradient(135deg, #8B2D1E 0%, #C04830 50%, #A03820 100%)",
  },
];

export default function StoriesSection() {
  return (
    <section className="w-full py-28" style={{ background: "#FAF5EE" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-forest-light mb-2">
              Journal
            </p>
            <h2
              className="font-display font-bold uppercase text-text-dark"
              style={{ fontSize: "clamp(26px, 2.8vw, 36px)", letterSpacing: "0.06em" }}
            >
              Stories &amp; Craftsmanship
            </h2>
            <p className="font-sans text-base text-text-muted mt-2 max-w-md leading-relaxed">
              Articles, guides, and artisan stories that celebrate Moroccan heritage and support sustainable craftsmanship.
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest font-semibold text-text-dark border border-text-dark px-5 py-2.5 hover:bg-text-dark hover:text-cream transition-colors duration-200"
          >
            View All Stories
            <span>→</span>
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STORIES.map((s) => (
            <a key={s.title} href="#" className="group flex flex-col gap-4">
              {/* Thumbnail */}
              <div
                className="w-full rounded-sm overflow-hidden relative"
                style={{ height: "280px", background: s.color }}
              >
                {/* gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }}
                />
                {/* scale on hover */}
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  style={{ background: s.color }}
                />
                {/* date badge */}
                <div className="absolute bottom-0 left-0 p-4 flex items-center gap-2 z-10">
                  <span
                    className="font-sans text-xs font-bold uppercase tracking-widest text-white px-2 py-1"
                    style={{ background: "#C87020" }}
                  >
                    {s.date}
                  </span>
                  <span
                    className="font-sans text-xs font-bold uppercase tracking-widest text-white px-2 py-1"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
                  >
                    {s.tag}
                  </span>
                </div>
              </div>

              {/* Title */}
              <p
                className="font-display font-bold uppercase text-text-dark leading-snug text-base group-hover:text-forest-light transition-colors duration-200"
                style={{ letterSpacing: "0.03em" }}
              >
                {s.title}
              </p>

              {/* Read link */}
              <span className="inline-flex items-center gap-1.5 font-sans text-sm uppercase tracking-widest font-semibold text-forest-light border-b border-forest-light pb-0.5 w-fit group-hover:gap-2.5 transition-all duration-200">
                Read article <span>→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
