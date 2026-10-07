import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Search, MapPin, Plane, Sparkles, Calendar, Wallet, Menu, X, Moon, Sun, Bookmark, BookmarkCheck, Clock, Compass } from "lucide-react";
import { useI18n, type Lang, type Currency } from "@/lib/i18n";
import { Globe3D } from "./Globe3D";
import { CITIES, PHOTOS, BUDGET, FEATURED, distKm, type CityKey } from "@/lib/destinations";
import dayTex from "@/assets/tex/earth-blue-marble.jpg.asset.json";
import { Logo, Reveal, Tilt, useScrollProgress, useInView } from "./hooks";
import { useIsMobile } from "@/hooks/use-mobile";

const LANGS: Lang[] = ["uz", "ru", "en"];
const CURS: Currency[] = ["USD", "EUR", "UZS"];

function usePlace() {
  const { x } = useI18n();
  return (k: CityKey) => x.places[k];
}
function labelsFor(keys: CityKey[], place: (k: CityKey) => { name: string; country: string }) {
  return Object.fromEntries(keys.map((k) => [k, place(k)])) as Partial<Record<CityKey, { name: string; country: string }>>;
}

export function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <div role="group" aria-label="Language" className={`flex items-center rounded-full border p-0.5 text-xs font-medium ${dark ? "border-on-dark/15" : "border-border"}`}>
      {LANGS.map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
          className={`min-h-8 rounded-full px-2.5 uppercase transition ${lang === l ? (dark ? "bg-on-dark text-navy-deep" : "bg-foreground text-background") : dark ? "text-on-dark-muted hover:text-on-dark" : "text-muted-foreground hover:text-foreground"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

function CurrencySelect({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useI18n();
  return (
    <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}
      className={`min-h-9 rounded-full border border-border bg-transparent px-3 text-xs font-medium ${className}`}>
      {CURS.map((c) => <option key={c}>{c}</option>)}
    </select>
  );
}

function ThemeButton() {
  const { dark, toggleDark, x } = useI18n();
  return (
    <button onClick={toggleDark} aria-label={x.ui.theme} className="grid h-9 w-9 place-items-center rounded-full border border-border transition hover:bg-muted">
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

export function Nav() {
  const { t, x } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  const links = [["#discover", t.nav.discover], ["#planner", t.nav.planner], ["#how", t.nav.how], ["#tours", t.nav.tours], ["#agencies", x.ui.about]];
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-border/60 bg-background/75 shadow-soft backdrop-blur-xl" : "bg-transparent"}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 transition-all duration-300 lg:px-8 ${scrolled ? "h-14" : "h-[4.5rem]"}`}>
        <a href="#top" aria-label="TripMind home" className="shrink-0"><Logo size={scrolled ? "sm" : "md"} /></a>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
          {links.map(([h, l]) => <a key={h} href={h} className="transition hover:text-foreground">{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <CurrencySelect className="hidden sm:block" />
          <div className="hidden sm:block"><LangSwitch /></div>
          <ThemeButton />
          <a href="#planner" className="btn-primary hidden !py-2 !text-sm md:inline-flex">{x.ui.getStarted}</a>
          <button className="grid h-10 w-10 place-items-center rounded-full lg:hidden" aria-label={t.nav.menu} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      {open && (
        <div className="h-[calc(100svh-3.5rem)] border-t border-border bg-background px-5 pb-8 pt-2 lg:hidden">
          {links.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block border-b border-border py-4 text-lg font-medium">{l}</a>)}
          <div className="mt-6 flex items-center gap-3"><LangSwitch /><CurrencySelect /></div>
          <a href="#planner" onClick={() => setOpen(false)} className="btn-primary mt-6 w-full justify-center">{x.ui.getStarted} <ArrowRight size={16} /></a>
        </div>
      )}
    </header>
  );
}

const HERO_MARKERS: CityKey[] = ["tashkent", "istanbul", "paris", "samarkand", "dubai", "rome", "tokyo", "newyork"];

export function Hero() {
  const { t, x, money } = useI18n();
  const place = usePlace();
  const isMobile = useIsMobile();
  const [focus, setFocus] = useState<CityKey | null>(null);
  const [card, setCard] = useState<CityKey>("paris");
  const parallax = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  useEffect(() => { if (focus && focus !== "tashkent") setCard(focus); }, [focus]);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = Math.min(1, window.scrollY / window.innerHeight);
        if (copy.current) { copy.current.style.transform = `translate3d(0, ${-p * 60}px, 0)`; copy.current.style.opacity = String(1 - p * 1.2); }
        if (parallax.current) parallax.current.style.opacity = String(1 - p * 1.6);
      });
    };
    const mm = (e: MouseEvent) => {
      if (!parallax.current) return;
      const dx = e.clientX / window.innerWidth - 0.5, dy = e.clientY / window.innerHeight - 0.5;
      parallax.current.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
        const d = Number(el.dataset.depth);
        el.style.translate = `${dx * d}px ${dy * d}px`;
      });
    };
    window.addEventListener("scroll", on, { passive: true }); window.addEventListener("mousemove", mm, { passive: true });
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("mousemove", mm); };
  }, []);
  const d = x.dest[card];
  return (
    <section id="top" className="relative overflow-hidden bg-background pt-16">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_55%_at_72%_48%,var(--globe-glow),transparent_70%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-4 px-5 pb-16 pt-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <div ref={copy} className="relative z-10 max-w-xl will-change-transform">
          <p className="eyebrow text-azure">{t.hero.eyebrow}</p>
          <h1 className="mt-5 text-[2.6rem] font-semibold uppercase leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[4.6rem]">
            {t.hero.title1}<br /><span className="text-muted-foreground">{t.hero.title2}</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">{t.hero.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#planner" className="btn-primary">{t.hero.cta1} <ArrowRight size={16} /></a>
            <a href="#workspace" className="btn-ghost">{t.hero.cta2}</a>
          </div>
          <p className="eyebrow mt-10 hidden text-muted-foreground sm:block">{t.hero.loop}</p>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[min(92vw,420px)] sm:max-w-[560px] lg:max-w-none">
          <Globe3D className="absolute inset-0" recede compact={isMobile} focus={focus}
            onHover={(k) => setFocus(k)} onSelect={(k) => setFocus(k)}
            routes={[["tashkent", "istanbul"], ["istanbul", "paris"]]} markers={HERO_MARKERS}
            labels={labelsFor(isMobile ? ["tashkent", "istanbul", "paris"] : HERO_MARKERS, place)} initialLon={40} />
          <div ref={parallax} className="pointer-events-none absolute inset-0">
            {/* Boarding pass */}
            <div data-depth="18" className="absolute left-0 top-[10%] hidden w-52 -rotate-6 rounded-xl border border-border bg-card/90 p-3 shadow-card backdrop-blur md:block">
              <p className="eyebrow text-[9px] text-muted-foreground">Boarding pass · TM 204</p>
              <div className="mt-2 flex items-center justify-between font-mono text-lg font-semibold"><span>TAS</span><Plane size={14} className="text-gold" /><span>IST</span></div>
              <div className="mt-2 flex justify-between border-t border-dashed border-border pt-2 text-[10px] text-muted-foreground"><span>12 MAY</span><span>GATE B7</span><span>14A</span></div>
            </div>
            {/* Compass */}
            <div data-depth="-12" className="absolute bottom-[18%] right-[2%] hidden h-14 w-14 place-items-center rounded-full border border-border bg-card/80 shadow-card backdrop-blur md:grid">
              <Compass size={22} className="animate-[spin_24s_linear_infinite] text-gold" />
            </div>
          </div>
          {/* Destination card */}
          <Tilt className="pointer-events-auto absolute bottom-0 left-0 z-10 w-56 sm:bottom-[6%] sm:w-64">
            <div key={card} className="animate-in fade-in slide-in-from-bottom-2 overflow-hidden rounded-xl border border-border bg-card shadow-card duration-500">
              <div className="relative h-24 sm:h-28"><img src={`${PHOTOS[card]}`} alt={place(card).name} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-photo" />
                <p className="absolute bottom-2 left-3 text-sm font-semibold uppercase tracking-[0.14em] text-on-dark">{place(card).name}</p></div>
              <div className="p-3">
                <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">{place(card).country}</span><span className="font-semibold">{x.ui.from} {money(BUDGET[card] ?? 900)}</span></div>
                {d && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{d.style}</p>}
              </div>
            </div>
          </Tilt>
        </div>
      </div>
      <a href="#problem" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted-foreground md:flex">
        <span className="flex h-8 w-5 justify-center rounded-full border border-border pt-1.5"><span className="animate-scroll-dot h-1.5 w-1 rounded-full bg-azure" /></span>
        {t.hero.scroll}
      </a>
    </section>
  );
}

