import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroFashion from "@/assets/hero-fashion.jpg";
import heroFootwear from "@/assets/hero-footwear.jpg";
import heroArrivals from "@/assets/hero-arrivals.jpg";
import heroMoringa from "@/assets/hero-moringa.jpg";

const slides = [
  { img: heroFashion, eyebrow: "Autumn / Winter Edit", title: "The Art of Restraint", subtitle: "Elevated fashion for the discerning few.", cta: "Shop the Edit", to: "/category/women" },
  { img: heroFootwear, eyebrow: "Footwear · Heritage", title: "Step Considered.", subtitle: "Hand-crafted leathers built to outlast the season.", cta: "Discover Footwear", to: "/category/footwear" },
  { img: heroArrivals, eyebrow: "New Arrivals", title: "Quietly Confident.", subtitle: "The pieces shaping how we dress this season.", cta: "Explore New In", to: "/category/men" },
  { img: heroMoringa, eyebrow: "Wellness · Moringa", title: "Vital, by Nature.", subtitle: "Single-origin moringa for a daily ritual of well-being.", cta: "Shop Moringa", to: "/category/moringa" },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const go = (d: number) => setI((v) => (v + d + slides.length) % slides.length);

  return (
    <section className="relative h-[78vh] min-h-[560px] max-h-[820px] overflow-hidden bg-secondary">
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-hidden={i !== idx}
        >
          <img
            src={s.img}
            alt={s.title}
            className={`w-full h-full object-cover ${i === idx ? "animate-ken-burns" : ""}`}
            width={1920}
            height={1280}
            loading={idx === 0 ? "eager" : "lazy"}
            fetchPriority={idx === 0 ? "high" : "auto"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/65 via-primary/15 to-transparent" />
          <div className="absolute inset-0 flex items-end md:items-center">
            <div className="container-edit pb-16 md:pb-0">
              {i === idx && (
                <div className="max-w-xl text-primary-foreground animate-slide-up">
                  <div className="eyebrow !text-gold-soft mb-5">{s.eyebrow}</div>
                  <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight mb-6">{s.title}</h1>
                  <p className="text-base md:text-lg text-primary-foreground/85 mb-8 max-w-md leading-relaxed">{s.subtitle}</p>
                  <Link
                    to={s.to}
                    className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 text-[12px] tracking-[0.22em] uppercase hover:bg-gold transition-colors duration-500"
                  >
                    {s.cta}
                    <span className="w-8 h-px bg-current" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => go(-1)} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-primary-foreground/80 hover:text-gold transition-colors z-10" aria-label="Previous">
        <ChevronLeft className="w-7 h-7" />
      </button>
      <button onClick={() => go(1)} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-primary-foreground/80 hover:text-gold transition-colors z-10" aria-label="Next">
        <ChevronRight className="w-7 h-7" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-px transition-all duration-500 ${i === idx ? "w-12 bg-gold" : "w-8 bg-primary-foreground/40"}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
