import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { products } from "@/data/products";
import { toast } from "sonner";

type Inv = { id: string; product_id: string; size: string | null; color: string | null; stock: number; low_stock_threshold: number };

export default function AdminInventory() {
  const [inv, setInv] = useState<Inv[]>([]);
  const [filter, setFilter] = useState("");

  const load = async () => {
    const { data } = await supabase.from("inventory").select("*").order("product_id");
    setInv((data as Inv[]) ?? []);
  };
  useEffect(() => { document.title = "Inventory · Admin"; load(); }, []);

  const upsert = async (productId: string, size: string | null, color: string | null, patch: Partial<Inv>) => {
    const existing = inv.find((i) => i.product_id === productId && i.size === size && i.color === color);
    if (existing) {
      const { error } = await supabase.from("inventory").update(patch).eq("id", existing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("inventory").insert({
        product_id: productId, size, color,
        stock: patch.stock ?? 0, low_stock_threshold: patch.low_stock_threshold ?? 5,
      });
      if (error) return toast.error(error.message);
    }
    load();
  };

  const list = products.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Stock</div>
        <h1 className="font-serif text-4xl tracking-tight">Inventory</h1>
      </div>

      <input placeholder="Search products…" value={filter} onChange={(e) => setFilter(e.target.value)}
        className="w-full max-w-sm mb-6 border border-border bg-transparent px-3 py-2.5 text-sm" />

      <div className="space-y-3">
        {list.map((p) => {
          const rows = inv.filter((i) => i.product_id === p.id);
          return (
            <details key={p.id} className="border border-border">
              <summary className="cursor-pointer p-4 flex items-center gap-4 hover:bg-muted/40">
                <img src={p.image} alt="" className="w-12 h-14 object-cover" />
                <div className="flex-1">
                  <div className="text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.category} · ${p.price}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {rows.length === 0 ? "No stock set" : `${rows.reduce((s, r) => s + r.stock, 0)} units`}
                </div>
              </summary>
              <div className="p-4 border-t border-border space-y-2 bg-muted/20">
                <div className="grid grid-cols-12 gap-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground pb-2">
                  <div className="col-span-3">Size</div><div className="col-span-3">Color</div>
                  <div className="col-span-2">Stock</div><div className="col-span-2">Low alert</div><div className="col-span-2"></div>
                </div>
                <StockRow product={p} existing={rows} onSave={upsert} />
                {rows.map((r) => (
                  <StockRow key={r.id} product={p} initial={r} existing={rows} onSave={upsert} />
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </AdminLayout>
  );
}

function StockRow({ product, initial, onSave }: { product: any; initial?: Inv; existing: Inv[]; onSave: (pid: string, s: string | null, c: string | null, patch: Partial<Inv>) => void }) {
  const [size, setSize] = useState(initial?.size ?? "");
  const [color, setColor] = useState(initial?.color ?? "");
  const [stock, setStock] = useState(initial?.stock ?? 0);
  const [low, setLow] = useState(initial?.low_stock_threshold ?? 5);

  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <select value={size} onChange={(e) => setSize(e.target.value)} disabled={!!initial}
        className="col-span-3 border border-border bg-background px-2 py-1.5 text-sm">
        <option value="">—</option>
        {(product.sizes ?? []).map((s: string) => <option key={s}>{s}</option>)}
      </select>
      <select value={color} onChange={(e) => setColor(e.target.value)} disabled={!!initial}
        className="col-span-3 border border-border bg-background px-2 py-1.5 text-sm">
        <option value="">—</option>
        {(product.colors ?? []).map((c: any) => <option key={c.name}>{c.name}</option>)}
      </select>
      <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))}
        className="col-span-2 border border-border bg-background px-2 py-1.5 text-sm" />
      <input type="number" value={low} onChange={(e) => setLow(Number(e.target.value))}
        className="col-span-2 border border-border bg-background px-2 py-1.5 text-sm" />
      <button onClick={() => onSave(product.id, size || null, color || null, { stock, low_stock_threshold: low })}
        className="col-span-2 bg-primary text-primary-foreground py-1.5 text-[10px] tracking-[0.18em] uppercase">
        {initial ? "Update" : "Add"}
      </button>
    </div>
  );
}
