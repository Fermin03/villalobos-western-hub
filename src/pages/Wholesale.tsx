/**
 * MAYOREO — Beneficios, tabla de descuentos y formulario.
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DollarSign, Package, Globe } from "lucide-react";

const Wholesale = () => {
  const { t } = useLanguage();
  const benefits = [
    { key: "benefit1", icon: DollarSign },
    { key: "benefit2", icon: Package },
    { key: "benefit3", icon: Globe },
  ];
  const ranges = [
    { range: "10-25", discount: "10%" },
    { range: "26-50", discount: "15%" },
    { range: "51-100", discount: "20%" },
    { range: "100+", discount: "25%" },
  ];

  return (
    <div>
      <section className="py-16 text-center">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{t("wholesale.title")}</h1>
          <p className="font-body text-muted-foreground">{t("wholesale.subtitle")}</p>
        </div>
      </section>
      <section className="pb-16">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {benefits.map((b) => (
            <div key={b.key} className="bg-card rounded-lg p-6 text-center">
              <b.icon size={32} className="mx-auto mb-3 text-accent" />
              <h3 className="font-display text-lg mb-2">{t(`wholesale.${b.key}.title`)}</h3>
              <p className="font-body text-sm text-muted-foreground">{t(`wholesale.${b.key}.text`)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="pb-16">
        <div className="container max-w-lg mx-auto">
          <table className="w-full font-body text-sm">
            <thead><tr className="border-b border-border"><th className="py-3 text-left">{t("wholesale.table.range")}</th><th className="py-3 text-right">{t("wholesale.table.discount")}</th></tr></thead>
            <tbody>{ranges.map((r) => (<tr key={r.range} className="border-b border-border"><td className="py-3">{r.range} piezas</td><td className="py-3 text-right font-semibold text-accent">{r.discount}</td></tr>))}</tbody>
          </table>
        </div>
      </section>
      <section className="pb-16">
        <div className="container max-w-lg mx-auto">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {[
              { id: "name", label: t("wholesale.form.name") },
              { id: "company", label: t("wholesale.form.company") },
              { id: "email", label: t("wholesale.form.email"), type: "email" },
              { id: "phone", label: t("wholesale.form.phone"), type: "tel" },
            ].map((f) => (
              <div key={f.id}>
                <label className="font-body text-sm font-medium mb-1 block">{f.label}</label>
                <input type={f.type || "text"} className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background" />
              </div>
            ))}
            <div>
              <label className="font-body text-sm font-medium mb-1 block">{t("wholesale.form.country")}</label>
              <select className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background">
                <option>México</option><option>USA</option><option>Canadá</option>
              </select>
            </div>
            <div>
              <label className="font-body text-sm font-medium mb-1 block">{t("wholesale.form.brand")}</label>
              <select className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background">
                <option>{t("wholesale.form.brand.all")}</option><option>Domador</option><option>Rocha Hats</option><option>Villalobos Hats</option>
              </select>
            </div>
            <div>
              <label className="font-body text-sm font-medium mb-1 block">{t("wholesale.form.volume")}</label>
              <input type="text" className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background" />
            </div>
            <div>
              <label className="font-body text-sm font-medium mb-1 block">{t("wholesale.form.message")}</label>
              <textarea rows={4} className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background resize-none" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-primary text-primary-foreground font-body font-medium text-sm rounded hover:opacity-90 transition-opacity">{t("wholesale.form.submit")}</button>
          </form>
        </div>
      </section>
    </div>
  );
};
export default Wholesale;
