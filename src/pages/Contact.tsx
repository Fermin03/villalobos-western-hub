import { useLanguage } from "@/contexts/LanguageContext";
import { Instagram, Facebook, Youtube } from "lucide-react";

const Contact = () => {
  const { t } = useLanguage();
  return (
    <div className="container py-12">
      <h1 className="font-display text-3xl font-bold text-center mb-10">{t("contact.title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {[
            { id: "name", label: t("contact.form.name") },
            { id: "email", label: t("contact.form.email"), type: "email" },
            { id: "phone", label: t("contact.form.phone"), type: "tel" },
          ].map((f) => (
            <div key={f.id}>
              <label className="font-body text-sm font-medium mb-1 block">{f.label}</label>
              <input type={f.type || "text"} className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background" />
            </div>
          ))}
          <div>
            <label className="font-body text-sm font-medium mb-1 block">{t("contact.form.subject")}</label>
            <select className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background">
              {["order", "wholesale", "return", "brands", "other"].map((s) => (
                <option key={s}>{t(`contact.form.subject.${s}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-body text-sm font-medium mb-1 block">{t("contact.form.message")}</label>
            <textarea rows={5} className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background resize-none" />
          </div>
          <button type="submit" className="w-full py-3.5 bg-primary text-primary-foreground font-body font-medium text-sm rounded hover:opacity-90 transition-opacity">{t("contact.form.submit")}</button>
        </form>
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-lg mb-2">{t("contact.info.whatsapp")}</h3>
            <a href="https://wa.me/5211234567890" className="font-body text-accent hover:underline">+52 1 123 456 7890</a>
          </div>
          <div>
            <h3 className="font-display text-lg mb-2">{t("contact.info.email")}</h3>
            <p className="font-body text-muted-foreground">info@villaloboswestern.com</p>
          </div>
          <div>
            <h3 className="font-display text-lg mb-2">{t("contact.info.hours")}</h3>
            <p className="font-body text-sm text-muted-foreground whitespace-pre-line">{t("contact.info.hours.text")}</p>
          </div>
          <div>
            <h3 className="font-display text-lg mb-2">{t("contact.info.social")}</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-accent"><Instagram size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-accent"><Facebook size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-accent"><Youtube size={20} /></a>
            </div>
          </div>
          <div className="bg-card rounded-lg h-48 flex items-center justify-center">
            <span className="font-body text-sm text-muted-foreground">📍 Mapa placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
