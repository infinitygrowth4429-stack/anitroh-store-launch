import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import CartDrawer from "@/components/storefront/CartDrawer";
import ProductCard from "@/components/storefront/ProductCard";
import { products } from "@/data/products";

const titles: Record<string, string> = {
  men: "Men", women: "Women", footwear: "Footwear",
  moringa: "Moringa Wellness", accessories: "Accessories", all: "All Pieces",
};

export default function CategoryPage() {
  const { slug = "all" } = useParams();
  const title = titles[slug] || "Shop";
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    document.title = `${title} — ANITROH STORE`;
    window.scrollTo(0, 0);
  }, [title]);

  const list = useMemo(() => {
    let l = slug === "all" ? products : products.filter((p) => p.category.toLowerCase() === slug);
    if (sort === "price-asc") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [slug, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="container-edit pt-12 pb-8 text-center">
          <div className="eyebrow mb-4">Collection</div>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">{list.length} considered pieces</p>
        </section>

        <section className="container-edit pb-24">
          <div className="flex justify-end mb-8">
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="text-[11px] tracking-[0.22em] uppercase bg-transparent border-b border-border py-2 pr-6 focus:border-gold outline-none">
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          {list.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No pieces in this collection yet.</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
