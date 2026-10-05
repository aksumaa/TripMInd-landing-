import { useEffect, useRef } from "react";
import { geoOrthographic, geoPath, geoGraticule10, geoInterpolate, geoDistance } from "d3-geo";
import { feature } from "topojson-client";
import land110 from "world-atlas/land-110m.json";

export const CITIES = {
  tashkent: [69.24, 41.31],
  istanbul: [28.98, 41.01],
  paris: [2.35, 48.86],
  dubai: [55.27, 25.2],
  tokyo: [139.69, 35.69],
  newyork: [-74.0, 40.71],
  rome: [12.5, 41.9],
  bali: [115.19, -8.41],
  london: [-0.13, 51.51],
  cairo: [31.24, 30.04],
} as const;
export type CityKey = keyof typeof CITIES;
type LL = [number, number];
const ll = (k: CityKey) => CITIES[k] as unknown as LL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo = land110 as any;
const LAND = feature(topo, topo.objects.land);
const GRAT = geoGraticule10();

type Props = {
  routes?: [CityKey, CityKey][];
  markers?: CityKey[];
  focus?: CityKey | null;
  labels?: Partial<Record<CityKey, string>>;
  onSelect?: (c: CityKey) => void;
  initial?: LL;
  speed?: number;
  className?: string;
};

