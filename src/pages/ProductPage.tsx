import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { products } from "@/data/products";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import CartDrawer from "@/components/storefront/CartDrawer";
import ProductCard from "@/components/storefront/ProductCard";
import { Star, Heart, Truck, RotateCcw, Shield, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { add, setOpen } = useCart();
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — ANITROH STORE`;
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); }
      m.setAttribute("content", product.description.slice(0, 155));
    }
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) return <Navigate to="/" replace />;

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <nav className="container-edit pt-6 text-xs text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-foreground">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate">{product.name}</span>
        </nav>

        <section className="container-edit py-10 grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="bg-secondary aspect-[4/5] overflow-hidden cursor-zoom-in" onClick={() => setZoom(!zoom)}>
            <img
              src={product.image}
              alt={product.name}
              width={800} height={1000}
              className={`w-full h-full object-cover transition-transform duration-700 ${zoom ? "scale-150" : "scale-100"}`}
            />
          </div>

          <div className="lg:pt-8">
            <div className="eyebrow mb-3">{product.category}</div>
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-[1.05] mb-5">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-muted"}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{product.rating} · {product.reviews} reviews</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-border">
              <span className="font-serif text-3xl">${product.price}</span>
              {product.oldPrice && (
                <>
                  <span className="text-base text-muted-foreground line-through">${product.oldPrice}</span>
                  <span className="text-xs text-gold-deep tracking-wide">Save ${product.oldPrice - product.price}</span>
                </>
              )}
            </div>

            <p className="text-foreground/80 leading-relaxed mb-8">{product.description}</p>

            {product.colors && (
              <div className="mb-7">
                <div className="eyebrow mb-3">Colour {color && <span className="text-foreground/80 normal-case tracking-normal">— {color}</span>}</div>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button key={c.name} onClick={() => setColor(c.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${color === c.name ? "border-gold scale-110" : "border-border hover:border-foreground/40"}`}
                      style={{ background: c.hex }} aria-label={c.name} />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && (
              <div className="mb-8">
                <div className="flex justify-between mb-3">
                  <div className="eyebrow">Size</div>
                  <button className="text-[11px] tracking-[0.18em] uppercase underline-grow text-muted-foreground hover:text-foreground">Size Guide</button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`py-3 text-sm border transition-all ${size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold inline-block" />
              {product.inStock ? "In stock — ships within 24h" : "Out of stock"}
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => add(product, { size, color })}
                disabled={(product.sizes && !size) || !product.inStock}
                className="flex-1 bg-primary text-primary-foreground py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-gold hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Add to Bag
              </button>
              <button className="px-5 border border-border hover:border-foreground transition-colors" aria-label="Wishlist">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => { add(product, { size, color }); setOpen(true); }}
              disabled={(product.sizes && !size) || !product.inStock}
              className="w-full border border-foreground py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-foreground hover:text-background transition-colors disabled:opacity-40">
              Buy It Now
            </button>

            <div className="grid grid-cols-3 gap-3 mt-10 pt-8 border-t border-border">
              {[
                { Icon: Truck, label: "Free shipping", sub: "Over $150" },
                { Icon: RotateCcw, label: "30-day returns", sub: "Effortless" },
                { Icon: Shield, label: "Authentic", sub: "Lifetime guarantee" },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 mx-auto mb-2 text-gold" />
                  <div className="text-xs font-medium">{label}</div>
                  <div className="text-[11px] text-muted-foreground">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="container-edit py-20 border-t border-border/60 mt-12">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-12 text-center">You May Also Love</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
