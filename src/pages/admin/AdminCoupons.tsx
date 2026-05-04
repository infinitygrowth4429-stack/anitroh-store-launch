import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";

const TYPES = ["percentage", "fixed", "free_shipping", "bogo"] as const;
type Coupon = {
  id: string; code: string; description: string | null; type: typeof TYPES[number];
  value: number; min_order_value: number; max_discount: number | null;
  usage_limit: number | null; used_count: number; active: boolean;
  starts_at: string | null; expires_at: string | null;
};

const empty = {
  code: "", description: "", type: "percentage" as const, value: 10,
  min_order_value: 0, max_discount: null as number | null,
  usage_limit: null as number | null, active: true,
  starts_at: null as string | null, expires_at: null as string | null,
};

export default function AdminCoupons() {
  const [list, setList] = useState<Coupon[]>([]);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setList((data as Coupon[]) ?? []);
  };
  useEffect(() => { document.title = "Coupons · Admin"; load(); }, []);

  const create = async () => {
    if (!form.code.trim()) return toast.error("Code required");
    const { error } = await supabase.from("coupons").insert({ ...form, code: form.code.toUpperCase().trim() });
    if (error) return toast.error(error.message);
    toast.success("Coupon created");
    setForm(empty); load();
  };

  const toggle = async (c: Coupon) => {
    await supabase.from("coupons").update({ active: !c.active }).eq("id", c.id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete coupon?")) return;
    await supabase.from("coupons").delete().eq("id", id);
    load();
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Marketing</div>
        <h1 className="font-serif text-4xl tracking-tight">Coupons</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border border-border">
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-4">Code</th><th className="text-left p-4">Type</th>
                <th className="text-left p-4">Value</th><th className="text-left p-4">Used</th>
                <th className="text-left p-4">Status</th><th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-4 font-mono">{c.code}</td>
                  <td className="p-4 text-xs">{c.type}</td>
                  <td className="p-4">{c.type === "percentage" ? `${c.value}%` : c.type === "fixed" ? `$${c.value}` : "—"}</td>
                  <td className="p-4 text-xs">{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ""}</td>
                  <td className="p-4">
                    <button onClick={() => toggle(c)} className={`text-[10px] tracking-[0.18em] uppercase px-2 py-1 ${c.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {c.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => remove(c.id)} className="text-xs text-muted-foreground hover:text-destructive">Delete</button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">No coupons yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="border border-border p-5 space-y-3 h-fit">
          <h2 className="font-serif text-xl mb-2">New Coupon</h2>
          <Field label="Code"><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className={inp} /></Field>
          <Field label="Description"><input value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp} /></Field>
          <Field label="Type">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className={inp}>
              {TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
            </select>
          </Field>
          {(form.type === "percentage" || form.type === "fixed") && (
            <Field label={form.type === "percentage" ? "Percent off" : "Amount off ($)"}>
              <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className={inp} />
            </Field>
          )}
          <Field label="Min order value ($)">
            <input type="number" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: Number(e.target.value) })} className={inp} />
          </Field>
          <Field label="Usage limit (blank = unlimited)">
            <input type="number" value={form.usage_limit ?? ""} onChange={(e) => setForm({ ...form, usage_limit: e.target.value ? Number(e.target.value) : null })} className={inp} />
          </Field>
          <Field label="Expires at">
            <input type="datetime-local" value={form.expires_at ?? ""} onChange={(e) => setForm({ ...form, expires_at: e.target.value || null })} className={inp} />
          </Field>
          <button onClick={create} className="w-full bg-primary text-primary-foreground py-3 text-[10px] tracking-[0.22em] uppercase hover:bg-gold hover:text-primary mt-2">
            Create coupon
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

const inp = "w-full border border-border bg-transparent px-3 py-2 text-sm";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
