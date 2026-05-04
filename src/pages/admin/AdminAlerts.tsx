import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function AdminAlerts() {
  const [low, setLow] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Low Stock · Admin";
    supabase.from("inventory").select("*").then(({ data }) => {
      const filtered = (data ?? []).filter((i: any) => i.stock <= i.low_stock_threshold);
      setLow(filtered);
    });
  }, []);

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center gap-3">
        <AlertTriangle className="h-7 w-7 text-gold" />
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">Inventory</div>
          <h1 className="font-serif text-4xl tracking-tight">Low Stock Alerts</h1>
        </div>
      </div>

      {low.length === 0 ? (
        <div className="border border-border p-12 text-center text-muted-foreground">
          All inventory levels are healthy. ✓
        </div>
      ) : (
        <div className="border border-border">
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              <tr><th className="text-left p-4">Product</th><th className="text-left p-4">Variant</th><th className="text-left p-4">Stock</th><th className="text-left p-4">Threshold</th><th className="p-4"></th></tr>
            </thead>
            <tbody>
              {low.map((row) => {
                const p = productMap[row.product_id];
                return (
                  <tr key={row.id} className="border-t border-border">
                    <td className="p-4 flex items-center gap-3">
                      {p?.image && <img src={p.image} alt="" className="w-10 h-12 object-cover" />}
                      <span>{p?.name ?? row.product_id}</span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">{[row.size, row.color].filter(Boolean).join(" · ") || "—"}</td>
                    <td className="p-4"><span className={`font-medium ${row.stock === 0 ? "text-destructive" : "text-gold"}`}>{row.stock}</span></td>
                    <td className="p-4 text-muted-foreground">{row.low_stock_threshold}</td>
                    <td className="p-4 text-right"><Link to="/admin/inventory" className="text-[10px] tracking-[0.22em] uppercase underline-grow">Restock</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
