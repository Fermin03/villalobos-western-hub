/**
 * DATOS DE PRODUCTOS PLACEHOLDER — 12 sombreros con variedad de marcas y tipos.
 */

export interface Product {
  id: string;
  name: { es: string; en: string };
  brand: "Domador" | "Rocha Hats" | "Villalobos Hats";
  type: "Texanas" | "Fieltro" | "Palma" | "Paja";
  price: number;
  badge?: "new" | "premium";
  sizes: string[];
  description: { es: string; en: string };
  materials: { es: string; en: string };
}

/** Genera un color cálido de placeholder basado en un seed */
const placeholderBg = (seed: number) => {
  const hues = [30, 35, 25, 40, 32, 28, 38, 33, 27, 36, 31, 34];
  return `hsl(${hues[seed % hues.length]}, ${20 + (seed % 3) * 5}%, ${75 + (seed % 4) * 3}%)`;
};

export const getPlaceholderImages = (productIndex: number): string[] => {
  return [0, 1, 2].map(
    (i) =>
      `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect fill="${placeholderBg(productIndex * 3 + i)}" width="600" height="600"/><text x="300" y="280" font-family="serif" font-size="80" fill="rgba(74,55,40,0.15)" text-anchor="middle">🤠</text><text x="300" y="340" font-family="sans-serif" font-size="14" fill="rgba(74,55,40,0.3)" text-anchor="middle">Imagen ${i + 1}</text></svg>`
      )}`
  );
};

export const getPlaceholderImage = (width: number, height: number, label: string, seed = 0): string => {
  const bg = placeholderBg(seed);
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect fill="${bg}" width="${width}" height="${height}"/><text x="${width / 2}" y="${height / 2}" font-family="serif" font-size="${Math.min(width, height) * 0.12}" fill="rgba(74,55,40,0.2)" text-anchor="middle" dominant-baseline="middle">🤠</text><text x="${width / 2}" y="${height / 2 + 30}" font-family="sans-serif" font-size="12" fill="rgba(74,55,40,0.3)" text-anchor="middle">${label}</text></svg>`
  )}`;
};

export const products: Product[] = [
  {
    id: "domador-texana-classic",
    name: { es: "Texana Clásica", en: "Classic Texana" },
    brand: "Domador",
    type: "Texanas",
    price: 2450,
    badge: "premium",
    sizes: ["56", "57", "58", "59", "60", "61"],
    description: { es: "Texana de fieltro premium con acabado artesanal. Perfecta para el jinete moderno que busca calidad y tradición.", en: "Premium felt texana with artisan finish. Perfect for the modern rider seeking quality and tradition." },
    materials: { es: "Fieltro 100% lana. Limpiar con cepillo suave. Almacenar en lugar fresco y seco.", en: "100% wool felt. Clean with soft brush. Store in cool, dry place." },
  },
  {
    id: "domador-palma-ranch",
    name: { es: "Palma Ranchera", en: "Ranch Palm" },
    brand: "Domador",
    type: "Palma",
    price: 1850,
    badge: "new",
    sizes: ["56", "57", "58", "59", "60"],
    description: { es: "Sombrero de palma tejido a mano con copa alta y ala ancha. Ideal para el trabajo en el rancho.", en: "Hand-woven palm hat with high crown and wide brim. Ideal for ranch work." },
    materials: { es: "Palma natural tejida a mano. Evitar exposición prolongada al agua.", en: "Natural hand-woven palm. Avoid prolonged water exposure." },
  },
  {
    id: "rocha-fieltro-elegante",
    name: { es: "Fieltro Elegante", en: "Elegant Felt" },
    brand: "Rocha Hats",
    type: "Fieltro",
    price: 3200,
    badge: "premium",
    sizes: ["57", "58", "59", "60", "61"],
    description: { es: "Sombrero de fieltro de alta gama con detalle de cinta de piel. Elegancia western en su máxima expresión.", en: "High-end felt hat with leather ribbon detail. Western elegance at its finest." },
    materials: { es: "Fieltro premium, cinta de piel genuina. Cepillar en dirección de la fibra.", en: "Premium felt, genuine leather ribbon. Brush in fiber direction." },
  },
  {
    id: "rocha-paja-verano",
    name: { es: "Paja Verano", en: "Summer Straw" },
    brand: "Rocha Hats",
    type: "Paja",
    price: 1200,
    sizes: ["56", "57", "58", "59", "60"],
    description: { es: "Sombrero de paja ligero y fresco, perfecto para los meses cálidos. Diseño moderno con toque clásico.", en: "Light and cool straw hat, perfect for warm months. Modern design with classic touch." },
    materials: { es: "Paja natural. Proteger de la lluvia. Guardar en lugar ventilado.", en: "Natural straw. Protect from rain. Store in ventilated area." },
  },
  {
    id: "villalobos-texana-premium",
    name: { es: "Texana Premium VW", en: "VW Premium Texana" },
    brand: "Villalobos Hats",
    type: "Texanas",
    price: 2800,
    badge: "premium",
    sizes: ["56", "57", "58", "59", "60", "61"],
    description: { es: "Nuestra texana insignia. Confeccionada con los mejores materiales y acabados exclusivos de Villalobos Hats.", en: "Our flagship texana. Crafted with the finest materials and exclusive Villalobos Hats finishes." },
    materials: { es: "Fieltro de lana premium con forro interior de seda. Incluye caja de presentación.", en: "Premium wool felt with silk inner lining. Includes presentation box." },
  },
  {
    id: "villalobos-fieltro-montana",
    name: { es: "Fieltro Montaña", en: "Mountain Felt" },
    brand: "Villalobos Hats",
    type: "Fieltro",
    price: 2600,
    badge: "new",
    sizes: ["57", "58", "59", "60"],
    description: { es: "Inspirado en las sierras mexicanas. Fieltro resistente con estilo contemporáneo.", en: "Inspired by Mexican mountain ranges. Durable felt with contemporary style." },
    materials: { es: "Fieltro de lana reforzado. Resistente a la intemperie.", en: "Reinforced wool felt. Weather resistant." },
  },
  {
    id: "domador-fieltro-negro",
    name: { es: "Fieltro Negro Clásico", en: "Classic Black Felt" },
    brand: "Domador",
    type: "Fieltro",
    price: 2300,
    sizes: ["56", "57", "58", "59", "60", "61"],
    description: { es: "El clásico sombrero negro de fieltro. Atemporal y versátil para cualquier ocasión.", en: "The classic black felt hat. Timeless and versatile for any occasion." },
    materials: { es: "Fieltro 100% lana teñido en negro. Mantener alejado del polvo.", en: "100% wool felt dyed in black. Keep away from dust." },
  },
  {
    id: "rocha-texana-rodeo",
    name: { es: "Texana Rodeo", en: "Rodeo Texana" },
    brand: "Rocha Hats",
    type: "Texanas",
    price: 2900,
    badge: "premium",
    sizes: ["57", "58", "59", "60", "61"],
    description: { es: "Diseñada para el rodeo profesional. Resistente, con estilo audaz y detalles únicos.", en: "Designed for professional rodeo. Durable, bold style with unique details." },
    materials: { es: "Fieltro reforzado con banda de piel bordada. Alta resistencia.", en: "Reinforced felt with embroidered leather band. High durability." },
  },
  {
    id: "villalobos-palma-artesanal",
    name: { es: "Palma Artesanal VW", en: "VW Artisan Palm" },
    brand: "Villalobos Hats",
    type: "Palma",
    price: 1950,
    badge: "new",
    sizes: ["56", "57", "58", "59", "60"],
    description: { es: "Palma tejida artesanalmente por maestros sombrereros. Cada pieza es única.", en: "Artisanally woven palm by master hatmakers. Each piece is unique." },
    materials: { es: "Palma natural seleccionada. Tejido artesanal. Cada pieza tiene variaciones naturales.", en: "Selected natural palm. Artisan weave. Each piece has natural variations." },
  },
  {
    id: "domador-paja-campo",
    name: { es: "Paja Campo", en: "Field Straw" },
    brand: "Domador",
    type: "Paja",
    price: 980,
    sizes: ["56", "57", "58", "59", "60"],
    description: { es: "Sombrero de paja duradero para el trabajo diario. Ligero y cómodo.", en: "Durable straw hat for daily work. Lightweight and comfortable." },
    materials: { es: "Paja trenzada natural. Lavable con paño húmedo.", en: "Natural braided straw. Wipeable with damp cloth." },
  },
  {
    id: "rocha-palma-moderna",
    name: { es: "Palma Moderna", en: "Modern Palm" },
    brand: "Rocha Hats",
    type: "Palma",
    price: 1650,
    sizes: ["57", "58", "59", "60"],
    description: { es: "Reinterpretación moderna del clásico sombrero de palma. Líneas limpias, acabado impecable.", en: "Modern reinterpretation of the classic palm hat. Clean lines, impeccable finish." },
    materials: { es: "Palma natural con acabado satinado. Cinta de tela premium.", en: "Natural palm with satin finish. Premium fabric ribbon." },
  },
  {
    id: "villalobos-paja-dorada",
    name: { es: "Paja Dorada VW", en: "VW Golden Straw" },
    brand: "Villalobos Hats",
    type: "Paja",
    price: 1400,
    sizes: ["56", "57", "58", "59", "60", "61"],
    description: { es: "Paja premium con tono dorado natural. Exclusiva de Villalobos Hats.", en: "Premium straw with natural golden tone. Exclusive to Villalobos Hats." },
    materials: { es: "Paja seleccionada de tono dorado. Proteger del agua. Guardar en caja.", en: "Selected golden-toned straw. Protect from water. Store in box." },
  },
];
