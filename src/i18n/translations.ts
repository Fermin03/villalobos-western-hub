/**
 * VILLALOBOS WESTERN HATS — SISTEMA DE TRADUCCIONES ES/EN
 * Cada clave mapea a un texto en español e inglés.
 */

export type Lang = "es" | "en";

export const translations: Record<string, Record<Lang, string>> = {
  /* ── Announcement Bar ── */
  "announcement": {
    es: "🌎 Envío gratis en compras mayores a $1,500 MXN — México, EUA y Canadá",
    en: "🌎 Free shipping on orders over $1,500 MXN — Mexico, USA & Canada",
  },

  /* ── Navbar Links ── */
  "nav.home": { es: "Inicio", en: "Home" },
  "nav.hats": { es: "Sombreros", en: "Hats" },
  "nav.brands": { es: "Marcas", en: "Brands" },
  "nav.wholesale": { es: "Mayoreo", en: "Wholesale" },
  "nav.shipping": { es: "Envíos", en: "Shipping" },
  "nav.contact": { es: "Contacto", en: "Contact" },
  "nav.search": { es: "Buscar", en: "Search" },
  "nav.cart": { es: "Carrito", en: "Cart" },

  /* ── Hero ── */
  "hero.label": { es: "DISTRIBUIDOR OFICIAL", en: "AUTHORIZED DEALER" },
  "hero.title": { es: "Las mejores marcas western, en un solo lugar.", en: "The best western brands, in one place." },
  "hero.subtitle": {
    es: "Distribuidor oficial de Domador, Rocha Hats, Villalobos Hats y más. Envíos a México, Estados Unidos y Canadá.",
    en: "Authorized dealer of Domador, Rocha Hats, Villalobos Hats and more. Shipping to Mexico, United States and Canada.",
  },
  "hero.cta.catalog": { es: "Explorar Catálogo", en: "Explore Catalog" },
  "hero.cta.wholesale": { es: "Compra al Mayoreo", en: "Wholesale" },

  /* ── Trust Bar ── */
  "trust.brands": { es: "3 Marcas Premium", en: "3 Premium Brands" },
  "trust.shipping": { es: "Envío Internacional — México EUA Canadá", en: "International Shipping — Mexico USA Canada" },
  "trust.dealer": { es: "Distribuidor Oficial", en: "Authorized Dealer" },
  "trust.dealer.brands": { es: "Domador · Rocha Hats · Villalobos Hats", en: "Domador · Rocha Hats · Villalobos Hats" },
  "trust.payment": { es: "Pago Seguro", en: "Secure Payment" },
  "trust.payment.methods": { es: "Stripe Visa Mastercard", en: "Stripe Visa Mastercard" },

  /* ── Brand Section ── */
  "brands.title": { es: "Nuestras marcas", en: "Our brands" },
  "brands.page.title": { es: "Nuestras Marcas", en: "Our Brands" },
  "brands.page.subtitle": { es: "Distribuidor oficial de las mejores marcas western.", en: "Authorized dealer of the finest western brands." },
  "brands.shop": { es: "Ver colección", en: "Shop brand" },
  "brands.coming": { es: "Próximamente más marcas", en: "More brands coming soon" },
  "brands.notify": { es: "Notifícame cuando haya nuevas marcas", en: "Notify me when new brands arrive" },
  "brands.notify.btn": { es: "Notificar", en: "Notify me" },

  "brand.domador.name": { es: "Domador", en: "Domador" },
  "brand.domador.desc": { es: "Sombreros western de alta calidad con tradición y estilo.", en: "High-quality western hats with tradition and style." },
  "brand.rocha.name": { es: "Rocha Hats", en: "Rocha Hats" },
  "brand.rocha.desc": { es: "Diseños modernos con raíces en la artesanía western.", en: "Modern designs rooted in western craftsmanship." },
  "brand.villalobos.name": { es: "Villalobos Hats", en: "Villalobos Hats" },
  "brand.villalobos.desc": { es: "Nuestra marca propia. Calidad premium, diseño exclusivo.", en: "Our own brand. Premium quality, exclusive design." },

  "badge.dealer": { es: "Distribuidor Oficial", en: "Authorized Dealer" },
  "badge.own": { es: "Marca Propia", en: "Own Brand" },

  /* ── Categories ── */
  "categories.title": { es: "Explora por tipo", en: "Shop by type" },
  "categories.shop": { es: "Ver colección →", en: "Shop collection →" },
  "cat.texanas": { es: "Texanas", en: "Texanas" },
  "cat.fieltro": { es: "Fieltro", en: "Felt" },
  "cat.palma": { es: "Palma", en: "Palm" },
  "cat.paja": { es: "Paja", en: "Straw" },

  /* ── Featured Products ── */
  "featured.title": { es: "Los más vendidos", en: "Best sellers" },
  "product.addtocart": { es: "Agregar al carrito", en: "Add to cart" },
  "product.buynow": { es: "Comprar ahora", en: "Buy now" },
  "product.new": { es: "Nuevo", en: "New" },
  "product.premium": { es: "Premium", en: "Premium" },

  /* ── About Section (Home) ── */
  "about.label": { es: "QUIÉNES SOMOS", en: "WHO WE ARE" },
  "about.title": { es: "Tu destino para los mejores sombreros western.", en: "Your destination for the finest western hats." },
  "about.p1": {
    es: "En Villalobos Western Hats reunimos las marcas más reconocidas del mundo western bajo un mismo techo. Como distribuidor oficial, garantizamos autenticidad, calidad y los mejores precios en cada sombrero.",
    en: "At Villalobos Western Hats we bring together the most recognized western brands under one roof. As an authorized dealer, we guarantee authenticity, quality and the best prices on every hat.",
  },
  "about.p2": {
    es: "Con envíos a México, Estados Unidos y Canadá, llevamos la tradición western a donde estés. Desde texanas clásicas hasta los diseños más modernos, tenemos el sombrero perfecto para ti.",
    en: "With shipping to Mexico, the United States and Canada, we bring western tradition wherever you are. From classic texanas to the most modern designs, we have the perfect hat for you.",
  },
  "about.cta": { es: "Conoce nuestra historia →", en: "Read our story →" },

  /* ── Wholesale Banner (Home) ── */
  "wholesale.banner.title": { es: "¿Eres distribuidor o tienda?", en: "Are you a retailer or store?" },
  "wholesale.banner.text": {
    es: "Accede a precios de mayoreo en todas nuestras marcas con envíos internacionales.",
    en: "Access wholesale pricing across all our brands with international shipping.",
  },
  "wholesale.banner.cta": { es: "Solicitar información", en: "Request info" },

  /* ── Catalog Page ── */
  "catalog.breadcrumb.home": { es: "Inicio", en: "Home" },
  "catalog.breadcrumb.hats": { es: "Sombreros", en: "Hats" },
  "catalog.title": { es: "Sombreros", en: "Hats" },
  "catalog.showing": { es: "Mostrando", en: "Showing" },
  "catalog.products": { es: "productos", en: "products" },
  "catalog.filters": { es: "Filtros", en: "Filters" },
  "catalog.filter.brand": { es: "Marca", en: "Brand" },
  "catalog.filter.type": { es: "Tipo", en: "Type" },
  "catalog.filter.price": { es: "Precio", en: "Price" },
  "catalog.filter.size": { es: "Talla", en: "Size" },
  "catalog.clear": { es: "Limpiar filtros", en: "Clear filters" },
  "catalog.sort": { es: "Ordenar por", en: "Sort by" },
  "catalog.sort.relevance": { es: "Relevancia", en: "Relevance" },
  "catalog.sort.priceAsc": { es: "Precio menor a mayor", en: "Price low to high" },
  "catalog.sort.priceDesc": { es: "Precio mayor a menor", en: "Price high to low" },
  "catalog.sort.newest": { es: "Más nuevos", en: "Newest" },
  "catalog.loadmore": { es: "Cargar más", en: "Load more" },

  /* ── Product Detail ── */
  "product.breadcrumb.home": { es: "Inicio", en: "Home" },
  "product.breadcrumb.hats": { es: "Sombreros", en: "Hats" },
  "product.size": { es: "Talla", en: "Size" },
  "product.freeshipping": { es: "Envío gratis +$1,500", en: "Free shipping +$1,500" },
  "product.official": { es: "Distribuidor oficial", en: "Authorized dealer" },
  "product.secure": { es: "Pago seguro", en: "Secure payment" },
  "product.description": { es: "Descripción completa", en: "Full description" },
  "product.materials": { es: "Materiales y cuidados", en: "Materials & care" },
  "product.sizeguide": { es: "Guía de tallas", en: "Size guide" },
  "product.shippingpolicy": { es: "Política de envío", en: "Shipping policy" },
  "product.related": { es: "También te puede gustar", en: "You may also like" },

  /* ── Cart ── */
  "cart.title": { es: "Tu Carrito", en: "Your Cart" },
  "cart.empty": { es: "Tu carrito está vacío", en: "Your cart is empty" },
  "cart.empty.cta": { es: "Explorar catálogo", en: "Explore catalog" },
  "cart.subtotal": { es: "Subtotal", en: "Subtotal" },
  "cart.shipping": { es: "Envío", en: "Shipping" },
  "cart.shipping.calc": { es: "Calculado al finalizar", en: "Calculated at checkout" },
  "cart.total": { es: "Total", en: "Total" },
  "cart.checkout": { es: "Proceder al pago", en: "Proceed to checkout" },
  "cart.remove": { es: "Eliminar", en: "Remove" },

  /* ── Checkout ── */
  "checkout.title": { es: "Finalizar Compra", en: "Checkout" },
  "checkout.contact": { es: "Información de contacto", en: "Contact information" },
  "checkout.email": { es: "Correo electrónico", en: "Email" },
  "checkout.phone": { es: "Teléfono", en: "Phone" },
  "checkout.address": { es: "Dirección de envío", en: "Shipping address" },
  "checkout.firstname": { es: "Nombre", en: "First name" },
  "checkout.lastname": { es: "Apellido", en: "Last name" },
  "checkout.street": { es: "Calle", en: "Street" },
  "checkout.number": { es: "Número", en: "Number" },
  "checkout.colony": { es: "Colonia", en: "Neighborhood" },
  "checkout.city": { es: "Ciudad", en: "City" },
  "checkout.state": { es: "Estado", en: "State" },
  "checkout.zip": { es: "Código postal", en: "Zip code" },
  "checkout.country": { es: "País", en: "Country" },
  "checkout.payment": { es: "Método de pago", en: "Payment method" },
  "checkout.cardnumber": { es: "Número de tarjeta", en: "Card number" },
  "checkout.expiry": { es: "Fecha de expiración", en: "Expiry date" },
  "checkout.cvv": { es: "CVV", en: "CVV" },
  "checkout.save": { es: "Guardar información para futuras compras", en: "Save information for future purchases" },
  "checkout.summary": { es: "Resumen del pedido", en: "Order summary" },
  "checkout.place": { es: "Confirmar pedido", en: "Place order" },

  /* ── Confirmation ── */
  "confirm.title": { es: "¡Pedido confirmado!", en: "Order confirmed!" },
  "confirm.order": { es: "Número de orden", en: "Order number" },
  "confirm.estimate.mx": { es: "México: 3-5 días hábiles", en: "Mexico: 3-5 business days" },
  "confirm.estimate.us": { es: "Estados Unidos: 7-12 días hábiles", en: "United States: 7-12 business days" },
  "confirm.estimate.ca": { es: "Canadá: 10-15 días hábiles", en: "Canada: 10-15 business days" },
  "confirm.continue": { es: "Seguir comprando", en: "Continue shopping" },
  "confirm.orders": { es: "Ver mis pedidos", en: "View my orders" },

  /* ── About Page ── */
  "about.page.title": { es: "Quiénes Somos", en: "Who We Are" },
  "about.page.origin.title": { es: "Nuestro Origen", en: "Our Origin" },
  "about.page.origin.text": {
    es: "Villalobos Western Hats nació de la pasión por la cultura western y el deseo de ofrecer los mejores sombreros a precios justos. Como distribuidor oficial de marcas reconocidas, nos dedicamos a seleccionar cuidadosamente cada pieza que llega a nuestro catálogo.",
    en: "Villalobos Western Hats was born from a passion for western culture and the desire to offer the best hats at fair prices. As an authorized dealer of recognized brands, we carefully curate every piece that makes it into our catalog.",
  },
  "about.page.growth.title": { es: "Crecimiento Internacional", en: "International Growth" },
  "about.page.growth.text": {
    es: "Desde México hemos expandido nuestro alcance a Estados Unidos y Canadá, llevando la tradición western a toda Norteamérica. Nuestro catálogo crece constantemente con nuevas marcas y estilos exclusivos.",
    en: "From Mexico we have expanded our reach to the United States and Canada, bringing western tradition across all of North America. Our catalog constantly grows with new brands and exclusive styles.",
  },
  "about.values.trust": { es: "Confianza", en: "Trust" },
  "about.values.trust.text": { es: "Distribuidor oficial con garantía de autenticidad en cada producto.", en: "Authorized dealer with authenticity guarantee on every product." },
  "about.values.curation": { es: "Selección", en: "Curation" },
  "about.values.curation.text": { es: "Solo las mejores marcas y los mejores diseños en nuestro catálogo.", en: "Only the finest brands and designs in our catalog." },
  "about.values.service": { es: "Servicio", en: "Service" },
  "about.values.service.text": { es: "Atención personalizada y envío internacional confiable.", en: "Personalized attention and reliable international shipping." },

  /* ── Wholesale Page ── */
  "wholesale.title": { es: "Compra al Mayoreo", en: "Wholesale" },
  "wholesale.subtitle": { es: "Precios especiales para distribuidores y tiendas.", en: "Special pricing for distributors and stores." },
  "wholesale.benefit1.title": { es: "Precios Especiales", en: "Special Pricing" },
  "wholesale.benefit1.text": { es: "Descuentos por volumen en todas las marcas.", en: "Volume discounts across all brands." },
  "wholesale.benefit2.title": { es: "Todas las Marcas", en: "All Brands" },
  "wholesale.benefit2.text": { es: "Acceso completo a Domador, Rocha Hats y Villalobos Hats.", en: "Full access to Domador, Rocha Hats and Villalobos Hats." },
  "wholesale.benefit3.title": { es: "Envío Internacional", en: "International Shipping" },
  "wholesale.benefit3.text": { es: "Envíos incluidos a México, EUA y Canadá.", en: "Shipping included to Mexico, USA and Canada." },
  "wholesale.table.range": { es: "Rango", en: "Range" },
  "wholesale.table.discount": { es: "Descuento", en: "Discount" },
  "wholesale.form.name": { es: "Nombre completo", en: "Full name" },
  "wholesale.form.company": { es: "Empresa", en: "Company" },
  "wholesale.form.email": { es: "Correo electrónico", en: "Email" },
  "wholesale.form.phone": { es: "Teléfono", en: "Phone" },
  "wholesale.form.country": { es: "País", en: "Country" },
  "wholesale.form.brand": { es: "Marca de interés", en: "Brand of interest" },
  "wholesale.form.brand.all": { es: "Todas", en: "All" },
  "wholesale.form.volume": { es: "Volumen mensual estimado", en: "Estimated monthly volume" },
  "wholesale.form.message": { es: "Mensaje", en: "Message" },
  "wholesale.form.submit": { es: "Enviar solicitud", en: "Submit request" },

  /* ── Shipping Page ── */
  "shipping.title": { es: "Información de Envíos", en: "Shipping Information" },
  "shipping.mx.title": { es: "México", en: "Mexico" },
  "shipping.mx.time": { es: "3-5 días hábiles", en: "3-5 business days" },
  "shipping.mx.free": { es: "Gratis en compras mayores a $1,500 MXN", en: "Free on orders over $1,500 MXN" },
  "shipping.us.title": { es: "Estados Unidos", en: "United States" },
  "shipping.us.time": { es: "7-12 días hábiles", en: "7-12 business days" },
  "shipping.us.cost": { es: "Costo calculado por peso", en: "Cost calculated by weight" },
  "shipping.ca.title": { es: "Canadá", en: "Canada" },
  "shipping.ca.time": { es: "10-15 días hábiles", en: "10-15 business days" },
  "shipping.ca.cost": { es: "Costo calculado por peso", en: "Cost calculated by weight" },
  "shipping.track.title": { es: "Rastrear pedido", en: "Track order" },
  "shipping.track.placeholder": { es: "Ingresa tu número de seguimiento", en: "Enter your tracking number" },
  "shipping.track.btn": { es: "Rastrear", en: "Track" },
  "shipping.faq.title": { es: "Preguntas frecuentes sobre envíos", en: "Shipping FAQ" },

  /* ── Returns Page ── */
  "returns.title": { es: "Política de Devoluciones", en: "Returns Policy" },
  "returns.conditions.title": { es: "Condiciones de devolución", en: "Return conditions" },
  "returns.conditions.text": { es: "Aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar sin usar, con etiquetas originales y en su empaque original.", en: "We accept returns within 30 days of purchase. The product must be unused, with original tags and in its original packaging." },
  "returns.process.title": { es: "Proceso de devolución", en: "Return process" },
  "returns.step1": { es: "Contacta a nuestro equipo vía WhatsApp o email.", en: "Contact our team via WhatsApp or email." },
  "returns.step2": { es: "Recibirás una etiqueta de envío de devolución.", en: "You will receive a return shipping label." },
  "returns.step3": { es: "Envía el producto en su empaque original.", en: "Ship the product in its original packaging." },
  "returns.step4": { es: "Recibirás tu reembolso en 5-10 días hábiles.", en: "You will receive your refund in 5-10 business days." },
  "returns.refund.title": { es: "Reembolsos", en: "Refunds" },
  "returns.refund.text": { es: "Los reembolsos se procesan al método de pago original dentro de 5-10 días hábiles después de recibir el producto devuelto.", en: "Refunds are processed to the original payment method within 5-10 business days after receiving the returned product." },
  "returns.exceptions.title": { es: "Excepciones", en: "Exceptions" },
  "returns.exceptions.text": { es: "No se aceptan devoluciones de sombreros personalizados o con modificaciones. Los productos en oferta solo son elegibles para cambio, no reembolso.", en: "Returns are not accepted for customized or modified hats. Sale items are only eligible for exchange, not refund." },
  "returns.contact": { es: "Iniciar devolución", en: "Start a return" },

  /* ── FAQ Page ── */
  "faq.title": { es: "Preguntas Frecuentes", en: "FAQ" },
  "faq.orders": { es: "Pedidos y Pagos", en: "Orders & Payments" },
  "faq.shipping": { es: "Envíos y Entregas", en: "Shipping & Delivery" },
  "faq.products": { es: "Productos y Marcas", en: "Products & Brands" },

  "faq.q1": { es: "¿Qué métodos de pago aceptan?", en: "What payment methods do you accept?" },
  "faq.a1": { es: "Aceptamos Visa, Mastercard y pagos a través de Stripe. Todos los pagos son seguros y encriptados.", en: "We accept Visa, Mastercard and payments through Stripe. All payments are secure and encrypted." },
  "faq.q2": { es: "¿Puedo cancelar mi pedido?", en: "Can I cancel my order?" },
  "faq.a2": { es: "Sí, puedes cancelar tu pedido dentro de las primeras 24 horas. Contáctanos por WhatsApp o email.", en: "Yes, you can cancel your order within the first 24 hours. Contact us via WhatsApp or email." },
  "faq.q3": { es: "¿Emiten factura?", en: "Do you issue invoices?" },
  "faq.a3": { es: "Sí, emitimos factura fiscal (CFDI) para clientes en México. Solicítala al momento de tu compra.", en: "Yes, we issue tax invoices (CFDI) for customers in Mexico. Request it at the time of purchase." },
  "faq.q4": { es: "¿Puedo pagar en cuotas?", en: "Can I pay in installments?" },
  "faq.a4": { es: "Actualmente solo aceptamos pagos de contado. Próximamente ofreceremos opciones de pago a meses.", en: "Currently we only accept full payments. We will soon offer installment payment options." },
  "faq.q5": { es: "¿Tienen precios en dólares?", en: "Do you have prices in dollars?" },
  "faq.a5": { es: "Nuestros precios están en pesos mexicanos (MXN). La conversión a dólares se hace automáticamente por tu banco.", en: "Our prices are in Mexican pesos (MXN). Conversion to dollars is done automatically by your bank." },

  "faq.q6": { es: "¿Cuánto tarda el envío a México?", en: "How long does shipping to Mexico take?" },
  "faq.a6": { es: "El envío dentro de México toma de 3 a 5 días hábiles.", en: "Shipping within Mexico takes 3 to 5 business days." },
  "faq.q7": { es: "¿Hacen envíos a Estados Unidos?", en: "Do you ship to the United States?" },
  "faq.a7": { es: "Sí, enviamos a Estados Unidos con un tiempo estimado de 7 a 12 días hábiles.", en: "Yes, we ship to the United States with an estimated time of 7 to 12 business days." },
  "faq.q8": { es: "¿El envío es gratis?", en: "Is shipping free?" },
  "faq.a8": { es: "El envío es gratis en compras mayores a $1,500 MXN dentro de México. Para envíos internacionales, el costo se calcula por peso.", en: "Shipping is free on orders over $1,500 MXN within Mexico. For international shipments, cost is calculated by weight." },
  "faq.q9": { es: "¿Puedo rastrear mi pedido?", en: "Can I track my order?" },
  "faq.a9": { es: "Sí, recibirás un número de seguimiento por email una vez que tu pedido sea enviado.", en: "Yes, you will receive a tracking number by email once your order is shipped." },
  "faq.q10": { es: "¿Qué pasa si mi pedido llega dañado?", en: "What if my order arrives damaged?" },
  "faq.a10": { es: "Contáctanos dentro de las 48 horas siguientes a la entrega con fotos del daño. Te enviaremos un reemplazo sin costo.", en: "Contact us within 48 hours of delivery with photos of the damage. We will send you a replacement at no cost." },

  "faq.q11": { es: "¿Los sombreros son originales?", en: "Are the hats original?" },
  "faq.a11": { es: "Sí, somos distribuidor oficial de todas las marcas que ofrecemos. Cada sombrero incluye certificado de autenticidad.", en: "Yes, we are an authorized dealer of all the brands we carry. Each hat includes a certificate of authenticity." },
  "faq.q12": { es: "¿Cómo elijo mi talla?", en: "How do I choose my size?" },
  "faq.a12": { es: "Consulta nuestra guía de tallas en la página de cada producto. Mide la circunferencia de tu cabeza a la altura de la frente.", en: "Check our size guide on each product page. Measure the circumference of your head at forehead height." },
  "faq.q13": { es: "¿Qué marcas distribuyen?", en: "What brands do you carry?" },
  "faq.a13": { es: "Actualmente distribuimos Domador, Rocha Hats y nuestra marca propia Villalobos Hats. Próximamente más marcas.", en: "We currently carry Domador, Rocha Hats and our own brand Villalobos Hats. More brands coming soon." },
  "faq.q14": { es: "¿Tienen sombreros para mujer?", en: "Do you have women's hats?" },
  "faq.a14": { es: "Sí, ofrecemos modelos unisex y diseños específicos para mujer en todas nuestras marcas.", en: "Yes, we offer unisex models and women-specific designs across all our brands." },
  "faq.q15": { es: "¿Puedo personalizar un sombrero?", en: "Can I customize a hat?" },
  "faq.a15": { es: "Actualmente no ofrecemos personalización. Te recomendamos explorar nuestra amplia selección de estilos y materiales.", en: "We currently do not offer customization. We recommend exploring our wide selection of styles and materials." },

  /* ── Contact Page ── */
  "contact.title": { es: "Contacto", en: "Contact" },
  "contact.form.name": { es: "Nombre", en: "Name" },
  "contact.form.email": { es: "Correo electrónico", en: "Email" },
  "contact.form.phone": { es: "Teléfono", en: "Phone" },
  "contact.form.subject": { es: "Asunto", en: "Subject" },
  "contact.form.subject.order": { es: "Pedido", en: "Order" },
  "contact.form.subject.wholesale": { es: "Mayoreo", en: "Wholesale" },
  "contact.form.subject.return": { es: "Devolución", en: "Return" },
  "contact.form.subject.brands": { es: "Marcas", en: "Brands" },
  "contact.form.subject.other": { es: "Otro", en: "Other" },
  "contact.form.message": { es: "Mensaje", en: "Message" },
  "contact.form.submit": { es: "Enviar mensaje", en: "Send message" },
  "contact.info.whatsapp": { es: "WhatsApp", en: "WhatsApp" },
  "contact.info.email": { es: "Correo electrónico", en: "Email" },
  "contact.info.hours": { es: "Horario de atención", en: "Business hours" },
  "contact.info.hours.text": { es: "Lunes a Viernes: 9:00 - 18:00 CST\nSábado: 10:00 - 14:00 CST", en: "Monday to Friday: 9:00 AM - 6:00 PM CST\nSaturday: 10:00 AM - 2:00 PM CST" },
  "contact.info.social": { es: "Redes sociales", en: "Social media" },

  /* ── Privacy & Terms ── */
  "privacy.title": { es: "Aviso de Privacidad", en: "Privacy Notice" },
  "terms.title": { es: "Términos y Condiciones", en: "Terms & Conditions" },

  /* ── Footer ── */
  "footer.tagline": { es: "Las mejores marcas, en un solo lugar.", en: "The best brands, in one place." },
  "footer.returns": { es: "Devoluciones", en: "Returns" },
  "footer.faq": { es: "FAQ", en: "FAQ" },
  "footer.privacy": { es: "Privacidad", en: "Privacy" },
  "footer.terms": { es: "Términos", en: "Terms" },
  "footer.copyright": {
    es: "© 2025 Villalobos Western Hats. Distribuidor oficial de sombreros western. Todos los derechos reservados.",
    en: "© 2025 Villalobos Western Hats. Authorized western hat distributor. All rights reserved.",
  },
};
