import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import HeroCarousel from "@/components/storefront/HeroCarousel";
import ShopByCategory from "@/components/storefront/ShopByCategory";
import ProductCard from "@/components/storefront/ProductCard";
import Reviews from "@/components/storefront/Reviews";
import OfferBanner from "@/components/storefront/OfferBanner";
import CartDrawer from "@/components/storefront/CartDrawer";
import { products } from "@/data/products";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "ANITROH STORE — Premium Fashion, Footwear & Moringa";
    const desc = "ANITROH STORE: editorial fashion, hand-crafted footwear and single-origin moringa wellness. Considered design at honest prices.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); }
    m.setAttribute("content", desc);
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) { canon = document.createElement("link"); canon.setAttribute("rel", "canonical"); document.head.appendChild(canon); }
    canon.setAttribute("href", window.location.origin + "/");
  }, []);

  const bestsellers = products.filter((p) => p.badge === "Bestseller" || p.rating >= 4.8).slice(0, 4);
  const featured = products.slice(2, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />

        {/* Best Sellers */}
        <section className="container-edit py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="eyebrow mb-4">Most Coveted</div>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Best Sellers</h2>
            </div>
            <a href="/category/all" className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase underline-grow">
              View All <span className="w-6 h-px bg-current" />
            </a>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <ShopByCategory />

        {/* Featured / Trending */}
        <section className="bg-secondary/40 py-24">
          <div className="container-edit">
            <div className="text-center mb-14">
              <div className="eyebrow mb-4">Trending Now</div>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Featured Pieces</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>

        <OfferBanner />
        <Reviews />

        {/* Newsletter */}
        <section className="container-edit py-20 text-center">
          <div className="eyebrow mb-4">The Letter</div>
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-5 max-w-xl mx-auto">First access. Quiet luxury, in your inbox.</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Receive private invitations, new arrivals and the occasional considered word.</p>
          <form className="flex max-w-md mx-auto border-b border-border focus-within:border-gold transition-colors" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="Enter your email" aria-label="Email"
              className="flex-1 bg-transparent py-3 text-sm placeholder:text-muted-foreground/60 outline-none" />
            <button className="text-[11px] tracking-[0.22em] uppercase px-2 hover:text-gold transition-colors">Subscribe</button>
          </form>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Index;
