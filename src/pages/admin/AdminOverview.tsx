import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Link } from "react-router-dom";

type Stats = { orders: number; revenue: number; pending: number; lowStock: number; coupons: number };

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({ orders: 0, revenue: 0, pending: 0, lowStock: 0, coupons: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Admin · ANITROH STORE";
    (async () => {
      const [{ data: orders }, { data: inv }, { data: cps }] = await Promise.all([
        supabase.from("orders").select("id, total, status, created_at, ship_name").order("created_at", { ascending: false }),
        supabase.from("inventory").select("stock, low_stock_threshold"),
        supabase.from("coupons").select("id").eq("active", true),
      ]);
      const list = orders ?? [];
      setStats({
        orders: list.length,
        revenue: list.reduce((s, o: any) => s + Number(o.total ?? 0), 0),
        pending: list.filter((o: any) => o.status === "pending").length,
        lowStock: (inv ?? []).filter((i: any) => i.stock <= i.low_stock_threshold).length,
        coupons: (cps ?? []).length,
      });
      setRecent(list.slice(0, 6));
    })();
  }, []);

  const cards = [
    { label: "Total Orders", value: stats.orders },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}` },
    { label: "Pending", value: stats.pending },
    { label: "Low Stock", value: stats.lowStock },
    { label: "Active Coupons", value: stats.coupons },
  ];

  return (
    <AdminLayout>
      <div className="mb-10">
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Dashboard</div>
        <h1 className="font-serif text-4xl tracking-tight">Overview</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {cards.map((c) => (
          <div key={c.label} className="border border-border p-5">
            <div className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">{c.label}</div>
            <div className="font-serif text-3xl mt-2">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-serif text-xl">Recent Orders</h2>
          <Link to="/admin/orders" className="text-[10px] tracking-[0.22em] uppercase underline-grow">View all</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            <tr><th className="text-left p-4">Order</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Status</th><th className="text-right p-4">Total</th></tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="p-4 font-mono text-xs">{o.id.slice(0, 8)}</td>
                <td className="p-4">{o.ship_name}</td>
                <td className="p-4"><span className="text-[10px] tracking-[0.18em] uppercase px-2 py-1 bg-muted">{o.status}</span></td>
                <td className="p-4 text-right">${Number(o.total).toFixed(2)}</td>
              </tr>
            ))}
            {recent.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground text-sm">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
