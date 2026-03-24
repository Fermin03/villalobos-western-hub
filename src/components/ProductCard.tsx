/**
 * PRODUCT CARD — Tarjeta de producto con hover-slider de imágenes.
 * Cicla imágenes cada 800ms al hover. Muestra marca, precio y botón "Agregar al carrito".
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { type Product, getPlaceholderImages } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const [currentImg, setCurrentImg] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const images = getPlaceholderImages(index);

  /* Cicla imágenes cada 800ms al hacer hover */
  useEffect(() => {
    if (isHovered) {
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

  const badgeLabel = product.badge === "new" ? t("product.new") : product.badge === "premium" ? t("product.premium") : null;
  const brandBadgeColor = product.brand === "Villalobos Hats" ? "bg-gold text-gold-foreground" : "bg-accent text-accent-foreground";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name[lang],
      brand: product.brand,
      price: product.price,
      size: product.sizes[2] || product.sizes[0],
      quantity: 1,
      image: images[0],
    });
  };

  return (
    <Link
      to={`/producto/${product.id}`}
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
              alt={`${product.name[lang]} ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                i === currentImg ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Badge */}
          {badgeLabel && (
            <span className={`absolute top-3 left-3 text-xs font-body font-semibold px-3 py-1 rounded ${
              product.badge === "premium" ? "bg-gold text-gold-foreground" : "bg-accent text-accent-foreground"
            }`}>
              {badgeLabel}
            </span>
          )}

          {/* Dot Indicators */}
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

          {/* Add to cart button — slides up on hover */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground font-body text-sm py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            {t("product.addtocart")}
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <span className={`text-xs font-body font-medium px-2 py-0.5 rounded ${brandBadgeColor}`}>
            {product.brand}
          </span>
          <h3 className="font-display text-base mt-2 text-foreground">{product.name[lang]}</h3>
          <p className="font-body text-lg font-semibold text-primary mt-1">${product.price.toLocaleString()} MXN</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
