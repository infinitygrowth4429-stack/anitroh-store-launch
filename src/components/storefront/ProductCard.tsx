import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="group">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-secondary aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          width={800}
          height={1000}
          loading="lazy"
          className="w-full h-full object-cover img-zoom"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 bg-background/95 backdrop-blur px-3 py-1 text-[10px] tracking-[0.22em] uppercase">
            {product.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); add(product); }}
          className="absolute inset-x-4 bottom-4 bg-primary text-primary-foreground py-3 text-[11px] tracking-[0.22em] uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-gold hover:text-primary"
        >
          Add to Cart
        </button>
      </Link>
      <div className="pt-4 space-y-1.5">
        <div className="eyebrow !text-[10px]">{product.category}</div>
        <Link to={`/product/${product.id}`} className="block font-serif text-[17px] leading-snug hover:text-gold transition-colors">
          {product.name}
        </Link>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium">${product.price}</span>
            {product.oldPrice && <span className="text-xs text-muted-foreground line-through">${product.oldPrice}</span>}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 fill-gold text-gold" />
            {product.rating} <span className="opacity-60">({product.reviews})</span>
          </div>
        </div>
      </div>
    </article>
  );
}
