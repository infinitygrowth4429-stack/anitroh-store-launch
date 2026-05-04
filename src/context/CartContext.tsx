import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Product } from "@/data/products";

export type CartItem = { product: Product; qty: number; size?: string; color?: string };

type CartCtx = {
  items: CartItem[];
  add: (p: Product, opts?: { size?: string; color?: string; qty?: number }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("anitroh-cart") || "[]"); } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("anitroh-cart", JSON.stringify(items));
  }, [items]);

  const add: CartCtx["add"] = (p, opts) => {
    setItems((cur) => {
      const idx = cur.findIndex((i) => i.product.id === p.id && i.size === opts?.size && i.color === opts?.color);
      if (idx >= 0) {
        const copy = [...cur];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + (opts?.qty ?? 1) };
        return copy;
      }
      return [...cur, { product: p, qty: opts?.qty ?? 1, size: opts?.size, color: opts?.color }];
    });
    setOpen(true);
  };

  const value = useMemo<CartCtx>(() => ({
    items, add, open, setOpen,
    remove: (id) => setItems((cur) => cur.filter((i) => i.product.id !== id)),
    setQty: (id, qty) => setItems((cur) => cur.map((i) => i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    clear: () => setItems([]),
    total: items.reduce((s, i) => s + i.product.price * i.qty, 0),
    count: items.reduce((s, i) => s + i.qty, 0),
  }), [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
};
