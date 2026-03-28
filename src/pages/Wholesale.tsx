/**
 * MAYOREO — Beneficios, tabla de descuentos y formulario conectado al backend.
 * Guarda la solicitud en MySQL y envía correo HTML a Villalobos.
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DollarSign, Package, Globe, CheckCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const Wholesale = () => {
  const { t } = useLanguage();

  const benefits = [
    { key: "benefit1", icon: DollarSign },
    { key: "benefit2", icon: Package },
    { key: "benefit3", icon: Globe },
  ];

  const ranges = [
    { range: "10-25", discount: "10%" },
    { range: "26-50", discount: "15%" },
    { range: "51-100", discount: "20%" },
    { range: "100+", discount: "25%" },
  ];

  // --- Estado del formulario ---
  const [form, setForm] = useState({
    nombre: "", empresa: "", correo: "", telefono: "",
    pais: "México", marca: "", volumen: "", mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // --- Enviar formulario al backend ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/contacto/mayoreo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const datos = await res.json();

      if (datos.ok) {
        setEnviado(true);
        setForm({
          nombre: "", empresa: "", correo: "", telefono: "",
          pais: "México", marca: "", volumen: "", mensaje: "",
        });
      } else {
        setError(datos.mensaje || "Error al enviar la solicitud");
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  const estiloInput = "w-full px-4 py-2.5 border border-border rounded font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/50";

  return (
    <div>
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {t("wholesale.title")}
          </h1>
          <p className="font-body text-muted-foreground">
            {t("wholesale.subtitle")}
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="pb-16">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {benefits.map((b) => (
            <div key={b.key} className="bg-card rounded-lg p-6 text-center">
              <b.icon size={32} className="mx-auto mb-3 text-accent" />
              <h3 className="font-display text-lg mb-2">{t(`wholesale.${b.key}.title`)}</h3>
              <p className="font-body text-sm text-muted-foreground">{t(`wholesale.${b.key}.text`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tabla de descuentos */}
      <section className="pb-16">
        <div className="container max-w-lg mx-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 text-left">{t("wholesale.table.range")}</th>
                <th className="py-3 text-right">{t("wholesale.table.discount")}</th>
              </tr>
            </thead>
            <tbody>
              {ranges.map((r) => (
                <tr key={r.range} className="border-b border-border">
                  <td className="py-3">{r.range} piezas</td>
                  <td className="py-3 text-right font-semibold text-accent">{r.discount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Formulario */}
      <section className="pb-16">
        <div className="container max-w-lg mx-auto">

          {/* Mensaje de éxito */}
          {enviado ? (
            <div className="bg-card rounded-xl p-10 text-center">
              <CheckCircle size={48} className="mx-auto mb-4 text-accent" />
              <h3 className="font-display text-2xl font-bold mb-2">
                ¡Solicitud enviada!
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                Recibimos tu solicitud de mayoreo. Te contactaremos en menos de 24 horas.
              </p>
              <button
                onClick={() => setEnviado(false)}
                className="font-body text-sm text-accent hover:underline"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="font-body text-sm font-medium mb-1 block">
                  {t("wholesale.form.name")} *
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => update("nombre", e.target.value)}
                  required
                  className={estiloInput}
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium mb-1 block">
                  {t("wholesale.form.company")}
                </label>
                <input
                  type="text"
                  value={form.empresa}
                  onChange={(e) => update("empresa", e.target.value)}
                  className={estiloInput}
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium mb-1 block">
                  {t("wholesale.form.email")} *
                </label>
                <input
                  type="email"
                  value={form.correo}
                  onChange={(e) => update("correo", e.target.value)}
                  required
                  className={estiloInput}
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium mb-1 block">
                  {t("wholesale.form.phone")} *
                </label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => update("telefono", e.target.value)}
                  required
                  className={estiloInput}
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium mb-1 block">
                  {t("wholesale.form.country")}
                </label>
                <select
                  value={form.pais}
                  onChange={(e) => update("pais", e.target.value)}
                  className={estiloInput}
                >
                  <option>México</option>
                  <option>USA</option>
                  <option>Canadá</option>
                </select>
              </div>

              <div>
                <label className="font-body text-sm font-medium mb-1 block">
                  {t("wholesale.form.brand")}
                </label>
                <select
                  value={form.marca}
                  onChange={(e) => update("marca", e.target.value)}
                  className={estiloInput}
                >
                  <option value="">{t("wholesale.form.brand.all")}</option>
                  <option>Domador</option>
                  <option>Rocha Hats</option>
                  <option>Villalobos Hats</option>
                </select>
              </div>

              <div>
                <label className="font-body text-sm font-medium mb-1 block">
                  {t("wholesale.form.volume")}
                </label>
                <input
                  type="text"
                  value={form.volumen}
                  onChange={(e) => update("volumen", e.target.value)}
                  placeholder="Ej: 50 piezas mensuales"
                  className={estiloInput}
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium mb-1 block">
                  {t("wholesale.form.message")}
                </label>
                <textarea
                  rows={4}
                  value={form.mensaje}
                  onChange={(e) => update("mensaje", e.target.value)}
                  className={`${estiloInput} resize-none`}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="font-body text-sm text-red-500">❌ {error}</p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-3.5 bg-primary text-primary-foreground font-body font-medium text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {enviando ? "Enviando..." : t("wholesale.form.submit")}
              </button>

            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Wholesale;