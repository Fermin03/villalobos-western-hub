/**
 * CHECKOUT — Formulario de envío y pago con Stripe integrado.
 * Métodos de pago: Tarjeta (débito/crédito), OXXOPay, Apple Pay, Google Pay.
 * OXXOPay genera un voucher que el cliente paga en tienda OXXO en hasta 3 días.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// ── Iconos SVG de métodos de pago ──
const IconTarjeta = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const IconOxxo = () => (
  <svg width="28" height="20" viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="28" rx="4" fill="#DE0019"/>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="13">OXXO</text>
  </svg>
);

// ============================================================
// Formulario interno
// ============================================================
const CheckoutForm = () => {
  const { t } = useLanguage();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    email: "", phone: "", firstname: "", lastname: "",
    street: "", number: "", colony: "", city: "",
    state: "", zip: "", country: "Mexico",
  });

  // Método de pago seleccionado: 'card' | 'oxxo'
  const [metodoPago, setMetodoPago] = useState<"card" | "oxxo">("card");
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState("");
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // --- Apple Pay / Google Pay ---
  useEffect(() => {
    if (!stripe || subtotal === 0) return;
    const pr = stripe.paymentRequest({
      country: "MX", currency: "mxn",
      total: { label: "Villalobos Western Hats", amount: Math.round(subtotal * 100) },
      requestPayerName: true, requestPayerEmail: true, requestPayerPhone: true,
    });
    pr.canMakePayment().then((result) => { if (result) setPaymentRequest(pr); });
    pr.on("paymentmethod", async (ev) => {
      setProcesando(true); setErrorPago("");
      try {
        const resIntento = await fetch(`${API_URL}/pagos/crear-intento`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: items.map((i) => ({ id: i.id, cantidad: i.quantity })), correo: ev.payerEmail || "", tipo_cliente: "menudeo" }),
        });
        const datosIntento = await resIntento.json();
        if (!datosIntento.ok) { ev.complete("fail"); setErrorPago(datosIntento.mensaje || "Error al iniciar el pago"); setProcesando(false); return; }
        const { error, paymentIntent } = await stripe.confirmCardPayment(datosIntento.clientSecret, { payment_method: ev.paymentMethod.id }, { handleActions: false });
        if (error) { ev.complete("fail"); setErrorPago(error.message || "Error al procesar el pago"); setProcesando(false); return; }
        ev.complete("success");
        const resPedido = await fetch(`${API_URL}/pedidos`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stripe_payment_id: paymentIntent?.id, cliente_nombre: ev.payerName || "", cliente_correo: ev.payerEmail || "", cliente_telefono: ev.payerPhone || "", direccion_envio: {}, items: items.map((i) => ({ id: i.id, cantidad: i.quantity, precio: i.price })), total: subtotal, tipo_cliente: "menudeo" }),
        });
        const datosPedido = await resPedido.json();
        clearCart();
        navigate("/confirmacion", { state: { pedido_id: datosPedido.pedido_id } });
      } catch { ev.complete("fail"); setErrorPago("Error de conexión."); setProcesando(false); }
    });
  }, [stripe, subtotal]);

  // --- Pago con tarjeta ---
  const pagarConTarjeta = async () => {
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const resIntento = await fetch(`${API_URL}/pagos/crear-intento`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map((i) => ({ id: i.id, cantidad: i.quantity })), correo: form.email, tipo_cliente: "menudeo" }),
    });
    const datosIntento = await resIntento.json();
    if (!datosIntento.ok) { setErrorPago(datosIntento.mensaje || "Error al iniciar el pago"); return; }

    const { error, paymentIntent } = await stripe.confirmCardPayment(datosIntento.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${form.firstname} ${form.lastname}`,
          email: form.email, phone: form.phone,
          address: {
            line1: `${form.street} ${form.number}`,
            city: form.city, state: form.state, postal_code: form.zip,
            country: form.country === "Mexico" ? "MX" : form.country === "USA" ? "US" : "CA",
          },
        },
      },
    });

    if (error) { setErrorPago(error.message || "Error al procesar el pago"); return; }

    return paymentIntent?.id;
  };

  // --- Pago con OXXO ---
  const pagarConOxxo = async () => {
    if (!stripe) return;

    // Crear Payment Intent con método OXXO en el backend
    const resIntento = await fetch(`${API_URL}/pagos/crear-intento`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, cantidad: i.quantity })),
        correo: form.email, tipo_cliente: "menudeo",
        metodo_pago: "oxxo", // Le indica al backend que use OXXO
      }),
    });
    const datosIntento = await resIntento.json();
    if (!datosIntento.ok) { setErrorPago(datosIntento.mensaje || "Error al iniciar el pago"); return; }

    const { error, paymentIntent } = await stripe.confirmOxxoPayment(
      datosIntento.clientSecret,
      {
        payment_method: {
          billing_details: {
            name: `${form.firstname} ${form.lastname}`,
            email: form.email,
          },
        },
      },
      { handleActions: true } // Stripe muestra el voucher automáticamente
    );

    if (error && error.code !== "payment_intent_unexpected_state") {
      setErrorPago(error.message || "Error al generar voucher OXXO");
      return;
    }

    // OXXO queda en estado 'requires_action' (pendiente de pago en tienda)
    return paymentIntent?.id;
  };

  // --- Submit general ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe) return;
    setProcesando(true);
    setErrorPago("");

    try {
      let paymentIntentId: string | undefined;

      if (metodoPago === "card") {
        paymentIntentId = await pagarConTarjeta();
      } else {
        paymentIntentId = await pagarConOxxo();
      }

      if (!paymentIntentId) { setProcesando(false); return; }

      // Crear pedido en la BD
      const estadoPedido = metodoPago === "oxxo" ? "pendiente_oxxo" : "pagado";

      const resPedido = await fetch(`${API_URL}/pedidos`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripe_payment_id: paymentIntentId,
          cliente_nombre: `${form.firstname} ${form.lastname}`,
          cliente_correo: form.email,
          cliente_telefono: form.phone,
          direccion_envio: {
            calle: form.street, numero: form.number,
            colonia: form.colony, ciudad: form.city,
            estado: form.state, cp: form.zip, pais: form.country,
          },
          items: items.map((i) => ({ id: i.id, cantidad: i.quantity, precio: i.price })),
          total: subtotal,
          tipo_cliente: "menudeo",
          metodo_pago: metodoPago,
        }),
      });

      const datosPedido = await resPedido.json();
      clearCart();
      navigate("/confirmacion", {
        state: {
          pedido_id: datosPedido.pedido_id,
          metodo_pago: metodoPago,
        }
      });

    } catch {
      setErrorPago("Error de conexión. Intenta de nuevo.");
      setProcesando(false);
    }
  };

  const InputField = ({ label, id, type = "text", placeholder = "" }: { label: string; id: string; type?: string; placeholder?: string; }) => (
    <div>
      <label htmlFor={id} className="font-body text-sm font-medium mb-1 block">{label}</label>
      <input
        id={id} type={type} placeholder={placeholder}
        value={(form as any)[id]} onChange={(e) => update(id, e.target.value)}
        className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
    </div>
  );

  return (
    <div className="container py-8">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">{t("checkout.title")}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Izquierda — Formulario */}
        <div className="lg:col-span-2 space-y-8">

          {/* Apple Pay / Google Pay */}
          {paymentRequest && (
            <section>
              <h2 className="font-display text-lg mb-4">Pago rápido</h2>
              <PaymentRequestButtonElement options={{ paymentRequest, style: { paymentRequestButton: { type: "buy", theme: "dark", height: "48px" } } }} />
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="font-body text-sm text-muted-foreground">o elige otro método</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </section>
          )}

          {/* Contacto */}
          <section>
            <h2 className="font-display text-lg mb-4">{t("checkout.contact")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label={t("checkout.email")} id="email" type="email" />
              <InputField label={t("checkout.phone")} id="phone" type="tel" />
            </div>
          </section>

          {/* Dirección */}
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
                <select id="country" value={form.country} onChange={(e) => update("country", e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/50">
                  <option value="Mexico">México</option>
                  <option value="USA">Estados Unidos / USA</option>
                  <option value="Canada">Canadá / Canada</option>
                </select>
              </div>
            </div>
          </section>

          {/* ══ MÉTODO DE PAGO ══ */}
          <section>
            <h2 className="font-display text-lg mb-4">{t("checkout.payment")}</h2>

            {/* Selector de método */}
            <div className="grid grid-cols-2 gap-3 mb-4">

              {/* Tarjeta */}
              <button
                type="button"
                onClick={() => setMetodoPago("card")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  metodoPago === "card"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className={metodoPago === "card" ? "text-primary" : "text-muted-foreground"}>
                  <IconTarjeta />
                </div>
                <span className={`font-body text-sm font-medium ${metodoPago === "card" ? "text-primary" : "text-muted-foreground"}`}>
                  Débito / Crédito
                </span>
                {metodoPago === "card" && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>

              {/* OXXO */}
              <button
                type="button"
                onClick={() => setMetodoPago("oxxo")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  metodoPago === "oxxo"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <IconOxxo />
                <span className={`font-body text-sm font-medium ${metodoPago === "oxxo" ? "text-primary" : "text-muted-foreground"}`}>
                  OXXOPay
                </span>
                {metodoPago === "oxxo" && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            </div>

            {/* Panel — Tarjeta */}
            {metodoPago === "card" && (
              <div className="border border-border rounded-lg p-4 bg-background animate-[fade-up_0.2s_ease-out]">
                <CardElement
                  options={{
                    style: {
                      base: { fontSize: "15px", fontFamily: "Jost, sans-serif", color: "#2C1E12", "::placeholder": { color: "#aaa" } },
                      invalid: { color: "#e74c3c" },
                    },
                  }}
                />
              </div>
            )}

            {/* Panel — OXXO */}
            {metodoPago === "oxxo" && (
              <div className="border border-border rounded-lg p-5 bg-background animate-[fade-up_0.2s_ease-out]">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏪</span>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground mb-1">
                      Paga en cualquier tienda OXXO
                    </p>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                      Al confirmar, Stripe generará un <strong>voucher con código de barras</strong> que podrás presentar en cualquier OXXO para pagar en efectivo. Tienes hasta <strong>3 días</strong> para completar el pago. Tu pedido se procesará una vez confirmado el pago.
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded p-3">
                  <p className="font-body text-xs text-amber-800">
                    ⚠️ Solo disponible en México. El voucher se enviará a tu correo electrónico.
                  </p>
                </div>
              </div>
            )}

            {/* Error de pago */}
            {errorPago && (
              <p className="text-sm mt-3" style={{ color: "#e74c3c" }}>❌ {errorPago}</p>
            )}
          </section>
        </div>

        {/* Derecha — Resumen */}
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

            {/* Nota OXXO */}
            {metodoPago === "oxxo" && (
              <div className="flex justify-between font-body text-xs text-amber-700 bg-amber-50 rounded p-2">
                <span>Método de pago</span>
                <span className="font-semibold">OXXO (hasta 3 días)</span>
              </div>
            )}

            <div className="border-t border-border pt-2 flex justify-between font-body">
              <span className="font-semibold">{t("cart.total")}</span>
              <span className="text-xl font-bold text-primary">${subtotal.toLocaleString()} MXN</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={procesando || !stripe}
            className="w-full py-3.5 bg-primary text-primary-foreground font-body font-medium text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {procesando
              ? "Procesando..."
              : metodoPago === "oxxo"
              ? "Generar voucher OXXO"
              : t("checkout.place")}
          </button>

          {metodoPago === "oxxo" && (
            <p className="font-body text-xs text-muted-foreground text-center mt-2">
              Se enviará el voucher a tu correo
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

// ============================================================
// Componente principal
// ============================================================
const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;