import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.25): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

/** 0 when the section top hits the viewport top, 1 when its bottom reaches the viewport bottom. */
export function useScrollProgress<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        setP(total <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / total)));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return [ref, p];
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} data-visible={seen} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 text-lg font-semibold tracking-tight ${dark ? "text-on-dark" : "text-foreground"}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
        <defs>
          <linearGradient id="tmg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--cyan)" />
            <stop offset="1" stopColor="var(--azure)" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="11" fill="none" stroke="url(#tmg)" strokeWidth="2.2" />
        <ellipse cx="16" cy="16" rx="15" ry="6" fill="none" stroke="url(#tmg)" strokeWidth="1.4" transform="rotate(-25 16 16)" />
        <circle cx="27" cy="10.5" r="2.2" fill="var(--cyan)" />
      </svg>
      TripMind
    </span>
  );
}
