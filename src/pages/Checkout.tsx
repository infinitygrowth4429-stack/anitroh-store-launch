import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { toast } from "sonner";

const schema = z.object({
  ship_name: z.string().trim().min(1).max(100),
  ship_phone: z.string().trim().min(5).max(20),
  ship_address_line1: z.string().trim().min(1).max(200),
  ship_address_line2: z.string().trim().max(200).optional().or(z.literal("")),
  ship_city: z.string().trim().min(1).max(100),
  ship_state: z.string().trim().min(1).max(100),
  ship_postal_code: z.string().trim().min(1).max(20),
  ship_country: z.string().trim().min(1).max(100),
});

export default function Checkout() {
  const { user, loading } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    ship_name: "", ship_phone: "", ship_address_line1: "", ship_address_line2: "",
    ship_city: "", ship_state: "", ship_postal_code: "", ship_country: "India",
  });
  const [payment, setPayment] = useState<"cod" | "upi" | "card">("cod");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<any | null>(null);

  const discount = (() => {
    if (!coupon) return 0;
    if (coupon.type === "percentage") {
      const d = (total * Number(coupon.value)) / 100;
      return coupon.max_discount ? Math.min(d, Number(coupon.max_discount)) : d;
    }
    if (coupon.type === "fixed") return Math.min(Number(coupon.value), total);
    return 0;
  })();
  const grandTotal = Math.max(0, total - discount);

  const applyCoupon = async () => {
    const code = couponCode.toUpperCase().trim();
    if (!code) return;
    const { data, error } = await supabase.from("coupons").select("*").eq("code", code).eq("active", true).maybeSingle();
    if (error || !data) return toast.error("Invalid coupon");
    if (data.expires_at && new Date(data.expires_at) < new Date()) return toast.error("Coupon expired");
    if (data.usage_limit && data.used_count >= data.usage_limit) return toast.error("Coupon limit reached");
    if (Number(data.min_order_value) > total) return toast.error(`Min order $${data.min_order_value}`);
    setCoupon(data);
    toast.success(`Applied: ${data.code}`);
  };

  useEffect(() => { document.title = "Checkout — ANITROH STORE"; }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setForm({
        ship_name: data.full_name ?? "", ship_phone: data.phone ?? "",
        ship_address_line1: data.address_line1 ?? "", ship_address_line2: data.address_line2 ?? "",
        ship_city: data.city ?? "", ship_state: data.state ?? "",
        ship_postal_code: data.postal_code ?? "", ship_country: data.country ?? "India",
      });
    });
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (items.length === 0) return <Navigate to="/" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { schema.parse(form); } catch (err: any) {
      toast.error(err.errors?.[0]?.message ?? "Please complete shipping details"); return;
    }
    setBusy(true);
    const { data: order, error } = await supabase.from("orders").insert({
      user_id: user.id, total: grandTotal, payment_method: payment, status: "pending",
      coupon_code: coupon?.code ?? null, discount_amount: discount, ...form,
    }).select().single();
    if (error || !order) { toast.error(error?.message ?? "Order failed"); setBusy(false); return; }

    const { error: e2 } = await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id, product_id: i.product.id, name: i.product.name,
        price: i.product.price, qty: i.qty, size: i.size, color: i.color, image: i.product.image,
      }))
    );
    if (e2) { toast.error(e2.message); setBusy(false); return; }

    clear();
    toast.success("Order placed.");
    navigate("/account");
  };

  const f = (k: keyof typeof form, label: string, type = "text") => (
    <div>
      <label className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground block mb-2">{label}</label>
      <input type={type} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container-edit py-12 md:py-16">
        <div className="text-center mb-12">
          <div className="eyebrow mb-3">Final step</div>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <form onSubmit={submit} className="lg:col-span-2 space-y-5">
            <h2 className="font-serif text-2xl mb-2">Shipping</h2>
            {f("ship_name", "Full name")}
            {f("ship_phone", "Phone", "tel")}
            {f("ship_address_line1", "Address line 1")}
            {f("ship_address_line2", "Address line 2")}
            <div className="grid grid-cols-2 gap-4">{f("ship_city", "City")}{f("ship_state", "State")}</div>
            <div className="grid grid-cols-2 gap-4">{f("ship_postal_code", "Postal code")}{f("ship_country", "Country")}</div>

            <h2 className="font-serif text-2xl mt-8 mb-2">Payment</h2>
            <div className="space-y-2">
              {(["cod", "upi", "card"] as const).map((m) => (
                <label key={m} className={`flex items-center gap-3 border p-4 cursor-pointer ${payment === m ? "border-gold" : "border-border"}`}>
                  <input type="radio" checked={payment === m} onChange={() => setPayment(m)} />
                  <span className="text-sm uppercase tracking-[0.18em]">
                    {m === "cod" ? "Cash on Delivery" : m === "upi" ? "UPI (Manual)" : "Card (Manual)"}
                  </span>
                </label>
              ))}
            </div>

            <button disabled={busy} className="w-full bg-primary text-primary-foreground py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-gold hover:text-primary disabled:opacity-50 mt-6">
              {busy ? "Placing order…" : `Place Order · $${total.toFixed(2)}`}
            </button>
          </form>

          <aside className="border border-border p-6 h-fit">
            <h3 className="font-serif text-xl mb-4">Order Summary</h3>
            <div className="divide-y divide-border/60">
              {items.map((it) => (
                <div key={it.product.id + it.size + it.color} className="py-3 flex gap-3">
                  <img src={it.product.image} alt={it.product.name} className="w-14 h-16 object-cover" />
                  <div className="flex-1 text-sm">
                    <div className="font-serif">{it.product.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {it.qty}</div>
                  </div>
                  <div className="text-sm">${(it.product.price * it.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 border-t border-border mt-4 text-sm">
              <span>Total</span><span className="font-medium">${total.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
