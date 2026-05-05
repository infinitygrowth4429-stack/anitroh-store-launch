import { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = "Contact Us — Anitroh Store"; }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try { contactSchema.parse(form); } catch (err: any) {
      toast.error(err.errors?.[0]?.message ?? "Invalid input"); return;
    }
    setBusy(true);
    const subject = encodeURIComponent(`Contact form — ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:rohitaipowered@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setBusy(false);
      toast.success("Opening your email client…");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container-edit py-12 md:py-16">
        <div className="mb-12">
          <div className="eyebrow mb-3">Get in touch</div>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground text-sm mt-3 max-w-xl">
            Questions about an order, product, or partnership? Send us a note and we'll respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <form onSubmit={submit} className="lg:col-span-2 space-y-5">
            <div>
              <label className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground block mb-2">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100}
                className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground block mb-2">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255}
                  className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground block mb-2">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20}
                  className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground block mb-2">Message</label>
              <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000}
                className="w-full border border-border bg-transparent px-3 py-2.5 text-sm focus:border-gold outline-none resize-none" />
            </div>
            <button disabled={busy} className="bg-primary text-primary-foreground px-8 py-3.5 text-[11px] tracking-[0.22em] uppercase hover:bg-gold hover:text-primary disabled:opacity-50">
              {busy ? "Sending…" : "Send Message"}
            </button>
          </form>

          <aside className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl mb-4">Reach us directly</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <a href="tel:+917283037538" className="hover:text-gold transition-colors">+91 72830 37538</a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <a href="mailto:rohitaipowered@gmail.com" className="hover:text-gold transition-colors break-all">rohitaipowered@gmail.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <span>Lakhibhag, Gaya, Bihar, India</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="eyebrow mb-3">Find us</div>
              <div className="aspect-square w-full overflow-hidden border border-border">
                <iframe
                  title="Anitroh Store location"
                  src="https://www.google.com/maps?q=24.789667,85.020389&hl=en&z=16&output=embed"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                />
              </div>
              <a
                href="https://www.google.com/maps?q=24.789667,85.020389"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-[10px] tracking-[0.22em] uppercase underline-grow"
              >
                Open in Google Maps →
              </a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
