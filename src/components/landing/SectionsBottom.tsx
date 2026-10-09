import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, Check, X, Database, Brain, ShieldCheck, CloudRain, BatteryLow, Wallet, Clock, MapPin, Github, Instagram, Send, Linkedin, Hotel, Footprints, RefreshCw, Utensils, Car, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PHOTOS, EXTRA_PHOTOS } from "@/lib/destinations";
import { Logo, Reveal, Tilt, useInView } from "./hooks";
import { LangSwitch } from "./SectionsTop";

function Head({ eyebrow, title, sub, dark = false, center = false }: { eyebrow: string; title: string; sub?: string; dark?: boolean; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${dark ? "text-gold" : "text-azure"}`}>{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      {sub && <p className={`mt-4 text-lg ${dark ? "text-on-dark-muted" : "text-muted-foreground"}`}>{sub}</p>}
    </Reveal>
  );
}

const TIMES = ["09:00", "12:30", "14:30", "19:00"];
const DUR = ["2h 30m", "1h", "3h", "2h"];
const COST = [25, 18, 0, 35];
const ITEM_PHOTOS = [PHOTOS.istanbul!, EXTRA_PHOTOS.istanbul2, EXTRA_PHOTOS.istanbul3, PHOTOS.istanbul!];

export function Planner() {
  const { t, x, money } = useI18n();
  const P = x.planner;
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const [step, setStep] = useState(-1); // -1 idle, 0..5 progress, 6 done
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const run = () => {
    timers.current.forEach(clearTimeout);
    setStep(0);
    timers.current = [1, 2, 3, 4, 5, 6].map((s, i) => setTimeout(() => setStep(s), 650 * (i + 1)));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (seen && step === -1) run(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [seen]);
  const busy = step >= 0 && step < 6;
  const done = step === 6;
  const w = t.workspace;
  const chips: [string, string][] = [[w.fields.destination, t.cities.istanbul], [w.fields.dates, "12–17 May"], [w.fields.travelers, w.values.travelers], [w.fields.budget, money(500)], [w.fields.style, w.values.style], [w.fields.interests, w.values.interests]];
  const total = COST.reduce((a, b) => a + b, 0);
  return (
    <section id="planner" className="relative overflow-hidden bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-azure">{t.planner.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold uppercase tracking-tight sm:text-6xl">{t.planner.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.planner.sub}</p>
        </Reveal>
        <div ref={ref} className="mt-12 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] [perspective:1600px]">
          {/* Input + progress */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">{P.you}</span>
                <p className="rounded-xl rounded-tl-sm bg-muted px-4 py-3 text-sm">{P.prompt}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {chips.map(([l, v]) => <span key={l} className="rounded-full border border-border px-3 py-1 text-xs"><span className="text-muted-foreground">{l}: </span><span className="font-medium">{v}</span></span>)}
              </div>
              <button onClick={run} disabled={busy} className="btn-primary mt-5 w-full justify-center disabled:opacity-60">
                {busy ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {done ? t.planner.regenerate : t.planner.generate} {!busy && <ArrowRight size={16} />}
              </button>
            </div>
            <ol className="rounded-2xl border border-border bg-card p-5 shadow-card" aria-live="polite">
              {P.steps.map((s, i) => {
                const state = step > i || done ? "done" : step === i ? "active" : "idle";
                return (
                  <li key={i} className="flex items-center gap-3 py-2">
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px] transition-colors duration-500 ${state === "done" ? "bg-foreground text-background" : state === "active" ? "border border-azure text-azure" : "border border-border text-muted-foreground"}`}>
                      {state === "done" ? <Check size={13} /> : String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm transition-colors ${state === "idle" ? "text-muted-foreground" : "font-medium"}`}>{s}</p>
                      <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-border">
                        {state !== "idle" && <div className={`h-full bg-gradient-accent ${state === "active" ? "animate-progress" : ""}`} style={{ width: "100%" }} />}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          {/* Itinerary */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform duration-1000" style={{ transform: done ? "rotateX(0deg)" : "rotateX(6deg)" }}>
            <div className="relative h-36 sm:h-44">
              <img src={PHOTOS.istanbul} alt={t.cities.istanbul} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-photo" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3 text-on-dark">
                <div className="min-w-0"><p className="eyebrow text-gold">{done ? P.ready : P.steps[Math.max(0, step)]}</p><p className="mt-1 truncate text-2xl font-semibold">{t.cities.istanbul} · {P.day} 1</p><p className="text-xs text-on-dark/80">{P.summary}</p></div>
                <div className="shrink-0 text-right"><p className="text-[11px] text-on-dark/70">{P.total}</p><p className="text-xl font-semibold">{money(total)}</p></div>
              </div>
            </div>
            <div className="flex items-center gap-2 border-b border-border px-5 py-3 text-xs">
              <Hotel size={14} className="text-azure" /><span className="text-muted-foreground">{P.hotel}:</span><span className="font-medium">{P.hotelName}</span>
              <span className="ml-auto hidden items-center gap-1 text-muted-foreground sm:flex"><Star size={12} className="fill-gold text-gold" />4.7</span>
            </div>
            <ul className="divide-y divide-border">
              {P.items.map((it, i) => {
                const vis = done || step > 2 + i * 0.75;
                return (
                  <li key={i} className={`grid grid-cols-[3.2rem_1fr] gap-3 px-5 py-4 transition-all duration-700 sm:grid-cols-[3.5rem_4rem_1fr_auto] ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                    <span className="font-mono text-sm text-azure">{TIMES[i]}</span>
                    <img src={ITEM_PHOTOS[i]} alt="" loading="lazy" className="hidden h-12 w-16 rounded-md object-cover sm:block" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{it.title}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><MapPin size={11} />{it.place}</span>
                        <span className="inline-flex items-center gap-1"><Footprints size={11} />{it.transport}</span>
                        <span className="inline-flex items-center gap-1"><Clock size={11} />{DUR[i]}</span>
                      </p>
                      <p className="mt-1 text-xs"><span className="text-muted-foreground">{P.alt}: </span><span className="text-azure">{it.alt}</span></p>
                    </div>
                    <span className="col-start-2 text-sm font-semibold sm:col-start-auto sm:text-right">{COST[i] === 0 ? "—" : money(COST[i])}</span>
                  </li>
                );
              })}
            </ul>
            {!done && step >= 0 && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 animate-shimmer" />}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Trust() {
  const { t } = useI18n();
  const icons = [Database, Brain, ShieldCheck];
  return (
    <section className="bg-surface py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Head eyebrow={t.trust.eyebrow} title={t.trust.title} sub={t.trust.sub} />
        <div className="relative mt-14 grid gap-4 md:grid-cols-3">
          {t.trust.cols.map((c, i) => {
            const I = icons[i];
            return (
              <Reveal key={i} delay={i * 120}>
                <div className={`h-full rounded-3xl border p-6 ${i === 1 ? "border-transparent bg-navy text-on-dark shadow-glow" : "border-border bg-card"}`}>
                  <div className="flex items-center justify-between"><span className="font-mono text-xs opacity-60">0{i + 1}</span><I size={20} className={i === 1 ? "text-gold" : "text-azure"} /></div>
                  <p className="eyebrow mt-8">{c.name}</p>
                  <ul className="mt-4 space-y-2.5">
                    {c.items.map((x) => <li key={x} className="flex items-center gap-2 text-sm">{i === 2 ? <X size={14} className="text-destructive" /> : <Check size={14} className={i === 1 ? "text-gold" : "text-success"} />}{x}</li>)}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-card px-5 py-4 sm:flex-row sm:items-center">
          <span className="text-sm text-muted-foreground">{t.trust.whenMissing}</span>
          <span className="rounded-full bg-muted px-3 py-1 font-mono text-xs">{t.trust.unavailable}</span>
        </Reveal>
      </div>
    </section>
  );
}

const EV_ICONS = [CloudRain, BatteryLow, Wallet, Clock];
const ADAPT_TIMES = ["09:00", "12:30", "15:00", "19:00"];

export function Adapt() {
  const { t } = useI18n();
  const [ev, setEv] = useState<number | null>(null);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setEv((e) => (e === null ? 0 : e === 3 ? null : e + 1)), 3000);
    return () => clearInterval(id);
  }, [auto]);
  const plan = ev === null ? t.adapt.base : t.adapt.events[ev].plan;
  return (
    <section className="bg-gradient-dark py-28 text-on-dark">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <Reveal>
            <p className="eyebrow text-gold">{t.adapt.eyebrow}</p>
            <h2 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">{t.adapt.title1}<br /><span className="text-gradient-accent">{t.adapt.title2}</span></h2>
            <p className="mt-5 max-w-md text-on-dark-muted">{t.adapt.sub}</p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-2">
            {t.adapt.events.map((e, i) => {
              const I = EV_ICONS[i];
              return (
                <button key={i} onClick={() => { setAuto(false); setEv(ev === i ? null : i); }}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${ev === i ? "border-warn/60 bg-warn/10" : "border-on-dark/10 bg-on-dark/5 hover:bg-on-dark/10"}`}>
                  <I size={18} className={ev === i ? "text-warn" : "text-on-dark-muted"} />
                  <span className="eyebrow">{e.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="glass-dark rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <p className="font-medium">{t.cities.istanbul} · {t.workspace.day} 2</p>
            <span className={`rounded-full px-3 py-1 text-xs ${ev === null ? "bg-on-dark/10 text-on-dark-muted" : "bg-gold text-navy-deep"}`}>{ev === null ? t.adapt.original : t.adapt.updated}</span>
          </div>
          <div className="mt-4 min-h-14">
            {ev !== null && <p key={ev} className="animate-in fade-in slide-in-from-top-2 flex items-center gap-2 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm"><Sparkles size={15} className="text-warn" />{t.adapt.events[ev].msg}</p>}
          </div>
          <ul className="mt-3 space-y-2">
            {plan.map((item, i) => {
              const changed = ev !== null && item !== t.adapt.base[i];
              return (
                <li key={`${ev}-${i}`} className={`flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-500 ${changed ? "animate-in fade-in slide-in-from-right-4 border border-gold/50 bg-gold/10" : "bg-on-dark/5"}`}>
                  <span className="font-mono text-xs text-gold">{ADAPT_TIMES[i]}</span>
                  <span className="flex-1 text-sm">{item}</span>
                  {changed && <span className="text-[11px] text-gold">{t.adapt.changed}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

const TOUR = [{ m: 94, p: 380, img: PHOTOS.istanbul! }, { m: 88, p: 420, img: EXTRA_PHOTOS.istanbul2 }, { m: 81, p: 510, img: EXTRA_PHOTOS.istanbul3 }];

export function Tours() {
  const { t, money } = useI18n();
  return (
    <section id="tours" className="overflow-hidden bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Head eyebrow={t.tours.eyebrow} title={t.tours.title} sub={t.tours.sub} />
          <a href="#compare" className="btn-ghost">{t.tours.cta} <ArrowRight size={16} /></a>
        </div>
      </div>
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-auto md:grid md:max-w-7xl md:grid-cols-3 md:gap-6 md:overflow-visible lg:px-8">
        {t.tours.cards.map((c, i) => (
          <Reveal key={i} delay={i * 120} className="w-[82vw] max-w-[380px] shrink-0 snap-start md:w-auto md:max-w-none">
            <Tilt>
              <article className={`group h-full overflow-hidden rounded-2xl border bg-card shadow-card transition-shadow ${i === 0 ? "border-gold/60" : "border-border"}`}>
                <div className="photo-zoom relative aspect-[16/10] overflow-hidden">
                  <img src={TOUR[i].img} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-photo" />
                  <span className={`absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-xs font-medium ${i === 0 ? "bg-gold text-navy-deep" : "bg-navy-deep/60 text-on-dark backdrop-blur"}`}>{TOUR[i].m}% {t.tours.match}</span>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-on-dark">
                    <h3 className="text-lg font-semibold leading-tight">{c.name}</h3>
                    <p className="text-2xl font-semibold">{money(TOUR[i].p)}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted-foreground">{c.duration} · {c.agency}</p>
                  <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    {([[Hotel, t.tours.hotel, c.hotel], [Car, t.tours.transfer, c.transfer], [Utensils, t.tours.meals, c.meals]] as const).map(([I, l, v]) => (
                      <div key={l} className="rounded-lg bg-muted px-2.5 py-2"><dt className="flex items-center gap-1 text-muted-foreground"><I size={11} />{l}</dt><dd className="mt-0.5 truncate font-medium">{v}</dd></div>
                    ))}
                  </dl>
                  <p className="mt-4 border-t border-border pt-3 text-sm"><span className="eyebrow mr-2 text-azure">{t.tours.why}</span><span className="text-muted-foreground">{c.why}</span></p>
                </div>
              </article>
            </Tilt>
          </Reveal>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-7xl px-5 text-xs text-muted-foreground lg:px-8">{t.tours.disclaimer}</p>
    </section>
  );
}

const BETTER_LEFT = [false, true, true, false, true, false, true, true];
// Relative visual scores (0–100) used for the comparison bars.
const BAR_L = [72, 100, 85, 55, 80, 50, 90, 92];
const BAR_R = [80, 80, 70, 100, 70, 95, 55, 88];

export function Compare() {
  const { t, money } = useI18n();
  const c = t.compare;
  const [ref, seen] = useInView<HTMLDivElement>(0.25);
  const L = [money(462), ...c.leftVals.slice(1)];
  const R = [money(420), ...c.rightVals.slice(1)];
  return (
    <section id="compare" className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Head eyebrow={c.eyebrow} title={c.title} center />
        <div ref={ref} className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="grid grid-cols-2 border-b border-border text-sm font-medium sm:grid-cols-[1fr_1.3fr_1.3fr]">
            <div className="hidden p-4 sm:block" />
            <div className="flex items-center gap-2 bg-navy p-4 text-on-dark"><Sparkles size={14} className="shrink-0 text-gold" /><span className="truncate">{c.left}</span></div>
            <div className="p-4"><span className="truncate">{c.right}</span></div>
          </div>
          {c.rows.map((r, i) => (
            <div key={r} className="grid grid-cols-2 border-b border-border text-sm last:border-0 sm:grid-cols-[1fr_1.3fr_1.3fr]">
              <div className="col-span-2 px-4 pt-3 text-xs uppercase tracking-[0.12em] text-muted-foreground sm:col-span-1 sm:p-4 sm:text-sm sm:normal-case sm:tracking-normal">{r}</div>
              {[[L[i], BAR_L[i], BETTER_LEFT[i], "bg-gradient-accent"], [R[i], BAR_R[i], !BETTER_LEFT[i], "bg-gold"]].map(([v, bar, better, cls], j) => (
                <div key={j} className={`p-4 ${better ? "font-medium" : ""}`}>
                  <div className="flex items-center justify-between gap-2"><span className="min-w-0 truncate">{v as string}</span>{better && <Check size={14} className="shrink-0 text-success" aria-label={c.better} />}</div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${cls as string} transition-[width] duration-1000 ease-out`} style={{ width: seen ? `${bar}%` : "0%", transitionDelay: `${i * 70}ms` }} /></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Ecosystem() {
  const { t } = useI18n();
  const pos = ["md:left-0 md:top-0", "md:right-0 md:top-0", "md:left-1/2 md:bottom-0 md:-translate-x-1/2"];
  return (
    <section id="agencies" className="bg-navy-deep py-28 text-on-dark">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Head eyebrow={t.eco.eyebrow} title={t.eco.title} dark center />
        <div className="relative mt-14 flex flex-col gap-4 md:block md:h-[560px]">
          <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[[18, 18], [82, 18], [50, 88]].map(([x, y]) => <line key={x} x1="50" y1="50" x2={x} y2={y} stroke="var(--cyan)" strokeOpacity=".4" strokeWidth=".3" className="animate-dash" vectorEffect="non-scaling-stroke" />)}
          </svg>
          <div className="order-first mx-auto flex h-36 w-36 flex-col items-center justify-center rounded-full bg-navy shadow-glow md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <Logo dark />
            <p className="mt-1 text-[11px] text-on-dark-muted">{t.eco.core}</p>
          </div>
          {t.eco.groups.map((g, i) => (
            <Reveal key={i} delay={i * 150} className={`md:absolute md:w-72 ${pos[i]}`}>
              <div className="glass-dark rounded-3xl p-5">
                <p className="eyebrow text-gold">{g.name}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{g.items.map((x) => <span key={x} className="rounded-full bg-on-dark/5 px-3 py-1 text-xs text-on-dark-muted">{x}</span>)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Roadmap() {
  const { t } = useI18n();
  return (
    <section className="bg-background py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Head eyebrow={t.roadmap.eyebrow} title={t.roadmap.title} />
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {t.roadmap.phases.map((ph, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${i === 0 ? "bg-gradient-accent shadow-glow" : "border border-border"}`} />
                <span className="h-px flex-1 bg-border" />
              </div>
              <p className={`eyebrow mt-4 ${i === 0 ? "text-azure" : "text-muted-foreground"}`}>{ph.name}</p>
              <ul className="mt-3 space-y-1.5">{ph.items.map((x) => <li key={x} className={i === 0 ? "font-medium" : "text-muted-foreground"}>{x}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const { t, x } = useI18n();
  const bg = useRef<HTMLImageElement>(null);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = bg.current; if (!el) return;
        const r = el.parentElement!.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        el.style.transform = `translate3d(0, ${(r.top / window.innerHeight) * 60}px, 0) scale(1.12)`;
      });
    };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <section className="relative overflow-hidden bg-navy-deep py-32 text-on-dark sm:py-44">
      <img ref={bg} src={PHOTOS.alps} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 will-change-transform" />
      <div className="absolute inset-0 bg-navy-deep/55" />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_30%,var(--navy-deep)_100%)]" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden>
        <path d="M-50 480 C 300 300, 700 560, 1250 200" fill="none" stroke="var(--gold)" strokeOpacity=".5" className="animate-dash" vectorEffect="non-scaling-stroke" />
        <path d="M-50 160 C 400 320, 800 60, 1250 380" fill="none" stroke="var(--cyan)" strokeOpacity=".35" className="animate-dash" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <h2 className="text-4xl font-semibold uppercase leading-[1] tracking-tight sm:text-6xl lg:text-7xl">{t.final.title}</h2>
          <p className="eyebrow mt-6 text-gold">{t.final.sub}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#planner" className="btn-primary !bg-on-dark !text-navy-deep">{t.final.cta1} <ArrowRight size={16} /></a>
            <a href="#destinations" className="btn-ghost-dark">{x.ui.carouselEyebrow}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { t, x } = useI18n();
  const socials = [[Instagram, "Instagram"], [Send, "Telegram"], [Linkedin, "LinkedIn"], [Github, "GitHub"]] as const;
  return (
    <footer className="border-t border-on-dark/10 bg-navy-deep text-on-dark">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Logo dark />
          <p className="mt-3 text-sm text-on-dark-muted">{t.footer.tagline}</p>
          <div className="mt-5 flex gap-2 text-on-dark-muted">
            {socials.map(([I, name]) => <a key={name} href="#top" aria-label={name} className="grid h-10 w-10 place-items-center rounded-full border border-on-dark/10 transition hover:border-on-dark/30 hover:text-on-dark"><I size={15} /></a>)}
          </div>
        </div>
        <div>
          <p className="eyebrow text-on-dark-muted">{t.footer.nav}</p>
          <ul className="mt-4 space-y-2 text-sm">{[["#discover", t.nav.discover], ["#destinations", x.ui.carouselEyebrow], ["#planner", t.nav.planner], ["#tours", t.nav.tours], ["#agencies", t.nav.agencies]].map(([h, l]) => <li key={h}><a href={h} className="inline-block py-1 transition hover:text-gold">{l}</a></li>)}</ul>
        </div>
        <div>
          <p className="eyebrow text-on-dark-muted">{t.footer.company}</p>
          <ul className="mt-4 space-y-2 text-sm">{t.footer.companyItems.map((it) => <li key={it}><a href="#top" className="inline-block py-1 transition hover:text-gold">{it}</a></li>)}</ul>
        </div>
        <div>
          <p className="eyebrow text-on-dark-muted">{t.footer.language}</p>
          <div className="mt-4"><LangSwitch dark /></div>
        </div>
      </div>
      <div className="border-t border-on-dark/10 py-5 text-center text-xs text-on-dark-muted"><MapPin size={11} className="mr-1 inline" />© 2026 TripMind. {t.footer.rights}</div>
    </footer>
  );
}
