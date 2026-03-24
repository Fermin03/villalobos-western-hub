import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { t, lang } = useLanguage();
  const content = lang === "es" ? (
    <>
      <h2 className="font-display text-xl mb-4">Responsable del tratamiento de datos</h2>
      <p className="mb-4">Villalobos Western Hats, con domicilio en México, es responsable del tratamiento de sus datos personales de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</p>
      <h2 className="font-display text-xl mb-4">Datos personales recabados</h2>
      <p className="mb-4">Recabamos los siguientes datos: nombre completo, dirección de envío, correo electrónico, número telefónico, información de pago. Estos datos son necesarios para procesar pedidos, realizar envíos y brindar servicio al cliente.</p>
      <h2 className="font-display text-xl mb-4">Finalidades del tratamiento</h2>
      <p className="mb-4">Sus datos serán utilizados para: procesar y enviar pedidos, enviar notificaciones sobre el estado de su compra, atender solicitudes de servicio al cliente, enviar comunicaciones comerciales (con su consentimiento), cumplir con obligaciones legales y fiscales.</p>
      <h2 className="font-display text-xl mb-4">Transferencia de datos</h2>
      <p className="mb-4">Sus datos pueden ser compartidos con servicios de mensajería para entregas, procesadores de pago (Stripe), y autoridades competentes cuando sea requerido por ley.</p>
      <h2 className="font-display text-xl mb-4">Derechos ARCO</h2>
      <p className="mb-4">Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, contacte a info@villaloboswestern.com.</p>
      <h2 className="font-display text-xl mb-4">Cumplimiento GDPR (ventas internacionales)</h2>
      <p className="mb-4">Para clientes en la Unión Europea, cumplimos con el Reglamento General de Protección de Datos (GDPR). Puede solicitar la eliminación completa de sus datos en cualquier momento.</p>
    </>
  ) : (
    <>
      <h2 className="font-display text-xl mb-4">Data Controller</h2>
      <p className="mb-4">Villalobos Western Hats, based in Mexico, is responsible for processing your personal data in accordance with the Mexican Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP).</p>
      <h2 className="font-display text-xl mb-4">Personal Data Collected</h2>
      <p className="mb-4">We collect the following data: full name, shipping address, email, phone number, payment information. This data is necessary to process orders, ship products and provide customer service.</p>
      <h2 className="font-display text-xl mb-4">Purpose of Processing</h2>
      <p className="mb-4">Your data will be used to: process and ship orders, send order status notifications, handle customer service requests, send commercial communications (with your consent), comply with legal and tax obligations.</p>
      <h2 className="font-display text-xl mb-4">Data Transfers</h2>
      <p className="mb-4">Your data may be shared with courier services for deliveries, payment processors (Stripe), and competent authorities when required by law.</p>
      <h2 className="font-display text-xl mb-4">Your Rights</h2>
      <p className="mb-4">You have the right to Access, Rectify, Cancel or Object to the processing of your personal data. To exercise these rights, contact info@villaloboswestern.com.</p>
      <h2 className="font-display text-xl mb-4">GDPR Compliance (international sales)</h2>
      <p className="mb-4">For customers in the European Union, we comply with the General Data Protection Regulation (GDPR). You may request complete deletion of your data at any time.</p>
    </>
  );

  return (
    <div className="container py-12 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-center mb-10">{t("privacy.title")}</h1>
      <div className="font-body text-muted-foreground leading-relaxed">{content}</div>
    </div>
  );
};
export default Privacy;
