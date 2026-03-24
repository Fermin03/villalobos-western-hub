/**
 * CONFIRMACIÓN — Pedido confirmado con animación de check.
 */
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Confirmation = () => {
  const { t } = useLanguage();

  return (
    <div className="container py-20 text-center max-w-lg mx-auto">
      {/* Animated checkmark */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-accent-foreground">
          <path
            d="M10 18L16 24L26 12"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="50"
            strokeDashoffset="0"
            style={{ animation: "checkmark-draw 0.5s ease-out 0.3s both" }}
          />
        </svg>
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-bold mb-3">{t("confirm.title")}</h1>
      <p className="font-body text-muted-foreground mb-2">{t("confirm.order")}: <span className="font-semibold text-foreground">#VW-00001</span></p>

      <div className="bg-card rounded-lg p-6 my-8 text-left space-y-2">
        <p className="font-body text-sm text-muted-foreground">📦 {t("confirm.estimate.mx")}</p>
        <p className="font-body text-sm text-muted-foreground">📦 {t("confirm.estimate.us")}</p>
        <p className="font-body text-sm text-muted-foreground">📦 {t("confirm.estimate.ca")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/catalogo"
          className="px-8 py-3 bg-primary text-primary-foreground font-body font-medium text-sm rounded hover:opacity-90 transition-opacity"
        >
          {t("confirm.continue")}
        </Link>
        <Link
          to="/"
          className="px-8 py-3 border-2 border-primary text-primary font-body font-medium text-sm rounded hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {t("confirm.orders")}
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
