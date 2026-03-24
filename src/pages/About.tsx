/**
 * QUIÉNES SOMOS — Historia, valores y marcas de Villalobos Western Hats.
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { getPlaceholderImage } from "@/data/products";
import { Shield, Star, HeadphonesIcon } from "lucide-react";

const About = () => {
  const { t, lang } = useLanguage();

  const values = [
    { key: "trust", icon: Shield },
    { key: "curation", icon: Star },
    { key: "service", icon: HeadphonesIcon },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 md:h-80">
        <img src={getPlaceholderImage(1400, 400, "About", 30)} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{t("about.page.title")}</h1>
        </div>
      </section>

      {/* Origin */}
      <section className="py-16">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img src={getPlaceholderImage(600, 700, "Origin", 31)} alt="" className="rounded-lg w-full aspect-[4/5] object-cover" />
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">{t("about.page.origin.title")}</h2>
            <p className="font-body text-muted-foreground">{t("about.page.origin.text")}</p>
          </div>
        </div>
      </section>

      {/* Growth — inverted */}
      <section className="py-16 bg-card/50">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="md:order-2">
            <img src={getPlaceholderImage(600, 700, "Growth", 32)} alt="" className="rounded-lg w-full aspect-[4/5] object-cover" />
          </div>
          <div className="md:order-1">
            <h2 className="font-display text-2xl font-bold mb-4">{t("about.page.growth.title")}</h2>
            <p className="font-body text-muted-foreground">{t("about.page.growth.text")}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {values.map((v) => (
              <div key={v.key} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <v.icon size={24} className="text-accent" />
                </div>
                <h3 className="font-display text-lg mb-2">{t(`about.values.${v.key}`)}</h3>
                <p className="font-body text-sm text-muted-foreground">{t(`about.values.${v.key}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands logos */}
      <section className="py-12 bg-card/50">
        <div className="container text-center">
          <h3 className="font-display text-xl mb-6">{t("brands.title")}</h3>
          <div className="flex justify-center gap-8 flex-wrap">
            {["Domador", "Rocha Hats", "Villalobos Hats"].map((brand) => (
              <div key={brand} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl">🤠</div>
                <span className="font-body text-sm">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
