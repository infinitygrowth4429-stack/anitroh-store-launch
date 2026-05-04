import { Star } from "lucide-react";
import { reviews } from "@/data/products";

export default function Reviews() {
  return (
    <section className="bg-secondary/60 py-24">
      <div className="container-edit">
        <div className="text-center mb-14">
          <div className="eyebrow mb-4">Voices</div>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">From Our Patrons</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r) => (
            <figure key={r.name} className="bg-background p-8 border border-border/60 shadow-[var(--shadow-soft)]">
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="font-serif text-[17px] leading-relaxed mb-6 text-foreground/90">
                "{r.text}"
              </blockquote>
              <figcaption className="text-xs">
                <div className="font-medium tracking-wide">{r.name}</div>
                <div className="text-muted-foreground">{r.city}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
