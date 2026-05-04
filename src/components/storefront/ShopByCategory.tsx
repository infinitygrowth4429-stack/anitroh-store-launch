import { Link } from "react-router-dom";
import catMen from "@/assets/cat-men.jpg";
import catWomen from "@/assets/cat-women.jpg";
import catFootwear from "@/assets/cat-footwear.jpg";
import catMoringa from "@/assets/cat-moringa.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";

const cats = [
  { name: "Men", img: catMen, to: "/category/men" },
  { name: "Women", img: catWomen, to: "/category/women" },
  { name: "Footwear", img: catFootwear, to: "/category/footwear" },
  { name: "Moringa", img: catMoringa, to: "/category/moringa" },
  { name: "Accessories", img: catAccessories, to: "/category/accessories" },
];

export default function ShopByCategory() {
  return (
    <section className="container-edit py-24">
      <div className="text-center mb-14">
        <div className="eyebrow mb-4">The Edit</div>
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Shop by Category</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
        {cats.map((c, i) => (
          <Link key={c.name} to={c.to} className="group relative overflow-hidden aspect-[3/4] bg-secondary"
            style={{ animationDelay: `${i * 80}ms` }}>
            <img src={c.img} alt={c.name} width={800} height={1024} loading="lazy"
              className="w-full h-full object-cover img-zoom" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/0 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
              <div className="font-serif text-xl md:text-2xl">{c.name}</div>
              <div className="text-[11px] tracking-[0.22em] uppercase opacity-80 mt-1 inline-flex items-center gap-2">
                Discover <span className="w-6 h-px bg-gold" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
