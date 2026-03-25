/**
 * CARRITO — Lista de items, resumen y checkout.
 */
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { t } = useLanguage();
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <span className="text-6xl mb-6 block">🤠</span>
        <h1 className="font-display text-2xl font-bold mb-4">{t("cart.empty")}</h1>
        <Link
          to="/catalogo"
          className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-body font-medium text-sm rounded hover:opacity-90 transition-opacity"
        >
          {t("cart.empty.cta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">{t("cart.title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-card rounded-lg p-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
              <div className="flex-1">
                <p className="font-body text-xs text-accent">{item.brand}</p>
                <h3 className="font-display text-base">{item.name}</h3>
                <p className="font-body text-xs text-muted-foreground">{t("product.size")}: {item.size}</p>
                <p className="font-body text-sm font-semibold text-primary mt-1">${item.price.toLocaleString()} MXN</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.id, item.size)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center gap-2 border border-border rounded">
                  <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="p-1.5 hover:bg-muted transition-colors"><Minus size={14} /></button>
                  <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="p-1.5 hover:bg-muted transition-colors"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-lg p-6 h-fit sticky top-24">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between font-body text-sm">
              <span>{t("cart.subtotal")}</span>
              <span className="font-semibold">${subtotal.toLocaleString()} MXN</span>
            </div>
            <div className="flex justify-between font-body text-sm text-muted-foreground">
              <span>{t("cart.shipping")}</span>
              <span>{t("cart.shipping.calc")}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-body">
              <span className="font-semibold">{t("cart.total")}</span>
              <span className="text-xl font-bold text-primary">${subtotal.toLocaleString()} MXN</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block w-full py-3.5 bg-primary text-primary-foreground font-body font-medium text-sm rounded text-center hover:opacity-90 transition-opacity"
          >
            {t("cart.checkout")}
          </Link>
          <div className="flex gap-3 justify-center mt-4 items-center flex-wrap">
            <img src="/images/payments/VISA-SVG.webp" alt="Visa" className="h-6 opacity-60" />
            <img src="/images/payments/MASTERCARD-SVG.webp" alt="Mastercard" className="h-6 opacity-60" />
            <img src="/images/payments/AMERICAN EXPRESS-SVG.webp" alt="American Express" className="h-6 opacity-60" />
            <img src="/images/payments/APPLE PAY-SVG.webp" alt="Apple Pay" className="h-6 opacity-60" />
            <img src="/images/payments/GOOGLE PAY-SVG.webp" alt="Google Pay" className="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
