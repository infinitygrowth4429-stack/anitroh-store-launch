import { Link, NavLink } from "react-router-dom";
import { Search, User, ShoppingBag, Heart, Menu, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";

const nav = [
  { to: "/category/men", label: "Men" },
  { to: "/category/women", label: "Women" },
  { to: "/category/footwear", label: "Footwear" },
  { to: "/category/moringa", label: "Moringa" },
  { to: "/category/accessories", label: "Categories" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const { isAdmin } = useAdmin();
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="bg-primary text-primary-foreground text-[11px] tracking-[0.22em] uppercase text-center py-2">
        Complimentary shipping on orders over $150 · 30-day returns
      </div>
      <div className="container-edit flex items-center justify-between h-20">
        <button onClick={() => setMobile(!mobile)} className="lg:hidden p-2 -ml-2" aria-label="Menu">
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="font-serif text-2xl md:text-[28px] tracking-[0.18em] font-medium">
          ANITROH<span className="gold-text">.</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-[13px] tracking-[0.14em] uppercase underline-grow transition-colors ${
                  isActive ? "text-foreground" : "text-foreground/75 hover:text-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <button className="p-2.5 hover:text-gold transition-colors" aria-label="Search"><Search className="w-[18px] h-[18px]" /></button>
          {isAdmin && (
            <Link to="/admin" className="p-2.5 hover:text-gold transition-colors hidden sm:inline-flex" aria-label="Admin" title="Admin"><Shield className="w-[18px] h-[18px]" /></Link>
          )}
          <Link to="/account" className="p-2.5 hover:text-gold transition-colors hidden sm:inline-flex" aria-label="Account"><User className="w-[18px] h-[18px]" /></Link>
          <Link to="/wishlist" className="p-2.5 hover:text-gold transition-colors hidden sm:inline-flex" aria-label="Wishlist"><Heart className="w-[18px] h-[18px]" /></Link>
          <button onClick={() => setOpen(true)} className="p-2.5 hover:text-gold transition-colors relative" aria-label="Cart">
            <ShoppingBag className="w-[18px] h-[18px]" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold text-[10px] font-medium w-[18px] h-[18px] rounded-full flex items-center justify-center text-primary-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobile && (
        <div className="lg:hidden border-t border-border/60 bg-background animate-fade-in">
          <nav className="container-edit py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => setMobile(false)}
                className="py-3 text-sm tracking-[0.14em] uppercase border-b border-border/40">
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
