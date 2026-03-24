import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown } from "lucide-react";

const shippingFaqs: Record<string, Record<"es"|"en", string>>[] = [
  { q: { es: "¿Cuánto tarda el envío?", en: "How long does shipping take?" }, a: { es: "México 3-5 días, EUA 7-12 días, Canadá 10-15 días.", en: "Mexico 3-5 days, USA 7-12 days, Canada 10-15 days." } },
  { q: { es: "¿El envío es gratis?", en: "Is shipping free?" }, a: { es: "Gratis en México para compras mayores a $1,500 MXN.", en: "Free in Mexico for orders over $1,500 MXN." } },
  { q: { es: "¿Puedo rastrear mi pedido?", en: "Can I track my order?" }, a: { es: "Sí, recibirás un número de seguimiento por email.", en: "Yes, you'll receive a tracking number by email." } },
  { q: { es: "¿Hacen envíos internacionales?", en: "Do you ship internationally?" }, a: { es: "Sí, a México, Estados Unidos y Canadá.", en: "Yes, to Mexico, USA and Canada." } },
  { q: { es: "¿Qué pasa si mi paquete se pierde?", en: "What if my package is lost?" }, a: { es: "Contáctanos y te enviaremos un reemplazo o reembolso.", en: "Contact us and we'll send a replacement or refund." } },
];

const Shipping = () => {
  const { t, lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const countries = [
    { title: t("shipping.mx.title"), time: t("shipping.mx.time"), cost: t("shipping.mx.free"), emoji: "🇲🇽" },
    { title: t("shipping.us.title"), time: t("shipping.us.time"), cost: t("shipping.us.cost"), emoji: "🇺🇸" },
    { title: t("shipping.ca.title"), time: t("shipping.ca.time"), cost: t("shipping.ca.cost"), emoji: "🇨🇦" },
  ];

  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl font-bold text-center mb-10">{t("shipping.title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-3xl mx-auto">
        {countries.map((c) => (
          <div key={c.title} className="bg-card rounded-lg p-6 text-center">
            <span className="text-3xl mb-3 block">{c.emoji}</span>
            <h3 className="font-display text-lg mb-2">{c.title}</h3>
            <p className="font-body text-sm text-muted-foreground mb-1">{c.time}</p>
            <p className="font-body text-sm text-accent font-medium">{c.cost}</p>
          </div>
        ))}
      </div>
      <div className="max-w-lg mx-auto mb-16">
        <h2 className="font-display text-xl mb-4 text-center">{t("shipping.track.title")}</h2>
        <div className="flex gap-2">
          <input placeholder={t("shipping.track.placeholder")} className="flex-1 px-4 py-2.5 border border-border rounded font-body text-sm bg-background" />
          <button className="px-6 py-2.5 bg-primary text-primary-foreground font-body text-sm rounded">{t("shipping.track.btn")}</button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-xl mb-6 text-center">{t("shipping.faq.title")}</h2>
        {shippingFaqs.map((faq, i) => (
          <div key={i} className="border-b border-border">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-4 font-body text-sm font-medium">
              {faq.q[lang]} <ChevronDown size={16} className={`transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
            </button>
            {openFaq === i && <p className="pb-4 font-body text-sm text-muted-foreground">{faq.a[lang]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Shipping;
