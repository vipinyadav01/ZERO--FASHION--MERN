import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets";
import {
  Facebook, Instagram, Twitter, Linkedin, Youtube,
  Mail, Phone, MapPin, ArrowUp, ArrowRight,
} from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// ── Internal nav link
const NavLink = memo(({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-xs text-brand-text-secondary hover:text-brand-text-primary transition-colors font-medium uppercase tracking-wide"
    >
      {children}
    </Link>
  </li>
));
NavLink.displayName = "NavLink";

// ── Social icon button
const SocialIcon = memo(({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="p-2.5 border border-brand-border text-brand-text-secondary hover:text-brand-text-primary hover:border-[#1A1A1A] transition-colors"
  >
    <Icon size={16} />
  </a>
));
SocialIcon.displayName = "SocialIcon";

// ── Scroll to top
const ScrollToTop = () => (
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="fixed bottom-24 md:bottom-10 right-4 md:right-8 bg-[#1A1A1A] text-white p-3 border border-[#1A1A1A] z-50 hover:bg-black transition-colors"
    aria-label="Scroll to top"
  >
    <ArrowUp size={18} />
  </button>
);

// ── Footer newsletter (mini version)
const FooterNewsletter = memo(() => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/newsletter/subscribe`, { email });
      if (res.data?.success) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(res.data?.message || "Subscription failed.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg?.toLowerCase().includes("already")) {
        toast.info("You're already subscribed.");
      } else {
        toast.error("Failed to subscribe. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 max-w-md">
      <p className="text-xs font-black text-brand-text-primary uppercase tracking-widest mb-3">
        Newsletter
      </p>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={loading}
          className="flex-1 px-4 py-3 border border-brand-border border-r-0 text-xs text-brand-text-primary placeholder:text-brand-text-secondary/50 bg-white focus:outline-none focus:border-black transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-[#1A1A1A] text-white text-[9px] font-black uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-60 flex items-center gap-1.5"
        >
          {loading ? "..." : <><span>Join</span><ArrowRight className="w-3 h-3" /></>}
        </button>
      </form>
    </div>
  );
});
FooterNewsletter.displayName = "FooterNewsletter";

// ── Main Footer
const Footer = () => {
  const year = new Date().getFullYear();

  const companyLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/collection", label: "Shop" },
    { to: "/track-order", label: "Track Order" },
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/support", label: "Support" },
  ];

  const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Linkedin, label: "LinkedIn" },
    { href: "#", icon: Youtube, label: "YouTube" },
  ];

  return (
    <footer className="bg-white border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-32 md:pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

          {/* Brand column */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img src={assets.logo} alt="Zero Fashion" className="w-10 object-contain" />
              <div>
                <p className="text-sm font-black text-brand-text-primary uppercase tracking-tight leading-none">Zero</p>
                <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">Fashion</p>
              </div>
            </div>

            <p className="text-xs text-brand-text-secondary leading-relaxed max-w-sm mb-8">
              Where style meets sustainability. Discover trendy, eco-friendly apparel designed
              to elevate your wardrobe while caring for the planet.
            </p>

            <FooterNewsletter />

            <div className="flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <SocialIcon key={s.label} href={s.href} icon={s.icon} label={s.label} />
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <p className="text-[9px] font-black text-brand-text-primary uppercase tracking-[0.2em] mb-5">Company</p>
            <ul className="space-y-3">
              {companyLinks.map((l) => (
                <NavLink key={l.label} to={l.to}>{l.label}</NavLink>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[9px] font-black text-brand-text-primary uppercase tracking-[0.2em] mb-5">Contact</p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="p-2 bg-[#F8F8F6] border border-brand-border shrink-0">
                  <Phone size={13} className="text-brand-text-primary" />
                </div>
                <span className="text-xs text-brand-text-secondary">+91 99185 72513</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-[#F8F8F6] border border-brand-border shrink-0">
                  <Mail size={13} className="text-brand-text-primary" />
                </div>
                <a
                  href="mailto:VipinYadav9m@gmail.com"
                  className="text-xs text-brand-text-secondary hover:text-brand-text-primary transition-colors break-all"
                >
                  VipinYadav9m@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-[#F8F8F6] border border-brand-border shrink-0 mt-0.5">
                  <MapPin size={13} className="text-brand-text-primary" />
                </div>
                <span className="text-xs text-brand-text-secondary leading-relaxed">
                  123 Fashion Street,<br />Design District, 12345, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-brand-text-secondary font-medium">
            &copy; {year} Zero Fashion — All Rights Reserved.
          </p>
          <p className="text-[10px] text-brand-text-secondary">
            Built by <span className="font-black text-brand-text-primary">vipinyadav01</span>
          </p>
        </div>
      </div>

      <ScrollToTop />
    </footer>
  );
};

export default memo(Footer);
