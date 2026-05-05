import { useEffect } from "react";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

export default function Privacy() {
  useEffect(() => { document.title = "Privacy Policy — Anitroh Store"; }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container-edit py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="eyebrow mb-3">Legal</div>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground tracking-wider uppercase mb-12">
            Last Updated: 5 May 2026 · www.anitroh.com
          </p>

          <div className="space-y-10 text-[15px] leading-relaxed text-foreground/85">
            <p>
              Welcome to Anitroh (www.anitroh.com). Your privacy is important to us. This Privacy Policy
              explains how we collect, use, and protect your information when you visit or make a purchase
              from our website.
            </p>

            <section>
              <h2 className="font-serif text-2xl mb-3 text-foreground">1. Information We Collect</h2>
              <p>When you use our website, we may collect the following types of information:</p>
              <h3 className="mt-4 mb-2 text-sm tracking-[0.2em] uppercase text-muted-foreground">a) Personal Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name</li><li>Email address</li><li>Phone number</li>
                <li>Shipping and billing address</li>
                <li>Payment details (processed securely via third-party providers)</li>
              </ul>
              <h3 className="mt-4 mb-2 text-sm tracking-[0.2em] uppercase text-muted-foreground">b) Non-Personal Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Browser type</li><li>Device information</li><li>IP address</li>
                <li>Pages visited and time spent</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-3 text-foreground">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To process and deliver your orders</li>
                <li>To communicate with you (order updates, support)</li>
                <li>To improve our website and user experience</li>
                <li>To send promotional offers (only if you opt-in)</li>
                <li>To prevent fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-3 text-foreground">3. Products We Sell</h2>
              <p>We sell a variety of products including:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Apparel for men and women</li>
                <li>Water bottles</li>
                <li>Shoes</li>
                <li>Shoe cleaning products (shoe washers)</li>
                <li>Decorative items</li>
              </ul>
              <p className="mt-3">Your data is used strictly to fulfill purchases related to these products.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-3 text-foreground">4. Sharing of Information</h2>
              <p>We do not sell your personal data. However, we may share your information with:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Delivery partners (for shipping orders)</li>
                <li>Payment gateways (for secure transactions)</li>
                <li>Service providers (website hosting, analytics)</li>
              </ul>
              <p className="mt-3">These third parties are obligated to keep your data secure.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-3 text-foreground">5. Cookies Policy</h2>
              <p>We use cookies to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Enhance website functionality</li>
                <li>Remember your preferences</li>
                <li>Analyze traffic and performance</li>
              </ul>
              <p className="mt-3">You can disable cookies in your browser settings if you prefer.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-3 text-foreground">6. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your data. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-3 text-foreground">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Access your personal data</li>
                <li>Request correction or deletion</li>
                <li>Opt out of marketing emails</li>
              </ul>
              <p className="mt-3">To exercise these rights, contact us at the email below.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-3 text-foreground">8. Third-Party Links</h2>
              <p>Our website may contain links to other websites. We are not responsible for their privacy practices.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-3 text-foreground">9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-3 text-foreground">10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, you can contact us:</p>
              <ul className="list-none pl-0 space-y-1 mt-3">
                <li><span className="text-muted-foreground">Email:</span> <a href="mailto:rohitaipowered@gmail.com" className="hover:text-gold">rohitaipowered@gmail.com</a></li>
                <li><span className="text-muted-foreground">Phone:</span> <a href="tel:+917283037538" className="hover:text-gold">+91 72830 37538</a></li>
                <li><span className="text-muted-foreground">Address:</span> Lakhibhag, Gaya, Bihar</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
