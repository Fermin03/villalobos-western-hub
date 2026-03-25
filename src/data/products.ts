// ============================================================
// src/data/products.ts — Datos de productos
// Exporta los productos desde la API del backend
// Los productos hardcodeados se eliminaron — ahora vienen de MySQL
// ============================================================

import { obtenerProductos, obtenerProducto } from '@/services/api';

// Tipo de producto usado en todo el frontend
export interface Product {
  id: number;
  nombre: string;
  slug: string;
  marca: string;
  categoria: string;
  precio: number;
  precio_mayoreo?: number;
  stock: number;
  imagen_principal: string;
  imagenes: string[];
  descripcion?: string;
  tallas: string[];
  colores: string[];
  destacado: boolean;
  activo: boolean;
}

// Obtiene todos los productos del catálogo desde la API
export async function getProducts(filtros?: {
  marca?: string;
  categoria?: string;
  orden?: string;
}): Promise<Product[]> {
  try {
    return await obtenerProductos(filtros);
  } catch (error) {
    console.error('Error al cargar productos:', error);
    return [];
  }
}

// Obtiene un producto individual por su slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await obtenerProducto(slug);
  } catch (error) {
    console.error('Error al cargar producto:', error);
    return null;
  }
}
// ============================================================
// getPlaceholderImages — Compatibilidad con ProductCard
// Genera imágenes placeholder mientras no hay fotos reales
// ============================================================
export function getPlaceholderImages(count: number = 3): string[] {
  return Array.from({ length: count }, (_, i) => 
    `https://placehold.co/600x400/4A3728/F5EFE0?text=Sombrero+${i + 1}`
  );
}
// getPlaceholderImage — Versión singular, compatibilidad con Index.tsx
export function getPlaceholderImage(index: number = 0): string {
  return `https://placehold.co/600x400/4A3728/F5EFE0?text=Sombrero+${index + 1}`;
}
// products — Array vacío inicial para compatibilidad con componentes existentes
// Los datos reales se cargan de forma asíncrona con getProducts()
export const products: Product[] = [];