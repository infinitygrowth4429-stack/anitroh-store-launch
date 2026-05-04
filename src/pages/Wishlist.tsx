import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/data/products";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ProductCard from "@/components/storefront/ProductCard";
import { useEffect } from "react";

export default function Wishlist() {
  const { user, loading } = useAuth();
  const { ids } = useWishlist();
  useEffect(() => { document.title = "Wishlist — ANITROH STORE"; }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const list = products.filter((p) => ids.has(p.id));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container-edit py-12 md:py-16">
        <div className="text-center mb-12">
          <div className="eyebrow mb-3">Saved</div>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Your Wishlist</h1>
        </div>
        {list.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No saved pieces yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
