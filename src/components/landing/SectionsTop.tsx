import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Search, MapPin, Plane, Sparkles, Calendar, Wallet, Menu, X } from "lucide-react";
import { useI18n, type Lang, type Currency } from "@/lib/i18n";
import { Globe, CITIES, type CityKey } from "./Globe";
import { Logo, Reveal, useScrollProgress, useInView } from "./hooks";
import { useIsMobile } from "@/hooks/use-mobile";

const LANGS: Lang[] = ["uz", "ru", "en"];
const CURS: Currency[] = ["USD", "EUR", "UZS"];

export function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={`flex items-center rounded-full border p-0.5 text-xs font-medium ${dark ? "border-on-dark/15" : "border-border"}`}>
      {LANGS.map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase transition ${lang === l ? (dark ? "bg-on-dark text-navy" : "bg-navy text-on-dark") : dark ? "text-on-dark-muted hover:text-on-dark" : "text-muted-foreground hover:text-foreground"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const { t, currency, setCurrency } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [["#discover", t.nav.discover], ["#how", t.nav.how], ["#planner", t.nav.planner], ["#tours", t.nav.tours], ["#agencies", t.nav.agencies]];
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-border/70 bg-background/80 backdrop-blur-xl" : ""}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="#top"><Logo /></a>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
          {links.map(([h, l]) => <a key={h} href={h} className="transition hover:text-foreground">{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><LangSwitch /></div>
          <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}
            className="hidden rounded-full border border-border bg-transparent px-2.5 py-1.5 text-xs font-medium sm:block">
            {CURS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <a href="#planner" className="btn-primary hidden !py-2 !text-sm md:inline-flex">{t.nav.start}</a>
          <button className="rounded-full p-2 lg:hidden" aria-label={t.nav.menu} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-5 pb-5 lg:hidden">
          {links.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block py-3 text-sm">{l}</a>)}
          <div className="mt-2 flex items-center gap-3">
            <LangSwitch />
            <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="rounded-full border border-border bg-transparent px-2.5 py-1.5 text-xs">
              {CURS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      )}
    </header>
  );
}

export function Hero() {
  const { t } = useI18n();
  const [focus, setFocus] = useState<CityKey | null>(null);
  useEffect(() => { if (!focus) return; const id = setTimeout(() => setFocus(null), 4500); return () => clearTimeout(id); }, [focus]);
  return (
    <section id="top" className="relative overflow-hidden bg-surface pt-16">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_75%_45%,var(--globe-glow),transparent_70%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-6 px-5 py-10 lg:grid-cols-[1fr_1.15fr] lg:px-8">
        <div className="relative z-10 max-w-xl">
          <p className="eyebrow text-azure">{t.hero.eyebrow}</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {t.hero.title1}<br /><span className="text-gradient-accent">{t.hero.title2}</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">{t.hero.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#planner" className="btn-primary">{t.hero.cta1} <ArrowRight size={16} /></a>
            <a href="#workspace" className="btn-ghost">{t.hero.cta2}</a>
          </div>
          <p className="eyebrow mt-10 text-muted-foreground">{t.hero.loop}</p>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[520px] lg:max-w-none">
          <Globe className="absolute inset-0" initial={[-40, -30]}
            routes={[["tashkent", "istanbul"], ["istanbul", "paris"], ["tashkent", "dubai"]]}
            markers={["tokyo", "rome"]} focus={focus} onSelect={setFocus}
            labels={{ tashkent: t.cities.tashkent, istanbul: t.cities.istanbul, paris: t.cities.paris, ...(focus ? { [focus]: t.cities[focus] } : {}) }} />
          <div className="glass-dark animate-float absolute bottom-[8%] left-0 rounded-2xl px-4 py-3 text-on-dark shadow-soft sm:left-[4%]">
            <p className="eyebrow text-cyan">{t.hero.live}</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-medium">{t.cities.tashkent} <Plane size={13} className="text-cyan" /> {t.cities.istanbul} <Plane size={13} className="text-cyan" /> {t.cities.paris}</p>
          </div>
        </div>
      </div>
      <a href="#problem" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted-foreground md:flex">
        <span className="flex h-8 w-5 justify-center rounded-full border border-border pt-1.5"><span className="animate-scroll-dot h-1.5 w-1 rounded-full bg-azure" /></span>
        {t.hero.scroll}
      </a>
    </section>
  );
}

const CHIP_POS = [[-38, -30], [34, -34], [-44, 6], [42, 2], [-30, 34], [28, 36], [-6, -42], [4, 44]];

export function Problem() {
  const { t } = useI18n();
  const [ref, p] = useScrollProgress<HTMLElement>();
  const k = Math.min(1, Math.max(0, (p - 0.1) / 0.5));
  const done = p > 0.6;
  return (
    <section id="problem" ref={ref} className="relative h-[220vh] bg-background">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5">
        <p className="eyebrow text-azure">{t.problem.eyebrow}</p>
        <h2 className="mt-4 text-center text-4xl font-semibold tracking-tight sm:text-6xl">
          {done ? t.problem.together : t.problem.title}
        </h2>
        <div className="relative mt-10 h-[46vh] w-full max-w-4xl">
          {t.problem.chips.map((c, i) => {
            const [x, y] = CHIP_POS[i];
            return (
              <span key={i} className="absolute left-1/2 top-1/2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft transition-opacity duration-500"
                style={{ transform: `translate(-50%,-50%) translate(${x * (1 - k)}vw, ${y * (1 - k) * 0.8}vh) rotate(${(i % 2 ? 6 : -6) * (1 - k)}deg) scale(${1 - k * 0.3})`, opacity: done ? 0 : 1 }}>
                {c}
              </span>
            );
          })}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-3xl bg-navy px-8 py-7 text-on-dark shadow-glow transition-all duration-700"
            style={{ opacity: done ? 1 : 0, transform: `translate(-50%,-50%) scale(${done ? 1 : 0.7})` }}>
            <Logo dark />
            <div className="grid grid-cols-4 gap-2">
              {t.problem.chips.map((c) => <span key={c} className="rounded-lg bg-on-dark/10 px-2 py-1 text-center text-[11px] text-on-dark-muted">{c}</span>)}
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
  const show = (i: number) => ({ style: { transitionDelay: `${i * 120}ms` }, className: `transition-all duration-700 ${seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}` });
  return (
    <section id="workspace" className="bg-gradient-dark py-28 text-on-dark">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-cyan">{w.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{w.title1}<br /><span className="text-on-dark-muted">{w.title2}</span></h2>
          <p className="mt-5 text-lg text-on-dark-muted">{w.sub}</p>
        </Reveal>
        <div ref={ref} className="glass-dark mt-14 rounded-3xl p-3 shadow-glow sm:p-4">
          <div className="flex items-center gap-1.5 px-2 pb-3"><span className="h-2.5 w-2.5 rounded-full bg-on-dark/20" /><span className="h-2.5 w-2.5 rounded-full bg-on-dark/20" /><span className="h-2.5 w-2.5 rounded-full bg-on-dark/20" /></div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
            {fields.map(([l, v], i) => (
              <div key={l} {...show(i)}><div className="rounded-xl bg-navy-deep/70 px-3 py-2.5"><p className="text-[11px] text-on-dark-muted">{l}</p><p className="mt-0.5 truncate text-sm font-medium">{v}</p></div></div>
            ))}
          </div>
          <div className="mt-2 grid gap-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div {...show(6)}>
              <div className="relative h-72 overflow-hidden rounded-2xl bg-navy-deep/70 p-4">
                <p className="flex items-center gap-2 text-xs text-on-dark-muted"><MapPin size={13} />{w.panels.map}</p>
                <svg viewBox="0 0 400 220" className="absolute inset-0 h-full w-full opacity-90">
                  {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={i * 44} y1="0" x2={i * 44 - 60} y2="220" stroke="var(--globe-grid)" />)}
                  <path d="M60 170 C 120 120, 160 150, 210 100 S 300 60, 340 70" fill="none" stroke="var(--cyan)" strokeWidth="2.5" className="animate-dash" />
                  {[[60, 170], [210, 100], [340, 70], [150, 140]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="10" fill="var(--globe-glow)" /><circle cx={x} cy={y} r="4" fill="var(--cyan)" /></g>)}
                </svg>
              </div>
            </div>
            <div {...show(7)}>
              <div className="h-72 rounded-2xl bg-navy-deep/70 p-4">
                <p className="flex items-center gap-2 text-xs text-on-dark-muted"><Calendar size={13} />{w.panels.itinerary}</p>
                <div className="mt-3 flex gap-1">{[1, 2, 3, 4, 5].map((d) => <span key={d} className={`flex-1 rounded-md py-1 text-center text-[11px] ${d === 1 ? "bg-gradient-accent text-navy-deep" : "bg-on-dark/5 text-on-dark-muted"}`}>{w.day} {d}</span>)}</div>
                <ul className="mt-3 space-y-2">
                  {["09:00", "12:30", "14:00", "18:30"].map((tm, i) => (
                    <li key={tm} className="flex gap-3 rounded-lg bg-on-dark/5 px-3 py-2 text-sm"><span className="font-mono text-xs text-cyan">{tm}</span><span className="truncate">{t.planner.items[i]}</span></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid gap-2">
              <div {...show(8)}>
                <div className="rounded-2xl bg-navy-deep/70 p-4">
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
                <div className="rounded-2xl border border-cyan/30 bg-navy-deep/70 p-4">
                  <p className="flex items-center gap-2 text-xs text-cyan"><Sparkles size={13} />{w.panels.ai}</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-on-dark-muted">{w.tips.slice(0, 2).map((x) => <li key={x}>• {x}</li>)}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const DEMO: CityKey[] = ["istanbul", "paris", "tokyo", "dubai", "rome", "newyork", "bali", "london", "cairo"];
function distKm(a: CityKey, b: CityKey) {
  const [lo1, la1] = CITIES[a], [lo2, la2] = CITIES[b], r = Math.PI / 180;
  const h = Math.sin(((la2 - la1) * r) / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin(((lo2 - lo1) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function GlobeExperience() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<CityKey>("istanbul");
  const [err, setErr] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const s = q.trim().toLowerCase();
    const hit = DEMO.find((k) => k.startsWith(s.replace(/\s/g, "")) || t.cities[k].toLowerCase().startsWith(s));
    if (hit && s) { setSel(hit); setErr(false); } else setErr(true);
  };
  const km = Math.round(distKm("tashkent", sel));
  const hrs = (km / 800 + 0.5).toFixed(1);
  return (
    <section id="discover" className="relative overflow-hidden bg-navy-deep py-28 text-on-dark">
      <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
        <Reveal>
          <p className="eyebrow text-cyan">{t.globe.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{t.globe.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-on-dark-muted">{t.globe.sub}</p>
        </Reveal>
        <form onSubmit={submit} className="glass-dark mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full p-1.5 pl-4">
          <Search size={16} className="text-on-dark-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.globe.placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-on-dark-muted" />
          <button className="btn-primary !px-4 !py-2 !text-sm">{t.globe.go}</button>
        </form>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {DEMO.slice(0, 5).map((k) => (
            <button key={k} onClick={() => { setSel(k); setQ(t.cities[k]); setErr(false); }} className={`rounded-full px-3 py-1 text-xs transition ${sel === k ? "bg-cyan text-navy-deep" : "bg-on-dark/5 text-on-dark-muted hover:bg-on-dark/10"}`}>{t.cities[k]}</button>
          ))}
        </div>
        <p className="mt-2 h-4 text-xs text-on-dark-muted">{err ? t.globe.notFound : t.globe.hint}</p>
        <div className="relative mx-auto mt-4 aspect-square w-full max-w-[680px]">
          <Globe className="absolute inset-0" speed={0.05} focus={sel} onSelect={(k) => k !== "tashkent" && setSel(k)}
            routes={[["tashkent", sel]]} markers={DEMO}
            labels={{ tashkent: t.cities.tashkent, [sel]: t.cities[sel] }} />
          <div key={sel} className="glass-dark animate-in fade-in slide-in-from-bottom-4 absolute bottom-4 right-0 w-60 rounded-2xl p-4 text-left shadow-glow duration-700 sm:right-4">
            <p className="text-xl font-semibold">{t.cities[sel]}</p>
            <p className="text-sm text-on-dark-muted">{t.countries[sel]}</p>
            <div className="mt-3 border-t border-on-dark/10 pt-3 text-xs text-on-dark-muted">
              <p>{t.globe.from}</p>
              <p className="mt-1 text-sm text-on-dark">{km.toLocaleString()} km · {t.globe.flight} ~{hrs} h</p>
            </div>
            <a href="#planner" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan">{t.globe.explore} <ArrowRight size={14} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageUI({ i }: { i: number }) {
  const { t, money } = useI18n();
  const box = "rounded-2xl border border-border bg-card p-4 shadow-soft";
  if (i === 0) return <div className={`${box} flex flex-wrap gap-2`}>{(["istanbul", "paris", "tokyo", "bali", "rome"] as CityKey[]).map((k, j) => <span key={k} className={`rounded-full px-3 py-1.5 text-sm ${j === 0 ? "bg-navy text-on-dark" : "bg-muted"}`}><MapPin size={12} className="mr-1 inline" />{t.cities[k]}</span>)}</div>;
  if (i === 1) return <div className={box}>{["09:00", "12:30", "14:00"].map((tm, j) => <p key={tm} className="flex gap-3 border-b border-border py-2 text-sm last:border-0"><span className="font-mono text-xs text-azure">{tm}</span>{t.planner.items[j]}</p>)}</div>;
  if (i === 2) return <div className={`${box} grid grid-cols-2 gap-3 text-sm`}><div className="rounded-xl bg-muted p-3"><p className="text-xs text-muted-foreground">AI</p><p className="text-lg font-semibold">{money(462)}</p><p className="text-xs text-success">92%</p></div><div className="rounded-xl bg-muted p-3"><p className="text-xs text-muted-foreground">{t.tours.agency}</p><p className="text-lg font-semibold">{money(420)}</p><p className="text-xs text-muted-foreground">88%</p></div></div>;
  if (i === 3) return <div className={box}><svg viewBox="0 0 300 90" className="w-full"><path d="M10 70 C 80 10, 150 90, 290 20" fill="none" stroke="var(--azure)" strokeWidth="2.5" className="animate-dash" />{[[10, 70], [150, 52], [290, 20]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" fill="var(--cyan)" />)}</svg><p className="mt-2 text-xs text-muted-foreground">{t.planner.walk} · {money(96)}</p></div>;
  return <div className={`${box} space-y-2 text-sm`}><p className="rounded-lg bg-warn/15 px-3 py-2">☂ {t.adapt.events[0].msg}</p><p className="rounded-lg bg-muted px-3 py-2 line-through opacity-60">{t.adapt.base[0]}</p><p className="rounded-lg border border-cyan/50 px-3 py-2">{t.adapt.events[0].plan[0]}</p></div>;
}

export function Stages() {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [ref, p] = useScrollProgress<HTMLElement>();
  const head = (
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <p className="eyebrow text-azure">{t.stages.eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{t.stages.title}</h2>
    </div>
  );
  const card = (s: { name: string; desc: string }, i: number) => (
    <div key={i} className="flex w-full shrink-0 flex-col justify-center gap-6 md:w-[42vw] md:max-w-xl">
      <p className="text-gradient-accent text-7xl font-semibold tracking-tighter md:text-8xl">0{i + 1}</p>
      <div><p className="eyebrow text-muted-foreground">{s.name}</p><p className="mt-2 text-2xl font-medium">{s.desc}</p></div>
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
        <div className="mt-8 flex gap-[8vw] pl-[8vw] transition-transform duration-300 ease-out" style={{ transform: `translateX(-${p * 4 * 50}vw)` }}>
          {t.stages.items.map(card)}
        </div>
      </div>
    </section>
  );
}
