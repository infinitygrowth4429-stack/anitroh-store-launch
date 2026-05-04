import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [items, setItems] = useState<Record<string, any[]>>({});

  const load = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data ?? []);
  };
  useEffect(() => { document.title = "Orders · Admin"; load(); }, []);

  const toggle = async (id: string) => {
    if (open === id) { setOpen(null); return; }
    setOpen(id);
    if (!items[id]) {
      const { data } = await supabase.from("order_items").select("*").eq("order_id", id);
      setItems((p) => ({ ...p, [id]: data ?? [] }));
    }
  };

  const update = async (id: string, patch: Record<string, any>) => {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    load();
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <AdminLayout>
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Manage</div>
          <h1 className="font-serif text-4xl tracking-tight">Orders</h1>
        </div>
        <div className="flex gap-1 flex-wrap">
          {["all", ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[10px] tracking-[0.2em] uppercase px-3 py-2 border ${filter === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-border">
        {filtered.map((o) => (
          <div key={o.id} className="border-b border-border last:border-b-0">
            <button onClick={() => toggle(o.id)} className="w-full grid grid-cols-12 gap-4 p-4 text-sm text-left hover:bg-muted/40">
              <div className="col-span-3 md:col-span-2 font-mono text-xs">#{o.id.slice(0, 8)}</div>
              <div className="col-span-5 md:col-span-3">{o.ship_name}</div>
              <div className="hidden md:block md:col-span-2 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</div>
              <div className="col-span-2"><span className="text-[10px] tracking-[0.18em] uppercase px-2 py-1 bg-muted">{o.status}</span></div>
              <div className="col-span-2 md:col-span-2 text-right">${Number(o.total).toFixed(2)}</div>
              <div className="hidden md:block md:col-span-1 text-right text-muted-foreground text-xs">{o.tracking_number ? "📦" : ""}</div>
            </button>

            {open === o.id && (
              <div className="bg-muted/30 p-6 grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif text-lg mb-3">Items</h3>
                  <div className="space-y-2 text-sm">
                    {(items[o.id] ?? []).map((it) => (
                      <div key={it.id} className="flex gap-3 items-center">
                        {it.image && <img src={it.image} alt="" className="w-10 h-12 object-cover" />}
                        <div className="flex-1">
                          <div>{it.name}</div>
                          <div className="text-xs text-muted-foreground">{it.size} {it.color} · Qty {it.qty}</div>
                        </div>
                        <div>${Number(it.price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-serif text-lg mt-6 mb-2">Shipping</h3>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <div>{o.ship_name} · {o.ship_phone}</div>
                    <div>{o.ship_address_line1}{o.ship_address_line2 ? `, ${o.ship_address_line2}` : ""}</div>
                    <div>{o.ship_city}, {o.ship_state} {o.ship_postal_code}</div>
                    <div>{o.ship_country}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground block mb-2">Status</label>
                    <select defaultValue={o.status} onChange={(e) => {
                      const patch: any = { status: e.target.value };
                      if (e.target.value === "shipped" && !o.shipped_at) patch.shipped_at = new Date().toISOString();
                      if (e.target.value === "delivered" && !o.delivered_at) patch.delivered_at = new Date().toISOString();
                      update(o.id, patch);
                    }} className="w-full border border-border bg-transparent px-3 py-2.5 text-sm">
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  <TrackingForm order={o} onSave={(p) => update(o.id, p)} />

                  <div>
                    <label className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground block mb-2">Admin notes</label>
                    <textarea defaultValue={o.admin_notes ?? ""} onBlur={(e) => e.target.value !== (o.admin_notes ?? "") && update(o.id, { admin_notes: e.target.value })}
                      className="w-full border border-border bg-transparent px-3 py-2 text-sm min-h-[80px]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">No orders.</div>}
      </div>
    </AdminLayout>
  );
}

function TrackingForm({ order, onSave }: { order: any; onSave: (p: any) => void }) {
  const [carrier, setCarrier] = useState(order.tracking_carrier ?? "");
  const [num, setNum] = useState(order.tracking_number ?? "");
  const [url, setUrl] = useState(order.tracking_url ?? "");
  return (
    <div className="border border-border p-4 space-y-3">
      <div className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">Tracking</div>
      <input placeholder="Carrier (Delhivery, BlueDart…)" value={carrier} onChange={(e) => setCarrier(e.target.value)}
        className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
      <input placeholder="Tracking number" value={num} onChange={(e) => setNum(e.target.value)}
        className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
      <input placeholder="Tracking URL" value={url} onChange={(e) => setUrl(e.target.value)}
        className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
      <button onClick={() => onSave({ tracking_carrier: carrier, tracking_number: num, tracking_url: url })}
        className="w-full bg-primary text-primary-foreground py-2.5 text-[10px] tracking-[0.22em] uppercase hover:bg-gold hover:text-primary">
        Save tracking
      </button>
    </div>
  );
}