const CHIP_POS = [[-36, -30], [32, -34], [-42, 6], [40, 2], [-28, 34], [26, 36], [-6, -42], [4, 44]];

export function Problem() {
  const { t } = useI18n();
  const [ref, p] = useScrollProgress<HTMLElement>();
  const isMobile = useIsMobile();
  const k = Math.min(1, Math.max(0, (p - 0.1) / 0.5));
  const done = p > 0.6;
  const spread = isMobile ? 0.55 : 1;
  return (
    <section id="problem" ref={ref} className="relative h-[220vh] bg-surface">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5">
        <p className="eyebrow text-azure">{t.problem.eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-center text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          {done ? t.problem.together : t.problem.title}
        </h2>
        <div className="relative mt-8 h-[40vh] w-full max-w-4xl">
          {t.problem.chips.map((c, i) => {
            const [cx, cy] = CHIP_POS[i];
            return (
              <span key={i} className="absolute left-1/2 top-1/2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] shadow-card transition-opacity duration-500 sm:px-4 sm:text-sm"
                style={{ transform: `translate(-50%,-50%) translate3d(${cx * (1 - k) * spread}vw, ${cy * (1 - k) * 0.8}vh, 0) rotate(${(i % 2 ? 5 : -5) * (1 - k)}deg) scale(${1 - k * 0.3})`, opacity: done ? 0 : 1 }}>
                {c}
              </span>
            );
          })}
          <div className="absolute left-1/2 top-1/2 flex flex-col items-center gap-4 rounded-2xl bg-navy px-6 py-6 text-on-dark shadow-glow transition-all duration-700 sm:px-8"
            style={{ opacity: done ? 1 : 0, transform: `translate(-50%,-50%) scale(${done ? 1 : 0.8})` }}>
            <Logo dark />
            <div className="grid grid-cols-4 gap-1.5">
              {t.problem.chips.map((c) => <span key={c} className="rounded-md bg-on-dark/10 px-2 py-1 text-center text-[10px] text-on-dark-muted">{c}</span>)}
            </div>
          </div>
        </div>
        <div className="mt-6 grid w-full max-w-5xl grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
          {t.problem.points.map((pt, i) => (
            <div key={i} className="border-t border-border pt-3">
              <p className="font-mono text-xs text-azure">0{i + 1}</p>
              <p className="mt-1 text-sm font-medium">{pt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Workspace() {
  const { t, money } = useI18n();
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  const w = t.workspace;
  const fields: [string, string][] = [
    [w.fields.destination, `${t.cities.istanbul}, ${t.countries.istanbul}`], [w.fields.dates, w.values.dates],
    [w.fields.travelers, w.values.travelers], [w.fields.budget, money(500)],
    [w.fields.style, w.values.style], [w.fields.interests, w.values.interests],
  ];
  const budget = [[w.budgetRows[0], 180], [w.budgetRows[1], 120], [w.budgetRows[2], 60], [w.budgetRows[3], 90]] as const;
  const show = (i: number) => ({ style: { transitionDelay: `${i * 90}ms` }, className: `transition-all duration-700 ${seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}` });
  const panel = "rounded-xl border border-on-dark/5 bg-navy-deep/70 p-4";
  return (
    <section id="workspace" className="overflow-hidden bg-gradient-dark py-24 text-on-dark sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-gold">{w.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{w.title1}<br /><span className="text-on-dark-muted">{w.title2}</span></h2>
          <p className="mt-5 text-lg text-on-dark-muted">{w.sub}</p>
        </Reveal>
        <div className="mt-14 [perspective:1600px]">
          <div ref={ref} className="glass-dark rounded-2xl p-3 shadow-card transition-transform duration-[1200ms] ease-out sm:p-4" style={{ transform: seen ? "rotateX(0deg)" : "rotateX(14deg) translateY(30px)" }}>
            <div className="flex items-center gap-1.5 px-2 pb-3"><span className="h-2.5 w-2.5 rounded-full bg-on-dark/20" /><span className="h-2.5 w-2.5 rounded-full bg-on-dark/20" /><span className="h-2.5 w-2.5 rounded-full bg-on-dark/20" /><span className="ml-3 text-xs text-on-dark-muted">tripmind.app / istanbul-may</span></div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
              {fields.map(([l, v], i) => (
                <div key={l} {...show(i)}><div className="rounded-lg bg-navy-deep/70 px-3 py-2.5"><p className="text-[11px] text-on-dark-muted">{l}</p><p className="mt-0.5 truncate text-sm font-medium">{v}</p></div></div>
              ))}
            </div>
            <div className="mt-2 grid gap-2 lg:grid-cols-[1.4fr_1fr_1fr]">
              <div {...show(6)}>
                <div className={`relative h-64 overflow-hidden sm:h-72 ${panel}`}>
                  <p className="relative z-10 flex items-center gap-2 text-xs text-on-dark-muted"><MapPin size={13} />{w.panels.map}</p>
                  <svg viewBox="0 0 400 220" className="absolute inset-0 h-full w-full opacity-90" aria-hidden>
                    {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={i * 44} y1="0" x2={i * 44 - 60} y2="220" stroke="var(--globe-grid)" />)}
                    <path d="M60 170 C 120 120, 160 150, 210 100 S 300 60, 340 70" fill="none" stroke="var(--gold)" strokeWidth="2" className="animate-dash" />
                    {[[60, 170], [210, 100], [340, 70], [150, 140]].map(([cx, cy], i) => <g key={i}><circle cx={cx} cy={cy} r="10" fill="var(--globe-glow)" /><circle cx={cx} cy={cy} r="4" fill="var(--cyan)" /></g>)}
                  </svg>
                </div>
              </div>
              <div {...show(7)}>
                <div className={`h-64 sm:h-72 ${panel}`}>
                  <p className="flex items-center gap-2 text-xs text-on-dark-muted"><Calendar size={13} />{w.panels.itinerary}</p>
                  <div className="mt-3 flex gap-1">{[1, 2, 3, 4, 5].map((d) => <span key={d} className={`flex-1 rounded py-1 text-center text-[11px] ${d === 1 ? "bg-gold text-navy-deep" : "bg-on-dark/5 text-on-dark-muted"}`}>{d}</span>)}</div>
                  <ul className="mt-3 space-y-2">
                    {["09:00", "12:30", "14:00", "18:30"].map((tm, i) => (
                      <li key={tm} className="flex gap-3 rounded-md bg-on-dark/5 px-3 py-2 text-sm"><span className="font-mono text-xs text-cyan">{tm}</span><span className="truncate">{t.planner.items[i]}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="grid gap-2">
                <div {...show(8)}>
                  <div className={panel}>
                    <p className="flex items-center gap-2 text-xs text-on-dark-muted"><Wallet size={13} />{w.panels.budget}</p>
                    <p className="mt-2 text-2xl font-semibold">{money(450)} <span className="text-xs font-normal text-on-dark-muted">/ {money(500)}</span></p>
                    <div className="mt-3 space-y-1.5">
                      {budget.map(([l, v]) => (
                        <div key={l} className="flex items-center gap-2 text-[11px] text-on-dark-muted"><span className="w-20 truncate">{l}</span>
                          <span className="h-1.5 flex-1 rounded-full bg-on-dark/10"><span className="block h-full rounded-full bg-gradient-accent transition-all duration-1000" style={{ width: seen ? `${(v / 180) * 100}%` : "0%" }} /></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div {...show(9)}>
                  <div className="rounded-xl border border-gold/30 bg-navy-deep/70 p-4 lg:-translate-x-3 lg:shadow-card">
                    <p className="flex items-center gap-2 text-xs text-gold"><Sparkles size={13} />{w.panels.ai}</p>
                    <ul className="mt-2 space-y-1.5 text-xs text-on-dark-muted">{w.tips.slice(0, 2).map((tip) => <li key={tip}>• {tip}</li>)}</ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SEARCHABLE: CityKey[] = ["istanbul", "paris", "tokyo", "dubai", "rome", "samarkand", "marrakech", "bali", "maldives", "reykjavik", "alps", "newyork", "london", "cairo"];

export function GlobeExperience() {
  const { t, x } = useI18n();
  const place = usePlace();
  const isMobile = useIsMobile();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<CityKey>("istanbul");
  const [err, setErr] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const s = q.trim().toLowerCase();
    const hit = SEARCHABLE.find((k) => k.startsWith(s.replace(/\s/g, "")) || place(k).name.toLowerCase().startsWith(s) || place(k).country.toLowerCase().startsWith(s));
    if (hit && s) { setSel(hit); setErr(false); } else setErr(true);
  };
  const km = Math.round(distKm("tashkent", sel));
  const hrs = (km / 800 + 0.5).toFixed(1);
  const d = x.dest[sel];
  return (
    <section id="discover" className="relative overflow-hidden bg-navy-deep py-24 text-on-dark sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold">{t.globe.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{t.globe.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-on-dark-muted">{t.globe.sub}</p>
        </Reveal>
        <form onSubmit={submit} role="search" className="glass-dark mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full p-1.5 pl-4">
          <Search size={16} className="shrink-0 text-on-dark-muted" />
          <label htmlFor="dest-search" className="sr-only">{t.globe.placeholder}</label>
          <input id="dest-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.globe.placeholder} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-on-dark-muted sm:text-sm" />
          <button className="min-h-10 shrink-0 rounded-full bg-on-dark px-4 text-sm font-medium text-navy-deep">{t.globe.go}</button>
        </form>
        <div className="no-scrollbar mx-auto mt-3 flex max-w-xl gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center">
          {(["istanbul", "paris", "tokyo", "dubai", "rome", "samarkand"] as CityKey[]).map((k) => (
            <button key={k} onClick={() => { setSel(k); setQ(place(k).name); setErr(false); }} className={`min-h-8 shrink-0 rounded-full px-3 text-xs transition ${sel === k ? "bg-gold text-navy-deep" : "bg-on-dark/5 text-on-dark-muted hover:bg-on-dark/10"}`}>{place(k).name}</button>
          ))}
        </div>
        <p className="mt-2 h-4 text-center text-xs text-on-dark-muted" aria-live="polite">{err ? t.globe.notFound : t.globe.hint}</p>
        <div className="mt-6 grid items-center gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="relative mx-auto aspect-square w-full max-w-[640px]">
            <Globe3D className="absolute inset-0" compact={isMobile} focus={sel} onSelect={(k) => k !== "tashkent" && setSel(k)} onHover={() => {}}
              routes={[["tashkent", sel]]} markers={SEARCHABLE} labels={labelsFor(["tashkent", sel], place)} initialLon={30} />
          </div>
          <Tilt>
            <article key={sel} className="animate-in fade-in slide-in-from-right-4 overflow-hidden rounded-2xl border border-on-dark/10 bg-navy shadow-card duration-700">
              <div className="relative h-52 sm:h-60">
                <img src={PHOTOS[sel]} alt={`${place(sel).name}, ${place(sel).country}`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-photo" />
                <div className="absolute bottom-4 left-5">
                  <p className="text-3xl font-semibold uppercase tracking-tight">{place(sel).name}</p>
                  <p className="text-sm text-on-dark-muted">{place(sel).country}</p>
                </div>
              </div>
              <div className="p-5">
                {d && <p className="text-sm text-on-dark-muted">{d.desc}</p>}
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-on-dark/10 pt-4 text-sm">
                  <div><p className="text-[11px] uppercase tracking-[0.12em] text-on-dark-muted">{t.globe.from}</p><p className="mt-1 font-medium">{km.toLocaleString()} {x.ui.km}</p></div>
                  <div><p className="text-[11px] uppercase tracking-[0.12em] text-on-dark-muted">{t.globe.flight}</p><p className="mt-1 font-medium">~{hrs} {x.ui.h}</p></div>
                </div>
                <a href="#planner" className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-gold">{x.ui.exploreDest} <ArrowRight size={14} /></a>
              </div>
            </article>
          </Tilt>
        </div>
      </div>
    </section>
  );
}

export function Destinations() {
  const { x, money } = useI18n();
  const place = usePlace();
  const [saved, setSaved] = useState<Set<CityKey>>(new Set());
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try { setSaved(new Set(JSON.parse(localStorage.getItem("tm-saved") ?? "[]"))); } catch { /* ignore */ }
  }, []);
  const toggle = (k: CityKey) => setSaved((s) => {
    const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k);
    localStorage.setItem("tm-saved", JSON.stringify([...n])); return n;
  });
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section id="destinations" className="overflow-hidden bg-background py-24 sm:py-32">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-azure">{x.ui.carouselEyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{x.ui.carouselTitle}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{x.ui.carouselSub}</p>
        </Reveal>
        <div className="hidden gap-2 md:flex">
          <button aria-label="Previous" onClick={() => scroll(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-border transition hover:bg-muted"><ArrowRight size={16} className="rotate-180" /></button>
          <button aria-label="Next" onClick={() => scroll(1)} className="grid h-11 w-11 place-items-center rounded-full border border-border transition hover:bg-muted"><ArrowRight size={16} /></button>
        </div>
      </div>
      <div ref={track} className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 sm:gap-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {FEATURED.map(({ key, budget }, i) => {
          const d = x.dest[key]!;
          const isSaved = saved.has(key);
          return (
            <article key={key} className="group w-[82vw] max-w-[380px] shrink-0 snap-start sm:w-[340px]">
              <div className="photo-zoom relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-card transition-transform duration-500 group-hover:-translate-y-1.5">
                <img src={PHOTOS[key]} alt={`${place(key).name}, ${place(key).country}`} loading={i < 3 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-photo" />
                <button onClick={() => toggle(key)} aria-pressed={isSaved} aria-label={isSaved ? x.ui.saved : x.ui.save}
                  className={`absolute right-3 top-3 flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium backdrop-blur-md transition ${isSaved ? "bg-gold text-navy-deep" : "bg-navy-deep/40 text-on-dark hover:bg-navy-deep/60"}`}>
                  {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}{isSaved ? x.ui.saved : x.ui.save}
                </button>
                <span className="absolute left-4 top-4 font-mono text-xs text-on-dark/80">{String(i + 1).padStart(2, "0")}</span>
                <div className="absolute inset-x-0 bottom-0 p-5 text-on-dark">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-on-dark-muted">{place(key).country}</p>
                  <h3 className="mt-1 text-3xl font-semibold uppercase tracking-tight">{place(key).name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-on-dark/85">{d.desc}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-3 px-1">
                <div className="min-w-0 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5 truncate"><Clock size={12} className="shrink-0" />{x.ui.best}: <span className="text-foreground">{d.best}</span></p>
                  <p className="flex items-center gap-1.5 truncate"><Sparkles size={12} className="shrink-0" />{d.style}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-muted-foreground">{x.ui.from}</p>
                  <p className="text-lg font-semibold leading-none">{money(budget)}</p>
                </div>
                <p className="col-span-2 -mt-1 text-[11px] text-muted-foreground">{x.ui.perPerson}</p>
                <a href="#discover" className="col-span-2 inline-flex min-h-10 items-center gap-2 text-sm font-medium transition-[gap] group-hover:gap-3">{x.ui.explore} <ArrowRight size={14} /></a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StageUI({ i }: { i: number }) {
  const { t, money } = useI18n();
  const box = "rounded-xl border border-border bg-card p-4 shadow-card";
  if (i === 0) return (
    <div className={`${box} flex items-center gap-5`}>
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full shadow-glow" style={{ backgroundImage: `url(${dayTex.url})`, backgroundSize: "200% 100%", animation: "earth-spin 30s linear infinite" }}>
        <div className="absolute inset-0 rounded-full [box-shadow:inset_-14px_-8px_24px_rgba(0,0,0,.55),inset_6px_4px_12px_rgba(255,255,255,.25)]" />
      </div>
      <div className="flex flex-wrap gap-1.5">{(["istanbul", "paris", "tokyo", "bali"] as CityKey[]).map((k, j) => <span key={k} className={`rounded-full px-2.5 py-1 text-xs ${j === 0 ? "bg-foreground text-background" : "bg-muted"}`}><MapPin size={10} className="mr-1 inline" />{t.cities[k as keyof typeof t.cities] ?? k}</span>)}</div>
    </div>
  );
  if (i === 1) return <div className={box}>{["09:00", "12:30", "14:00"].map((tm, j) => <p key={tm} className="flex gap-3 border-b border-border py-2 text-sm last:border-0"><span className="font-mono text-xs text-azure">{tm}</span>{t.planner.items[j]}</p>)}</div>;
  if (i === 2) return <div className={`${box} grid grid-cols-2 gap-3 text-sm`}><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">AI</p><p className="text-lg font-semibold">{money(462)}</p><p className="text-xs text-success">92%</p></div><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">{t.tours.agency}</p><p className="text-lg font-semibold">{money(420)}</p><p className="text-xs text-muted-foreground">88%</p></div></div>;
  if (i === 3) return <div className={box}><svg viewBox="0 0 300 90" className="w-full" aria-hidden><path d="M10 70 C 80 10, 150 90, 290 20" fill="none" stroke="var(--azure)" strokeWidth="2.5" className="animate-dash" />{[[10, 70], [150, 52], [290, 20]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="5" fill="var(--gold)" />)}</svg><p className="mt-2 text-xs text-muted-foreground">{t.planner.walk} · {money(96)}</p></div>;
  return <div className={`${box} space-y-2 text-sm`}><p className="rounded-md bg-warn/15 px-3 py-2">☂ {t.adapt.events[0].msg}</p><p className="rounded-md bg-muted px-3 py-2 line-through opacity-60">{t.adapt.base[0]}</p><p className="rounded-md border border-gold/60 px-3 py-2">{t.adapt.events[0].plan[0]}</p></div>;
}

export function Stages() {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [ref, p] = useScrollProgress<HTMLElement>();
  const head = (
    <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
      <p className="eyebrow text-azure">{t.stages.eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{t.stages.title}</h2>
    </div>
  );
  const card = (s: { name: string; desc: string }, i: number) => (
    <div key={i} className="flex w-full shrink-0 flex-col justify-center gap-5 md:w-[42vw] md:max-w-xl">
      <p className="text-gradient-accent text-6xl font-semibold tracking-tighter md:text-8xl">0{i + 1}</p>
      <div><p className="eyebrow text-muted-foreground">{s.name}</p><p className="mt-2 text-xl font-medium sm:text-2xl">{s.desc}</p></div>
      <StageUI i={i} />
    </div>
  );
  if (isMobile) {
    return (
      <section id="how" className="bg-surface py-24">
        {head}
        <div className="mt-12 space-y-16 px-5">{t.stages.items.map((s, i) => <Reveal key={i}>{card(s, i)}</Reveal>)}</div>
      </section>
    );
  }
  const active = Math.min(4, Math.floor(p * 5));
  return (
    <section id="how" ref={ref} className="relative h-[420vh] bg-surface">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16">
        {head}
        <div className="mx-auto mt-6 flex w-full max-w-7xl gap-2 px-8">
          {t.stages.items.map((s, i) => <div key={i} className="flex-1"><div className="h-0.5 bg-border"><div className="h-full bg-gradient-accent transition-all duration-500" style={{ width: i <= active ? "100%" : "0%" }} /></div><p className={`eyebrow mt-2 ${i === active ? "text-foreground" : "text-muted-foreground"}`}>{s.name}</p></div>)}
        </div>
        <div className="mt-8 flex gap-[8vw] pl-[8vw] will-change-transform" style={{ transform: `translate3d(-${p * 4 * 50}vw,0,0)` }}>
          {t.stages.items.map(card)}
        </div>
      </div>
    </section>
  );
}
