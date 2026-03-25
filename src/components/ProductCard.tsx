/**
 * PRODUCT CARD — Tarjeta de producto con hover-slider de imágenes.
 * Cicla imágenes cada 800ms al hover. Muestra marca, precio y botón "Agregar al carrito".
 * CORREGIDO: Usa campos del backend (nombre, marca, precio, tallas, imagen_principal, imagenes)
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { type Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [currentImg, setCurrentImg] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Usa las imágenes reales del producto, con fallback a placeholder
  const images: string[] = (() => {
    const imgs: string[] = [];
    if (product.imagen_principal) imgs.push(product.imagen_principal);
    if (product.imagenes && product.imagenes.length > 0) {
      product.imagenes.forEach((img) => {
        if (img && !imgs.includes(img)) imgs.push(img);
      });
    }
    if (imgs.length === 0) {
      imgs.push(`https://placehold.co/600x600/4A3728/F5EFE0?text=${encodeURIComponent(product.nombre)}`);
    }
    return imgs;
  })();

  /* Cicla imágenes cada 800ms al hacer hover */
  useEffect(() => {
    if (isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImg((prev) => (prev + 1) % images.length);
      }, 800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentImg(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, images.length]);

  // Color del badge según la marca
  const brandBadgeColor =
    product.marca === "Villalobos Hats"
      ? "bg-gold text-gold-foreground"
      : "bg-accent text-accent-foreground";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.nombre,
      brand: product.marca,
      price: product.precio,
      size: product.tallas?.[0] || "",
      quantity: 1,
      image: images[0],
    });
  };

  return (
    <Link
      to={`/producto/${product.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-card rounded-lg overflow-hidden transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.nombre} ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                i === currentImg ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Badge destacado */}
          {product.destacado && (
            <span className="absolute top-3 left-3 text-xs font-body font-semibold px-3 py-1 rounded bg-gold text-gold-foreground">
              {t("product.premium")}
            </span>
          )}

          {/* Sin stock */}
          {product.stock === 0 && (
            <span className="absolute top-3 right-3 text-xs font-body font-semibold px-3 py-1 rounded bg-destructive text-destructive-foreground">
              Agotado
            </span>
          )}

          {/* Dot Indicators — solo si hay más de 1 imagen */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === currentImg ? "bg-primary" : "bg-primary/30"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Botón agregar al carrito — sube al hacer hover */}
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground font-body text-sm py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            >
              {t("product.addtocart")}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <span className={`text-xs font-body font-medium px-2 py-0.5 rounded ${brandBadgeColor}`}>
            {product.marca}
          </span>
          <h3 className="font-display text-base mt-2 text-foreground">{product.nombre}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-body text-lg font-semibold text-primary">
              ${product.precio.toLocaleString("es-MX")} MXN
            </p>
            {product.precio_mayoreo && (
              <p className="font-body text-xs text-muted-foreground">
                Mayoreo: ${product.precio_mayoreo.toLocaleString("es-MX")}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;