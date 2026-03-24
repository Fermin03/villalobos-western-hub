/**
 * HOOK — Intersection Observer para animaciones fade-in al scroll.
 */
import { useEffect, useRef } from "react";

export function useFadeInOnScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    /* Observa el contenedor y todos sus hijos con la clase fade-in-section */
    const sections = el.querySelectorAll(".fade-in-section");
    sections.forEach((s) => observer.observe(s));
    if (el.classList.contains("fade-in-section")) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
}