export function Globe(props: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pr = useRef(props);
  pr.current = props;

  useEffect(() => {
    const el = wrap.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const c = (n: string) => css.getPropertyValue(n).trim();
    const C = {
      ocean: c("--globe-ocean"), oceanHi: c("--globe-ocean-hi"), land: c("--globe-land"),
      edge: c("--globe-land-edge"), grid: c("--globe-grid"), route: c("--globe-route"),
      faint: c("--globe-route-faint"), glow: c("--globe-glow"), shade: c("--globe-shade"),
      lbg: c("--globe-label-bg"), lfg: c("--globe-label"), plane: c("--globe-plane"),
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const init = props.initial ?? [-50, -25];
    const rot: LL = [init[0], init[1]];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    let drag: { x: number; y: number; moved: number } | null = null;
    let screen: { k: CityKey; x: number; y: number }[] = [];
    const proj = geoOrthographic().clipAngle(90);
    const path = geoPath(proj, ctx);

    const resize = () => {
      const r = el.getBoundingClientRect();
      w = r.width; h = r.height; dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = w * dpr; cv.height = h * dpr;
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(el);

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || !w) return;
      const p = pr.current;
      if (p.focus && !drag) {
        const [lon, lat] = ll(p.focus);
        const d = ((-lon - rot[0] + 540) % 360) - 180;
        rot[0] += d * 0.05; rot[1] += (-lat * 0.7 - rot[1]) * 0.05;
      } else if (!drag && !reduce) rot[0] += p.speed ?? 0.08;
      mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;
      const R = (Math.min(w, h) / 2) * 0.86;
      const r0 = rot[0] + mouse.x * 10, r1 = rot[1] - mouse.y * 6;
      proj.scale(R).translate([w / 2, h / 2]).rotate([r0, r1]);
      const center: LL = [-r0, -r1];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(w / 2, h / 2, R * 0.9, w / 2, h / 2, R * 1.25);
      glow.addColorStop(0, C.glow); glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(w / 2, h / 2, R * 1.25, 0, Math.PI * 2); ctx.fill();

      const oc = ctx.createRadialGradient(w / 2 - R * 0.35, h / 2 - R * 0.4, R * 0.1, w / 2, h / 2, R);
      oc.addColorStop(0, C.oceanHi); oc.addColorStop(1, C.ocean);
      ctx.fillStyle = oc; ctx.beginPath(); path({ type: "Sphere" }); ctx.fill();

      ctx.beginPath(); path(GRAT); ctx.strokeStyle = C.grid; ctx.lineWidth = 0.6; ctx.stroke();
      ctx.beginPath(); path(LAND); ctx.fillStyle = C.land; ctx.fill();
      ctx.strokeStyle = C.edge; ctx.lineWidth = 0.6; ctx.stroke();

      const sh = ctx.createRadialGradient(w / 2 - R * 0.3, h / 2 - R * 0.35, R * 0.4, w / 2, h / 2, R * 1.02);
      sh.addColorStop(0, "transparent"); sh.addColorStop(1, C.shade);
      ctx.fillStyle = sh; ctx.beginPath(); path({ type: "Sphere" }); ctx.fill();

      const routes = p.routes ?? [];
      const keys = new Set<CityKey>(p.markers ?? []);
      routes.forEach(([a, b], i) => {
        keys.add(a); keys.add(b);
        const A = ll(a), B = ll(b), ip = geoInterpolate(A, B);
        ctx.beginPath(); path({ type: "LineString", coordinates: [A, B] });
        ctx.strokeStyle = C.faint; ctx.lineWidth = 1; ctx.stroke();
        const prog = reduce ? 1 : ((t / 1000) * 0.16 + i * 0.37) % 1;
        const pts: LL[] = [];
        for (let s = 0; s <= 30; s++) pts.push(ip((s / 30) * prog) as LL);
        ctx.save(); ctx.shadowColor = C.route; ctx.shadowBlur = 10;
        ctx.beginPath(); path({ type: "LineString", coordinates: pts });
        ctx.strokeStyle = C.route; ctx.lineWidth = 1.8; ctx.stroke(); ctx.restore();
        const pos = ip(prog) as LL;
        if (geoDistance(pos, center) < Math.PI / 2 - 0.05) {
          const s1 = proj(pos)!, s2 = proj(ip(Math.min(prog + 0.01, 1)) as LL)!;
          const ang = Math.atan2(s2[1] - s1[1], s2[0] - s1[0]);
          ctx.save(); ctx.translate(s1[0], s1[1]); ctx.rotate(ang);
          ctx.fillStyle = C.plane; ctx.shadowColor = C.route; ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(7, 0); ctx.lineTo(-4, -5); ctx.lineTo(-2, 0); ctx.lineTo(-4, 5); ctx.closePath();
          ctx.fill(); ctx.restore();
        }
      });

      screen = [];
      ctx.font = "500 11px Geist, system-ui, sans-serif";
      keys.forEach((k) => {
        const g = ll(k);
        if (geoDistance(g, center) > Math.PI / 2 - 0.08) return;
        const [x, y] = proj(g)!;
        screen.push({ k, x, y });
        const sel = p.focus === k;
        const pulse = ((t / 1400) % 1);
        ctx.beginPath(); ctx.arc(x, y, 3 + pulse * (sel ? 18 : 10), 0, Math.PI * 2);
        ctx.strokeStyle = C.route; ctx.globalAlpha = 1 - pulse; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(x, y, sel ? 4.5 : 3, 0, Math.PI * 2); ctx.fillStyle = C.route; ctx.fill();
        const label = p.labels?.[k];
        if (label) {
          const tw = ctx.measureText(label).width + 16;
          ctx.fillStyle = C.lbg;
          ctx.beginPath(); ctx.roundRect(x + 9, y - 22, tw, 20, 10); ctx.fill();
          ctx.fillStyle = C.lfg; ctx.fillText(label, x + 17, y - 8);
        }
      });
    };
    raf = requestAnimationFrame(draw);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (drag) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        rot[0] += dx * 0.3; rot[1] = Math.max(-60, Math.min(60, rot[1] - dy * 0.3));
        drag.x = e.clientX; drag.y = e.clientY;
      }
    };
    const onDown = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY, moved: 0 }; };
    const onUp = (e: PointerEvent) => {
      if (drag && drag.moved < 5) {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const hit = screen.find((s) => Math.hypot(s.x - x, s.y - y) < 16);
        if (hit) pr.current.onSelect?.(hit.k);
      }
      drag = null;
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrap} className={`relative cursor-grab select-none active:cursor-grabbing ${props.className ?? ""}`} style={{ touchAction: "pan-y" }}>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-label="Interactive 3D globe" role="img" />
    </div>
  );
}
