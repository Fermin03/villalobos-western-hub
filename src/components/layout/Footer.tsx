/**
 * FOOTER — 3 columnas desktop, apilado móvil. Fondo oscuro.
 */
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-footer-bg text-footer-fg">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Col 1 — Logo & Social */}
          <div className="space-y-4">
            <div className="flex flex-col leading-none">
              <span className="font-display text-2xl font-bold italic text-footer-fg">Villalobos</span>
              <span className="text-[10px] tracking-[0.35em] uppercase font-body opacity-60">Western Hats</span>
            </div>
            <p className="font-body text-sm opacity-70">{t("footer.tagline")}</p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="opacity-60 hover:opacity-100 transition-opacity"><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook" className="opacity-60 hover:opacity-100 transition-opacity"><Facebook size={20} /></a>
              <a href="#" aria-label="TikTok" className="opacity-60 hover:opacity-100 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="opacity-60 hover:opacity-100 transition-opacity"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Col 2 — Links */}
          <div>
            <h4 className="font-display text-lg mb-4">Links</h4>
            <ul className="font-body text-sm space-y-2 opacity-70">
              <li><Link to="/" className="hover:opacity-100 transition-opacity">{t("nav.home")}</Link></li>
              <li><Link to="/catalogo" className="hover:opacity-100 transition-opacity">{t("nav.hats")}</Link></li>
              <li><Link to="/marcas" className="hover:opacity-100 transition-opacity">{t("nav.brands")}</Link></li>
              <li><Link to="/mayoreo" className="hover:opacity-100 transition-opacity">{t("nav.wholesale")}</Link></li>
              <li><Link to="/envios" className="hover:opacity-100 transition-opacity">{t("nav.shipping")}</Link></li>
              <li><Link to="/devoluciones" className="hover:opacity-100 transition-opacity">{t("footer.returns")}</Link></li>
              <li><Link to="/faq" className="hover:opacity-100 transition-opacity">{t("footer.faq")}</Link></li>
              <li><Link to="/contacto" className="hover:opacity-100 transition-opacity">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          {/* Col 3 — Contact & Payment */}
          <div className="space-y-4">
            <h4 className="font-display text-lg">WhatsApp</h4>
            <a href="https://wa.me/524776385016" className="font-body text-sm opacity-70 hover:opacity-100 transition-opacity block">
              +52 477 638 5016
            </a>
            <p className="font-body text-sm opacity-70">info@villaloboswestern.com</p>
            <div className="flex gap-3 mt-4 items-center flex-wrap">
              <img src="/images/payments/VISA-SVG.webp" alt="Visa" className="h-7 opacity-80 hover:opacity-100 transition-opacity" />
              <img src="/images/payments/MASTERCARD-SVG.webp" alt="Mastercard" className="h-7 opacity-80 hover:opacity-100 transition-opacity" />
              <img src="/images/payments/AMERICAN EXPRESS-SVG.webp" alt="American Express" className="h-7 opacity-80 hover:opacity-100 transition-opacity" />
              <img src="/images/payments/APPLE PAY-SVG.webp" alt="Apple Pay" className="h-7 opacity-80 hover:opacity-100 transition-opacity" />
              <img src="/images/payments/GOOGLE PAY-SVG.webp" alt="Google Pay" className="h-7 opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-footer-fg/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs opacity-50 text-center">{t("footer.copyright")}</p>
          <div className="flex gap-4 font-body text-xs opacity-50">
            <Link to="/privacidad" className="hover:opacity-100">{t("footer.privacy")}</Link>
            <Link to="/terminos" className="hover:opacity-100">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
