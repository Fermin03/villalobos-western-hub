/**
 * CHECKOUT — Formulario de envío, pago y resumen del pedido.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

const Checkout = () => {
  const { t } = useLanguage();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "", phone: "", firstname: "", lastname: "", street: "", number: "", colony: "", city: "", state: "", zip: "", country: "Mexico",
    cardNumber: "", expiry: "", cvv: "", save: false,
  });

  const update = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    navigate("/confirmacion");
  };

  const InputField = ({ label, id, type = "text", placeholder = "" }: { label: string; id: string; type?: string; placeholder?: string }) => (
    <div>
      <label htmlFor={id} className="font-body text-sm font-medium mb-1 block">{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={(form as any)[id]}
        onChange={(e) => update(id, e.target.value)}
        className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
    </div>
  );

  return (
    <div className="container py-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">{t("checkout.title")}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <section>
            <h2 className="font-display text-lg mb-4">{t("checkout.contact")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label={t("checkout.email")} id="email" type="email" />
              <InputField label={t("checkout.phone")} id="phone" type="tel" />
            </div>
          </section>

          {/* Address */}
          <section>
            <h2 className="font-display text-lg mb-4">{t("checkout.address")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label={t("checkout.firstname")} id="firstname" />
              <InputField label={t("checkout.lastname")} id="lastname" />
              <InputField label={t("checkout.street")} id="street" />
              <InputField label={t("checkout.number")} id="number" />
              <InputField label={t("checkout.colony")} id="colony" />
              <InputField label={t("checkout.city")} id="city" />
              <InputField label={t("checkout.state")} id="state" />
              <InputField label={t("checkout.zip")} id="zip" />
              <div className="sm:col-span-2">
                <label htmlFor="country" className="font-body text-sm font-medium mb-1 block">{t("checkout.country")}</label>
                <select
                  id="country"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="Mexico">México</option>
                  <option value="USA">Estados Unidos / USA</option>
                  <option value="Canada">Canadá / Canada</option>
                </select>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-display text-lg mb-4">{t("checkout.payment")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <InputField label={t("checkout.cardnumber")} id="cardNumber" placeholder="•••• •••• •••• ••••" />
              </div>
              <InputField label={t("checkout.expiry")} id="expiry" placeholder="MM/YY" />
              <InputField label={t("checkout.cvv")} id="cvv" placeholder="•••" />
            </div>
          </section>

          <label className="flex items-center gap-2 font-body text-sm cursor-pointer">
            <input type="checkbox" checked={form.save} onChange={(e) => update("save", e.target.checked)} className="accent-accent" />
            {t("checkout.save")}
          </label>
        </div>

        {/* Right — Summary */}
        <div className="bg-card rounded-lg p-6 h-fit sticky top-24">
          <h3 className="font-display text-lg mb-4">{t("checkout.summary")}</h3>
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-body text-xs text-accent">{item.brand}</p>
                  <p className="font-body text-sm">{item.name}</p>
                  <p className="font-body text-xs text-muted-foreground">×{item.quantity}</p>
                </div>
                <p className="font-body text-sm font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-border pt-4 mb-6">
            <div className="flex justify-between font-body text-sm">
              <span>{t("cart.subtotal")}</span>
              <span>${subtotal.toLocaleString()} MXN</span>
            </div>
            <div className="flex justify-between font-body text-sm text-muted-foreground">
              <span>{t("cart.shipping")}</span>
              <span>{t("cart.shipping.calc")}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-body">
              <span className="font-semibold">{t("cart.total")}</span>
              <span className="text-xl font-bold text-primary">${subtotal.toLocaleString()} MXN</span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-primary-foreground font-body font-medium text-sm rounded hover:opacity-90 transition-opacity"
          >
            {t("checkout.place")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
