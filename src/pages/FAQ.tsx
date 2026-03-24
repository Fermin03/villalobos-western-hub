import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const faqGroups = [
  { key: "orders", questions: [1, 2, 3, 4, 5] },
  { key: "shipping", questions: [6, 7, 8, 9, 10] },
  { key: "products", questions: [11, 12, 13, 14, 15] },
];

const FAQ = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="container py-12 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-center mb-10">{t("faq.title")}</h1>
      {faqGroups.map((group) => (
        <div key={group.key} className="mb-10">
          <h2 className="font-display text-xl mb-4">{t(`faq.${group.key}`)}</h2>
          {group.questions.map((q) => {
            const id = `q${q}`;
            return (
              <div key={id} className="border-b border-border">
                <button onClick={() => setOpen(open === id ? null : id)} className="w-full flex items-center justify-between py-4 font-body text-sm font-medium text-left">
                  {t(`faq.${id}`)}
                  <ChevronDown size={16} className={`shrink-0 ml-2 transition-transform ${open === id ? "rotate-180" : ""}`} />
                </button>
                {open === id && <p className="pb-4 font-body text-sm text-muted-foreground">{t(`faq.a${q}`)}</p>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
export default FAQ;
