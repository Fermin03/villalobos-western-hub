/**
 * BARRA DE ANUNCIO — Fondo verde olivo con mensaje de envío gratis.
 */
import { useLanguage } from "@/contexts/LanguageContext";

const AnnouncementBar = () => {
  const { lang } = useLanguage();
  return (
    <div className="bg-accent text-accent-foreground text-center py-2 px-4 text-sm font-body tracking-wide">
      {lang === "en"
        ? "🚚 Free shipping on orders over $2,000 MXN — Mexico only · Retail orders only"
        : "🚚 Envío gratis en compras mayores a $2,000 MXN — Solo México · Solo menudeo"}
    </div>
  );
};

export default AnnouncementBar;