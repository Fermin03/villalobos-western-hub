/**
 * BARRA DE ANUNCIO — Fondo verde olivo con mensaje de envío gratis.
 */
import { useLanguage } from "@/contexts/LanguageContext";

const AnnouncementBar = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-accent text-accent-foreground text-center py-2 px-4 text-sm font-body tracking-wide">
      {t("announcement")}
    </div>
  );
};

export default AnnouncementBar;
