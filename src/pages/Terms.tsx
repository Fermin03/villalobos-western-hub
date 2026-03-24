import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { t, lang } = useLanguage();
  const content = lang === "es" ? (
    <>
      <h2 className="font-display text-xl mb-4">Términos generales</h2>
      <p className="mb-4">Al utilizar el sitio web de Villalobos Western Hats y realizar compras a través del mismo, usted acepta los presentes términos y condiciones. Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>
      <h2 className="font-display text-xl mb-4">Condiciones de compra</h2>
      <p className="mb-4">Todos los precios están expresados en pesos mexicanos (MXN) e incluyen IVA. Los precios pueden cambiar sin previo aviso. La disponibilidad de productos está sujeta a inventario. Una vez confirmado el pedido, se le enviará una confirmación por correo electrónico.</p>
      <h2 className="font-display text-xl mb-4">Distribución y autenticidad</h2>
      <p className="mb-4">Villalobos Western Hats es distribuidor oficial de las marcas Domador y Rocha Hats, y fabricante de la marca Villalobos Hats. Todos los productos son 100% originales y cuentan con garantía de autenticidad.</p>
      <h2 className="font-display text-xl mb-4">Limitación de responsabilidad</h2>
      <p className="mb-4">Villalobos Western Hats no será responsable por daños indirectos, incidentales o consecuentes derivados del uso del sitio web o productos. Nuestra responsabilidad máxima se limita al monto pagado por el producto.</p>
      <h2 className="font-display text-xl mb-4">Envíos internacionales</h2>
      <p className="mb-4">Para envíos a Estados Unidos y Canadá, el comprador es responsable de cualquier impuesto de importación, aranceles o cargos aduanales que puedan aplicar según la legislación del país destino.</p>
      <h2 className="font-display text-xl mb-4">Ley aplicable</h2>
      <p className="mb-4">Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia será resuelta ante los tribunales competentes de México.</p>
    </>
  ) : (
    <>
      <h2 className="font-display text-xl mb-4">General Terms</h2>
      <p className="mb-4">By using the Villalobos Western Hats website and making purchases through it, you accept these terms and conditions. We reserve the right to modify these terms at any time.</p>
      <h2 className="font-display text-xl mb-4">Purchase Conditions</h2>
      <p className="mb-4">All prices are in Mexican pesos (MXN) and include VAT. Prices may change without notice. Product availability is subject to inventory. Once your order is confirmed, you will receive a confirmation email.</p>
      <h2 className="font-display text-xl mb-4">Distribution and Authenticity</h2>
      <p className="mb-4">Villalobos Western Hats is an authorized dealer of Domador and Rocha Hats brands, and manufacturer of the Villalobos Hats brand. All products are 100% original with authenticity guarantee.</p>
      <h2 className="font-display text-xl mb-4">Limitation of Liability</h2>
      <p className="mb-4">Villalobos Western Hats shall not be liable for indirect, incidental or consequential damages arising from the use of the website or products. Our maximum liability is limited to the amount paid for the product.</p>
      <h2 className="font-display text-xl mb-4">International Shipping</h2>
      <p className="mb-4">For shipments to the United States and Canada, the buyer is responsible for any import taxes, tariffs or customs charges that may apply under the destination country's legislation.</p>
      <h2 className="font-display text-xl mb-4">Governing Law</h2>
      <p className="mb-4">These terms are governed by the laws of Mexico. Any disputes shall be resolved before the competent courts of Mexico.</p>
    </>
  );

  return (
    <div className="container py-12 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-center mb-10">{t("terms.title")}</h1>
      <div className="font-body text-muted-foreground leading-relaxed">{content}</div>
    </div>
  );
};
export default Terms;
