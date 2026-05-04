import { Link } from "react-router-dom";

export default function OfferBanner() {
  return (
    <section className="container-edit py-24">
      <div className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          className="absolute inset-0 opacity-25"
          style={{ background: "radial-gradient(circle at 80% 30%, hsl(var(--gold) / 0.55), transparent 55%)" }}
        />
        <div className="relative grid md:grid-cols-2 gap-10 p-10 md:p-20 items-center">
          <div>
            <div className="eyebrow !text-gold-soft mb-5">Limited · 72 Hours</div>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1] mb-6">
              The Private<br />Sale, <span className="gold-text italic">−25%</span>
            </h2>
            <p className="text-primary-foreground/75 mb-8 max-w-md leading-relaxed">
              An invitation-only edit of our most-coveted seasonal pieces. Use code <span className="text-gold tracking-[0.18em]">ANITROH25</span> at checkout.
            </p>
            <Link to="/category/women" className="inline-flex items-center gap-3 border border-primary-foreground/30 px-8 py-4 text-[12px] tracking-[0.22em] uppercase hover:bg-gold hover:border-gold hover:text-primary transition-colors duration-500">
              Shop the Sale <span className="w-8 h-px bg-current" />
            </Link>
          </div>
          <div className="flex md:justify-end">
            <div className="text-right">
              <div className="font-serif text-7xl md:text-9xl gold-text leading-none">25</div>
              <div className="font-serif text-2xl mt-2">% off everything</div>
              <div className="eyebrow !text-primary-foreground/50 mt-3">Ends in 72:00:00</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
