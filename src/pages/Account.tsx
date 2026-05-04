import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  address_line1: z.string().trim().max(200).optional().or(z.literal("")),
  address_line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  postal_code: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
});

type Profile = z.infer<typeof profileSchema>;

export default function Account() {
  const { user, loading, signOut } = useAuth();
  const [p, setP] = useState<Profile>({
    full_name: "", phone: "", address_line1: "", address_line2: "",
    city: "", state: "", postal_code: "", country: "India",
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = "My Account — ANITROH STORE"; }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) setP({
        full_name: data.full_name ?? "", phone: data.phone ?? "",
        address_line1: data.address_line1 ?? "", address_line2: data.address_line2 ?? "",
        city: data.city ?? "", state: data.state ?? "",
        postal_code: data.postal_code ?? "", country: data.country ?? "India",
      });
      const { data: o } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
      setOrders(o ?? []);
    })();
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try { profileSchema.parse(p); } catch (err: any) {
      toast.error(err.errors?.[0]?.message ?? "Invalid input"); return;
    }
    setBusy(true);
    const { error } = await supabase.from("profiles").update(p).eq("id", user.id);
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Profile saved");
  };

  const field = (k: keyof Profile, label: string, type = "text") => (
    <div>
      <label className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground block mb-2">{label}</label>
      <input type={type} value={p[k] ?? ""} onChange={(e) => setP({ ...p, [k]: e.target.value })}
        className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container-edit py-12 md:py-16">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="eyebrow mb-3">My Account</div>
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight">{p.full_name || user.email}</h1>
            <p className="text-muted-foreground text-sm mt-2">{user.email}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/wishlist" className="border border-border px-5 py-3 text-[11px] tracking-[0.22em] uppercase hover:bg-secondary">Wishlist</Link>
            <button onClick={signOut} className="border border-border px-5 py-3 text-[11px] tracking-[0.22em] uppercase hover:bg-secondary">Sign out</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <form onSubmit={save} className="lg:col-span-2 space-y-5">
            <h2 className="font-serif text-2xl mb-4">Profile & Shipping</h2>
            {field("full_name", "Full name")}
            {field("phone", "Phone", "tel")}
            {field("address_line1", "Address line 1")}
            {field("address_line2", "Address line 2")}
            <div className="grid grid-cols-2 gap-4">
              {field("city", "City")}
              {field("state", "State")}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("postal_code", "Postal code")}
              {field("country", "Country")}
            </div>
            <button disabled={busy} className="bg-primary text-primary-foreground px-8 py-3.5 text-[11px] tracking-[0.22em] uppercase hover:bg-gold hover:text-primary disabled:opacity-50">
              {busy ? "Saving…" : "Save Changes"}
            </button>
          </form>

          <div>
            <h2 className="font-serif text-2xl mb-4">Orders</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="border border-border p-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>#{o.id.slice(0, 8)}</span>
                      <span className="uppercase tracking-[0.2em]">{o.status}</span>
                    </div>
                    <div className="font-serif text-lg mt-2">${Number(o.total).toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(o.created_at).toLocaleDateString()} · {o.order_items?.length ?? 0} items
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
