/**
 * CATÁLOGO — Grid de productos con filtros dinámicos desde el backend.
 * ACTUALIZADO: Los tipos de sombrero se cargan desde MySQL, no hardcodeados.
 */
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/data/products";
import type { Product } from "@/data/products";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const brandOptions = ["Domador", "Rocha Hats", "Villalobos Hats"];
const priceRanges = [
  { label: "$200 - $500", min: 200, max: 500 },
  { label: "$500 - $1,500", min: 500, max: 1500 },
  { label: "$1,500 - $3,000", min: 1500, max: 3000 },
  { label: "$3,000 - $5,000", min: 3000, max: 5000 },
];
const sizeOptions = ["56", "57", "58", "59", "60", "61"];

const Catalog = () => {
  const { t, lang } = useLanguage();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showCount, setShowCount] = useState(12);

  // Productos desde el backend
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Categorías dinámicas desde el backend
  const [typeOptions, setTypeOptions] = useState<string[]>([]);

  // Cargar productos y categorías al montar
  useEffect(() => {
    setLoading(true);

    Promise.all([
      getProducts(),
      fetch(`${API_URL}/admin/categorias`).then(r => r.json()),
    ])
      .then(([productosData, categoriasData]) => {
        setAllProducts(productosData);
        if (categoriasData.ok) {
          setTypeOptions(categoriasData.data.map((c: any) => c.nombre));
        }
        setError(null);
      })
      .catch((err) => {
        console.error("Error al cargar catálogo:", err);
        setError("No se pudieron cargar los productos. Intenta de nuevo.");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedPriceRange(null);
    setSelectedSizes([]);
  };

  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (selectedBrands.length) {
      result = result.filter((p) => selectedBrands.includes(p.marca));
    }
    if (selectedTypes.length) {
      result = result.filter((p) => selectedTypes.includes(p.categoria));
    }
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      result = result.filter((p) => p.precio >= range.min && p.precio <= range.max);
    }
    if (selectedSizes.length) {
      result = result.filter((p) => p.tallas.some((s) => selectedSizes.includes(s)));
    }

    switch (sortBy) {
      case "priceAsc":  result.sort((a, b) => a.precio - b.precio); break;
      case "priceDesc": result.sort((a, b) => b.precio - a.precio); break;
      case "newest":    result.sort((a, b) => b.id - a.id); break;
      default: result.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)); break;
    }

    return result;
  }, [allProducts, selectedBrands, selectedTypes, selectedPriceRange, selectedSizes, sortBy]);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Marca */}
      <div>
        <h4 className="font-body font-semibold text-sm mb-3">{t("catalog.filter.brand")}</h4>
        {brandOptions.map((b) => (
          <label key={b} className="flex items-center gap-2 font-body text-sm cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={selectedBrands.includes(b)}
              onChange={() => toggleFilter(selectedBrands, b, setSelectedBrands)}
              className="accent-accent"
            />
            {b}
          </label>
        ))}
      </div>

      {/* Tipo de sombrero — dinámico */}
      <div>
        <h4 className="font-body font-semibold text-sm mb-3">Tipo de sombrero</h4>
        {typeOptions.length === 0 ? (
          <p className="font-body text-xs text-muted-foreground">Cargando tipos...</p>
        ) : (
          typeOptions.map((tp) => (
            <label key={tp} className="flex items-center gap-2 font-body text-sm cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={selectedTypes.includes(tp)}
                onChange={() => toggleFilter(selectedTypes, tp, setSelectedTypes)}
                className="accent-accent"
              />
              {tp}
            </label>
          ))
        )}
      </div>

      {/* Precio */}
      <div>
        <h4 className="font-body font-semibold text-sm mb-3">{t("catalog.filter.price")}</h4>
        {priceRanges.map((pr, i) => (
          <label key={i} className="flex items-center gap-2 font-body text-sm cursor-pointer mb-2">
            <input
              type="radio"
              name="price"
              checked={selectedPriceRange === i}
              onChange={() => setSelectedPriceRange(i)}
              className="accent-accent"
            />
            {pr.label}
          </label>
        ))}
      </div>

      {/* Talla */}
      <div>
        <h4 className="font-body font-semibold text-sm mb-3">{t("catalog.filter.size")}</h4>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((s) => (
            <button
              key={s}
              onClick={() => toggleFilter(selectedSizes, s, setSelectedSizes)}
              className={`w-10 h-10 rounded font-body text-sm border transition-colors ${
                selectedSizes.includes(s)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button onClick={clearFilters} className="font-body text-sm text-accent hover:underline">
        {t("catalog.clear")}
      </button>
    </div>
  );

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="font-body text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">{t("catalog.breadcrumb.home")}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{t("catalog.breadcrumb.hats")}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">{t("catalog.title")}</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {loading
              ? "Cargando productos..."
              : `${t("catalog.showing")} ${Math.min(showCount, filtered.length)} ${t("catalog.products")}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="font-body text-sm bg-card border border-border rounded px-3 py-2"
          >
            <option value="relevance">{t("catalog.sort.relevance")}</option>
            <option value="priceAsc">{t("catalog.sort.priceAsc")}</option>
            <option value="priceDesc">{t("catalog.sort.priceDesc")}</option>
            <option value="newest">{t("catalog.sort.newest")}</option>
          </select>
          <button
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 font-body text-sm border border-border rounded px-3 py-2"
          >
            <Filter size={16} /> {t("catalog.filters")}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar de filtros — desktop */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
          <FilterPanel />
        </aside>

        {/* Grid de productos */}
        <div className="flex-1">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg aspect-[3/4] animate-pulse" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-16">
              <p className="font-body text-destructive mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="font-body text-sm text-accent hover:underline">
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="font-body text-muted-foreground">
                {allProducts.length === 0
                  ? "No hay productos disponibles por el momento."
                  : "No se encontraron productos con los filtros seleccionados."}
              </p>
              {allProducts.length > 0 && (
                <button onClick={clearFilters} className="font-body text-sm text-accent hover:underline mt-2">
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.slice(0, showCount).map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
              {showCount < filtered.length && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setShowCount((c) => c + 12)}
                    className="px-8 py-3 border-2 border-primary text-primary font-body text-sm rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {t("catalog.loadmore")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Drawer de filtros — móvil */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-background p-6 overflow-auto animate-[slide-in-right_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg">{t("catalog.filters")}</h3>
              <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;