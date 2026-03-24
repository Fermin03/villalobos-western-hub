import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Returns = () => {
  const { t } = useLanguage();
  const sections = [
    { title: t("returns.conditions.title"), text: t("returns.conditions.text") },
    { title: t("returns.refund.title"), text: t("returns.refund.text") },
    { title: t("returns.exceptions.title"), text: t("returns.exceptions.text") },
  ];
  const steps = [t("returns.step1"), t("returns.step2"), t("returns.step3"), t("returns.step4")];

  return (
    <div className="container py-12 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-center mb-10">{t("returns.title")}</h1>
      {sections.slice(0, 1).map((s) => (
        <div key={s.title} className="mb-8"><h2 className="font-display text-xl mb-3">{s.title}</h2><p className="font-body text-muted-foreground">{s.text}</p></div>
      ))}
      <div className="mb-8">
        <h2 className="font-display text-xl mb-4">{t("returns.process.title")}</h2>
        <ol className="space-y-3">{steps.map((s, i) => (
          <li key={i} className="flex gap-3 font-body text-sm"><span className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>{s}</li>
        ))}</ol>
      </div>
      {sections.slice(1).map((s) => (
        <div key={s.title} className="mb-8"><h2 className="font-display text-xl mb-3">{s.title}</h2><p className="font-body text-muted-foreground">{s.text}</p></div>
      ))}
      <div className="text-center mt-10">
        <Link to="/contacto" className="px-8 py-3 bg-primary text-primary-foreground font-body font-medium text-sm rounded hover:opacity-90 transition-opacity inline-block">{t("returns.contact")}</Link>
      </div>
    </div>
  );
};
export default Returns;
