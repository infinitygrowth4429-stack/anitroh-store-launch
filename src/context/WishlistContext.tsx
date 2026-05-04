import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

type WishlistCtx = {
  ids: Set<string>;
  toggle: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
  loading: boolean;
};

const Ctx = createContext<WishlistCtx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setIds(new Set()); return; }
    setLoading(true);
    const { data } = await supabase.from("wishlists").select("product_id").eq("user_id", user.id);
    setIds(new Set((data ?? []).map((r) => r.product_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const toggle = async (productId: string) => {
    if (!user) {
      toast.error("Please sign in to save to wishlist");
      return;
    }
    if (ids.has(productId)) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId);
      setIds((s) => { const n = new Set(s); n.delete(productId); return n; });
      toast.success("Removed from wishlist");
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
      setIds((s) => new Set(s).add(productId));
      toast.success("Saved to wishlist");
    }
  };

  return <Ctx.Provider value={{ ids, toggle, has: (id) => ids.has(id), loading }}>{children}</Ctx.Provider>;
}

export const useWishlist = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be inside WishlistProvider");
  return c;
};
