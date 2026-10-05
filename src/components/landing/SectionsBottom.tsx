import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Check, X, Database, Brain, ShieldCheck, CloudRain, BatteryLow, Wallet, Clock, MapPin, Github, Instagram, Send, Linkedin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Globe } from "./Globe";
import { Logo, Reveal, useInView } from "./hooks";
import { LangSwitch } from "./SectionsTop";

function Head({ eyebrow, title, sub, dark = false, center = false }: { eyebrow: string; title: string; sub?: string; dark?: boolean; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${dark ? "text-cyan" : "text-azure"}`}>{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      {sub && <p className={`mt-4 text-lg ${dark ? "text-on-dark-muted" : "text-muted-foreground"}`}>{sub}</p>}
    </Reveal>
  );
}

const TIMES = ["09:00", "12:30", "14:00", "18:30"];

export function Planner() {
  const { t, money } = useI18n();
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const [step, setStep] = useState(-1); // -1 idle, 0 generating, 1..4 items
  const run = () => {
    setStep(0);
    [1, 2, 3, 4, 5].forEach((s, i) => setTimeout(() => setStep(s), 1200 + i * 450));
  };
  useEffect(() => { if (seen && step === -1) run(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [seen]);
  const w = t.workspace;
  const inputs: [string, string][] = [[w.fields.destination, t.cities.istanbul], [w.fields.dates, w.values.dates.split("·")[1]?.trim() ?? ""], [w.fields.travelers, w.values.travelers], [w.fields.budget, money(500)], [w.fields.style, w.values.style], [w.fields.interests, w.values.interests]];
  return (
    <section id="planner" className="bg-background py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Head eyebrow={t.planner.eyebrow} title={t.planner.title} sub={t.planner.sub} />
        <div ref={ref} className="mt-14 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-border bg-surface p-5">
            <div className="space-y-2">
              {inputs.map(([l, v]) => <div key={l} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"><span className="text-xs text-muted-foreground">{l}</span><span className="text-sm font-medium">{v}</span></div>)}
            </div>
            <button onClick={run} disabled={step >= 0 && step < 5} className="btn-primary mt-4 w-full justify-center disabled:opacity-70">
              <Sparkles size={16} />{step === 5 ? t.planner.regenerate : t.planner.generate}
            </button>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-navy p-5 text-on-dark shadow-soft">
            <div className="flex items-center justify-between">
              <p className="font-medium">{t.planner.dayTitle}</p>
              {step === 0 && <p className="text-xs text-cyan">{t.planner.generating}</p>}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_0.9fr]">
              <ul className="space-y-2">
                {TIMES.map((tm, i) => (
                  <li key={tm} className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-500 ${step > i ? "bg-on-dark/10 opacity-100" : "animate-shimmer bg-on-dark/5 opacity-60"}`}>
                    <span className="font-mono text-xs text-cyan">{tm}</span>
                    <span className={`text-sm transition-opacity ${step > i ? "opacity-100" : "opacity-0"}`}>{t.planner.items[i]}</span>
                  </li>
                ))}
              </ul>
              <div className="relative min-h-52 rounded-2xl bg-navy-deep">
                <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
                  {Array.from({ length: 8 }).map((_, i) => <line key={i} x1="0" y1={i * 28} x2="200" y2={i * 28 + 20} stroke="var(--globe-grid)" />)}
                  <path d="M30 160 L 80 110 L 120 130 L 170 50" fill="none" stroke="var(--cyan)" strokeWidth="2.5" strokeDasharray="300" strokeDashoffset={step >= 4 ? 0 : 300} style={{ transition: "stroke-dashoffset 1.6s ease" }} />
                  {[[30, 160], [80, 110], [120, 130], [170, 50]].map(([x, y], i) => (
                    <g key={i} style={{ opacity: step > i ? 1 : 0, transition: "opacity .4s" }}><circle cx={x} cy={y} r="11" fill="var(--globe-glow)" /><circle cx={x} cy={y} r="5" fill="var(--cyan)" /><text x={x} y={y + 3} textAnchor="middle" fontSize="7" fill="var(--navy-deep)">{i + 1}</text></g>
                  ))}
                </svg>
              </div>
            </div>
            <div className={`mt-4 grid grid-cols-3 gap-2 transition-opacity duration-700 ${step === 5 ? "opacity-100" : "opacity-0"}`}>
              {[[t.planner.route, t.planner.walk], [t.planner.travel, "1 h 20 min"], [t.planner.budget, money(96)]].map(([l, v]) => (
                <div key={l} className="rounded-xl bg-on-dark/5 px-3 py-2"><p className="text-[11px] text-on-dark-muted">{l}</p><p className="text-sm font-medium">{v}</p></div>
              ))}
            </div>
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
                  <div className="flex items-center justify-between"><span className="font-mono text-xs opacity-60">0{i + 1}</span><I size={20} className={i === 1 ? "text-cyan" : "text-azure"} /></div>
                  <p className="eyebrow mt-8">{c.name}</p>
                  <ul className="mt-4 space-y-2.5">
                    {c.items.map((x) => <li key={x} className="flex items-center gap-2 text-sm">{i === 2 ? <X size={14} className="text-destructive" /> : <Check size={14} className={i === 1 ? "text-cyan" : "text-success"} />}{x}</li>)}
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
            <p className="eyebrow text-cyan">{t.adapt.eyebrow}</p>
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
            <span className={`rounded-full px-3 py-1 text-xs ${ev === null ? "bg-on-dark/10 text-on-dark-muted" : "bg-cyan text-navy-deep"}`}>{ev === null ? t.adapt.original : t.adapt.updated}</span>
          </div>
          <div className="mt-4 min-h-14">
            {ev !== null && <p key={ev} className="animate-in fade-in slide-in-from-top-2 flex items-center gap-2 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm"><Sparkles size={15} className="text-warn" />{t.adapt.events[ev].msg}</p>}
          </div>
          <ul className="mt-3 space-y-2">
            {plan.map((item, i) => {
              const changed = ev !== null && item !== t.adapt.base[i];
              return (
                <li key={`${ev}-${i}`} className={`flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-500 ${changed ? "animate-in fade-in slide-in-from-right-4 border border-cyan/50 bg-cyan/10" : "bg-on-dark/5"}`}>
                  <span className="font-mono text-xs text-cyan">{ADAPT_TIMES[i]}</span>
                  <span className="flex-1 text-sm">{item}</span>
                  {changed && <span className="text-[11px] text-cyan">{t.adapt.changed}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

const TOUR = [{ m: 94, p: 380 }, { m: 88, p: 420 }, { m: 81, p: 510 }];

export function Tours() {
  const { t, money } = useI18n();
  return (
    <section id="tours" className="bg-background py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Head eyebrow={t.tours.eyebrow} title={t.tours.title} sub={t.tours.sub} />
          <a href="#compare" className="btn-ghost">{t.tours.cta} <ArrowRight size={16} /></a>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {t.tours.cards.map((c, i) => (
            <Reveal key={i} delay={i * 120}>
              <article className={`group h-full rounded-3xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-soft ${i === 0 ? "border-cyan/60 shadow-glow" : "border-border"}`}>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 font-mono text-xs ${i === 0 ? "bg-gradient-accent text-navy-deep" : "bg-muted"}`}>{TOUR[i].m}% {t.tours.match}</span>
                  <span className="text-xs text-muted-foreground">{c.duration}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold">{c.name}</h3>
                <p className="mt-1 text-3xl font-semibold tracking-tight">{money(TOUR[i].p)}</p>
                <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                  {[[t.tours.hotel, c.hotel], [t.tours.transfer, c.transfer], [t.tours.meals, c.meals], [t.tours.agency, c.agency]].map(([l, v]) => (
                    <div key={l} className="flex justify-between"><dt className="text-muted-foreground">{l}</dt><dd className="font-medium">{v}</dd></div>
                  ))}
                </dl>
                <div className="mt-5 rounded-xl bg-surface p-3 text-sm"><p className="eyebrow text-azure">{t.tours.why}</p><p className="mt-1 text-muted-foreground">{c.why}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">{t.tours.disclaimer}</p>
      </div>
    </section>
  );
}

const BETTER_LEFT = [false, true, true, false, true, false, true, true];

export function Compare() {
  const { t, money } = useI18n();
  const c = t.compare;
  const L = [money(462), ...c.leftVals.slice(1)];
  const R = [money(420), ...c.rightVals.slice(1)];
  return (
    <section id="compare" className="bg-surface py-28">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Head eyebrow={c.eyebrow} title={c.title} center />
        <Reveal className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr] border-b border-border text-sm font-medium">
            <div className="p-4" />
            <div className="flex items-center gap-2 bg-navy p-4 text-on-dark"><Sparkles size={14} className="text-cyan" />{c.left}</div>
            <div className="p-4">{c.right}</div>
          </div>
          {c.rows.map((r, i) => (
            <div key={r} className="grid grid-cols-[1fr_1.2fr_1.2fr] border-b border-border text-sm last:border-0">
              <div className="p-4 text-muted-foreground">{r}</div>
              <div className={`flex items-center justify-between gap-2 p-4 ${BETTER_LEFT[i] ? "bg-cyan/10 font-medium" : ""}`}>{L[i]}{BETTER_LEFT[i] && <span className="hidden rounded-full bg-cyan/20 px-2 py-0.5 text-[10px] sm:inline">{c.better}</span>}</div>
              <div className={`flex items-center justify-between gap-2 p-4 ${!BETTER_LEFT[i] ? "bg-azure/10 font-medium" : ""}`}>{R[i]}{!BETTER_LEFT[i] && <span className="hidden rounded-full bg-azure/20 px-2 py-0.5 text-[10px] sm:inline">{c.better}</span>}</div>
            </div>
          ))}
        </Reveal>
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
                <p className="eyebrow text-cyan">{g.name}</p>
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
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-navy-deep py-32 text-on-dark">
      <div className="pointer-events-none absolute left-1/2 top-[45%] aspect-square w-[min(1100px,160vw)] -translate-x-1/2 opacity-40">
        <Globe className="absolute inset-0" speed={0.04} routes={[["tashkent", "istanbul"], ["istanbul", "newyork"], ["tashkent", "tokyo"], ["paris", "cairo"]]} />
      </div>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
        <path d="M-50 480 C 300 300, 700 560, 1250 200" fill="none" stroke="var(--cyan)" strokeOpacity=".35" className="animate-dash" />
        <path d="M-50 160 C 400 320, 800 60, 1250 380" fill="none" stroke="var(--azure)" strokeOpacity=".3" className="animate-dash" />
      </svg>
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">{t.final.title}</h2>
          <p className="eyebrow mt-6 text-cyan">{t.final.sub}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#planner" className="btn-primary">{t.final.cta1} <ArrowRight size={16} /></a>
            <a href="#workspace" className="btn-ghost-dark">{t.final.cta2}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-on-dark/10 bg-navy-deep text-on-dark">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Logo dark />
          <p className="mt-3 text-sm text-on-dark-muted">{t.footer.tagline}</p>
          <div className="mt-5 flex gap-3 text-on-dark-muted">
            {[Instagram, Send, Linkedin, Github].map((I, i) => <a key={i} href="#top" aria-label="Social" className="rounded-full border border-on-dark/10 p-2 transition hover:text-on-dark"><I size={15} /></a>)}
          </div>
        </div>
        <div>
          <p className="eyebrow text-on-dark-muted">{t.footer.nav}</p>
          <ul className="mt-4 space-y-2 text-sm">{[["#discover", t.nav.discover], ["#planner", t.nav.planner], ["#tours", t.nav.tours], ["#agencies", t.nav.agencies]].map(([h, l]) => <li key={h}><a href={h} className="hover:text-cyan">{l}</a></li>)}</ul>
        </div>
        <div>
          <p className="eyebrow text-on-dark-muted">{t.footer.company}</p>
          <ul className="mt-4 space-y-2 text-sm">{t.footer.companyItems.map((x) => <li key={x}><a href="#top" className="hover:text-cyan">{x}</a></li>)}</ul>
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
