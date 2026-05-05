import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import anitrohLogo from "@/assets/anitroh-logo.png";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="container-edit py-20 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <img src={anitrohLogo} alt="Anitroh" className="h-12 w-auto object-contain mb-5 brightness-0 invert" />
          <p className="text-sm text-primary-foreground/65 leading-relaxed max-w-xs">
            A premium lifestyle house — clothing, footwear and considered wellness, crafted to outlast the season.
          </p>
          <div className="flex gap-4 mt-7">
            {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="hover:text-gold transition-colors" aria-label="social">
                <Icon className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "House", links: ["About Us", "Sustainability", "Journal", "Press"] },
          { title: "Care", links: ["Contact", "Shipping", "Returns", "Size Guide"] },
          { title: "Legal", links: ["Privacy Policy", "Terms & Conditions", "Cookies", "Accessibility"] },
        ].map((col) => (
          <div key={col.title}>
            <div className="eyebrow text-primary-foreground/50 mb-5">{col.title}</div>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l}><Link to="#" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-edit py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-primary-foreground/55">
          <div>© {new Date().getFullYear()} ANITROH STORE. All rights reserved.</div>
          <div>Crafted with intention.</div>
        </div>
      </div>
    </footer>
  );
}
