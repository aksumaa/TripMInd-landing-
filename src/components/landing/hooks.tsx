import { useEffect, useRef, useState, type ReactNode, type RefObject, type PointerEvent } from "react";
import logoAsset from "@/assets/tripmind-logo.png.asset.json";
import markAsset from "@/assets/tripmind-mark.png.asset.json";

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
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
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

/** Subtle pointer-driven 3D tilt (max ~5deg). Disabled for touch and reduced motion. */
export function Tilt({ children, className = "", max = 5 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateZ(0)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`tilt ${className}`}>{children}</div>;
}

export function Logo({ dark = false, size = "md" }: { dark?: boolean; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-7" : "h-8";
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${dark ? "text-on-dark" : "text-foreground"}`}>
      <img src={markAsset.url} alt="" className={`${h} w-auto rounded-full`} />
      <span className="text-[1.15rem]"><span className="font-bold">Trip</span><span className="font-normal">Mind</span></span>
    </span>
  );
}
export const LOGO_FULL = logoAsset.url;
