import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import dayTex from "@/assets/tex/earth-blue-marble.jpg.asset.json";
import nightTex from "@/assets/tex/earth-night.jpg.asset.json";
import waterTex from "@/assets/tex/earth-water.png.asset.json";
import { CITIES, type CityKey } from "@/lib/destinations";

export type GlobeProps = {
  routes?: [CityKey, CityKey][];
  markers?: CityKey[];
  focus?: CityKey | null;
  labels?: Partial<Record<CityKey, { name: string; country?: string }>>;
  onHover?: (k: CityKey | null) => void;
  onSelect?: (k: CityKey) => void;
  plane?: boolean;
  compact?: boolean;
  recede?: boolean;
  initialLon?: number;
};

const DEG = Math.PI / 180;
function toVec(k: CityKey, r = 1) {
  const [lon, lat] = CITIES[k];
  const phi = (90 - lat) * DEG, th = (lon + 180) * DEG;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}
function arc(a: CityKey, b: CityKey) {
  const A = toVec(a, 1.003), B = toVec(b, 1.003);
  const lift = 1 + A.distanceTo(B) * 0.32;
  const mid = A.clone().add(B).normalize().multiplyScalar(lift);
  return new THREE.QuadraticBezierCurve3(A, mid, B);
}

const earthVert = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`;
const earthFrag = /* glsl */ `
uniform sampler2D dayT; uniform sampler2D nightT; uniform sampler2D waterT; uniform vec3 sun;
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){
  vec3 n=normalize(vN); float d=dot(n,sun);
  vec3 day=texture2D(dayT,vUv).rgb; vec3 night=texture2D(nightT,vUv).rgb;
  float m=smoothstep(-0.18,0.28,d);
  vec3 col=mix(night*vec3(1.0,0.82,0.55)*1.3, day*(0.32+0.85*max(d,0.0)), m);
  vec3 v=normalize(cameraPosition-vW); vec3 h=normalize(sun+v);
  float w=texture2D(waterT,vUv).r;
  col+=w*pow(max(dot(n,h),0.),48.)*0.45*m*vec3(1.,0.95,0.85);
  float rim=pow(1.-max(dot(n,v),0.),3.);
  col+=vec3(0.45,0.65,1.0)*rim*0.55;
  gl_FragColor=vec4(col,1.);
}`;
const atmoVert = /* glsl */ `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const atmoFrag = /* glsl */ `varying vec3 vN; void main(){ float i=pow(0.68-dot(vN,vec3(0,0,1.)),3.2); gl_FragColor=vec4(0.55,0.75,1.0,1.)*i; }`;

function Plane() {
  return (
    <group scale={0.032}>
      <mesh rotation-x={Math.PI / 2}><capsuleGeometry args={[0.32, 2.2, 4, 12]} /><meshStandardMaterial color="#f4f1ea" metalness={0.3} roughness={0.35} /></mesh>
      <mesh position={[0, 0, 0.1]}><boxGeometry args={[3.2, 0.06, 0.6]} /><meshStandardMaterial color="#e6e2d8" metalness={0.3} roughness={0.4} /></mesh>
      <mesh position={[0, 0.35, 1.25]}><boxGeometry args={[0.06, 0.7, 0.45]} /><meshStandardMaterial color="#c9a45c" /></mesh>
      <mesh position={[0, 0.05, 1.3]}><boxGeometry args={[1.2, 0.05, 0.35]} /><meshStandardMaterial color="#e6e2d8" /></mesh>
    </group>
  );
}

type LabelRefs = MutableRefObject<Partial<Record<CityKey, HTMLDivElement | null>>>;

function Earth({ p, labelEls, wrap }: { p: GlobeProps; labelEls: LabelRefs; wrap: MutableRefObject<HTMLDivElement | null> }) {
  const [day, night, water] = useLoader(THREE.TextureLoader, [dayTex.url, nightTex.url, waterTex.url]);
  const { camera, gl, size } = useThree();
  const group = useRef<THREE.Group>(null!);
  const planeRef = useRef<THREE.Group>(null!);
  const reduce = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const st = useRef({ ry: (-(p.initialLon ?? 40) - 90) * DEG + Math.PI, rx: 0.35, vy: 0, vx: 0, drag: false, lx: 0, ly: 0, mx: 0, my: 0 });

  useEffect(() => { [day, night, water].forEach((t) => { t.anisotropy = 4; }); }, [day, night, water]);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: earthVert, fragmentShader: earthFrag, toneMapped: false,
    uniforms: { dayT: { value: day }, nightT: { value: night }, waterT: { value: water }, sun: { value: new THREE.Vector3(-0.55, 0.35, 1).normalize() } },
  }), [day, night, water]);
  const atmo = useMemo(() => new THREE.ShaderMaterial({ vertexShader: atmoVert, fragmentShader: atmoFrag, side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }), []);

  const routes = p.routes ?? [];
  const curves = useMemo(() => routes.map(([a, b]) => arc(a, b)), [JSON.stringify(routes)]); // eslint-disable-line react-hooks/exhaustive-deps
  const lines = useMemo(() => curves.map((c) => {
    const g = new THREE.BufferGeometry().setFromPoints(c.getPoints(96));
    const base = new THREE.Line(g, new THREE.LineBasicMaterial({ color: "#cfe0ff", transparent: true, opacity: 0.45 }));
    const trail = new THREE.Line(g, new THREE.LineBasicMaterial({ color: "#f2cf86", transparent: true, opacity: 0.95 }));
    return { base, trail };
  }), [curves]);
  const keys = useMemo(() => {
    const s = new Set<CityKey>(p.markers ?? []);
    routes.forEach(([a, b]) => { s.add(a); s.add(b); });
    return [...s];
  }, [JSON.stringify(p.markers), curves]); // eslint-disable-line react-hooks/exhaustive-deps
  const markerPos = useMemo(() => Object.fromEntries(keys.map((k) => [k, toVec(k, 1.006)])) as Record<CityKey, THREE.Vector3>, [keys]);

  useEffect(() => {
    const el = gl.domElement;
    const s = st.current;
    const down = (e: PointerEvent) => { s.drag = true; s.lx = e.clientX; s.ly = e.clientY; };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      s.mx = ((e.clientX - r.left) / r.width - 0.5) * 2; s.my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!s.drag) return;
      const dx = e.clientX - s.lx, dy = e.clientY - s.ly;
      s.vy = dx * 0.005; s.vx = dy * 0.003; s.ry += s.vy; s.rx = THREE.MathUtils.clamp(s.rx + s.vx, -0.9, 0.9);
      s.lx = e.clientX; s.ly = e.clientY;
    };
    const up = () => { s.drag = false; };
    el.addEventListener("pointerdown", down); window.addEventListener("pointermove", move, { passive: true }); window.addEventListener("pointerup", up);
    return () => { el.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [gl]);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const m4 = useMemo(() => new THREE.Matrix4(), []);
  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05), s = st.current, t = state.clock.elapsedTime;
    if (!s.drag) {
      if (p.focus) {
        const [lon, lat] = CITIES[p.focus];
        const target = Math.PI / 2 - (lon + 180) * DEG;
        const diff = Math.atan2(Math.sin(target - s.ry), Math.cos(target - s.ry));
        s.ry += diff * (1 - Math.exp(-3 * dt));
        s.rx += (lat * DEG * 0.8 - s.rx) * (1 - Math.exp(-3 * dt));
      } else {
        s.ry += s.vy; s.rx = THREE.MathUtils.clamp(s.rx + s.vx, -0.9, 0.9);
        if (!reduce) s.ry += 0.06 * dt;
      }
      s.vy *= Math.exp(-4 * dt); s.vx *= Math.exp(-4 * dt);
    }
    group.current.rotation.set(s.rx, s.ry, 0);

    const recede = p.recede ? Math.min(1, window.scrollY / window.innerHeight) : 0;
    camera.position.x += (s.mx * 0.12 - camera.position.x) * 0.05;
    camera.position.y += (-s.my * 0.08 - camera.position.y) * 0.05;
    camera.position.z = 3.3 + recede * 1.2;
    camera.lookAt(0, 0, 0);

    lines.forEach(({ trail }, i) => {
      const prog = reduce ? 1 : (t * 0.12 + i * 0.33) % 1;
      const head = Math.floor(prog * 97);
      trail.geometry.setDrawRange(Math.max(0, head - 22), Math.min(22, head));
    });

    if (planeRef.current && curves.length) {
      const total = curves.length;
      const u = reduce ? 0.35 : (t * 0.035 + (p.recede ? window.scrollY * 0.00025 : 0)) % 1;
      const idx = Math.min(total - 1, Math.floor(u * total)), lu = u * total - idx;
      const c = curves[idx];
      const pos = c.getPoint(lu), tan = c.getTangent(lu);
      planeRef.current.position.copy(pos);
      m4.lookAt(pos, tmp.copy(pos).add(tan), pos.clone().normalize());
      planeRef.current.quaternion.setFromRotationMatrix(m4);
    }

    // DOM labels
    const w = size.width, h = size.height;
    keys.forEach((k) => {
      const el = labelEls.current[k];
      if (!el) return;
      tmp.copy(markerPos[k]);
      group.current.localToWorld(tmp);
      const facing = tmp.clone().normalize().dot(camera.position.clone().sub(tmp).normalize());
      tmp.project(camera);
      const x = (tmp.x + 1) / 2 * w, y = (1 - tmp.y) / 2 * h;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const vis = facing > 0.25;
      el.style.opacity = vis ? String(Math.min(1, (facing - 0.25) * 4)) : "0";
      el.style.pointerEvents = vis ? "auto" : "none";
    });
    void wrap;
  });

  const seg = p.compact ? 64 : 96;
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[-3, 2, 5]} intensity={1.6} />
      <mesh material={atmo} scale={1.16}><sphereGeometry args={[1, 48, 48]} /></mesh>
      <group ref={group}>
        <mesh material={mat}><sphereGeometry args={[1, seg, seg]} /></mesh>
        {lines.map(({ base, trail }, i) => <group key={i}><primitive object={base} /><primitive object={trail} /></group>)}
        {keys.map((k) => (
          <mesh key={k} position={markerPos[k]}>
            <sphereGeometry args={[p.focus === k ? 0.016 : 0.011, 12, 12]} />
            <meshBasicMaterial color={p.focus === k ? "#f2cf86" : "#ffffff"} toneMapped={false} />
          </mesh>
        ))}
        {p.plane !== false && curves.length > 0 && <group ref={planeRef}><Plane /></group>}
      </group>
    </>
  );
}

export default function GlobeScene(p: GlobeProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const labelEls: LabelRefs = useRef({});
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);
  const labelKeys = Object.keys(p.labels ?? {}) as CityKey[];
  return (
    <div ref={wrap} className="relative h-full w-full cursor-grab active:cursor-grabbing" style={{ touchAction: "pan-y" }}>
      <Canvas dpr={[1, p.compact ? 1.5 : 2]} frameloop={visible ? "always" : "never"} camera={{ position: [0, 0, 3.3], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <Suspense fallback={null}><Earth p={p} labelEls={labelEls} wrap={wrap} /></Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden={false}>
        {labelKeys.map((k) => {
          const l = p.labels![k]!;
          const active = p.focus === k;
          return (
            <div key={k} ref={(el) => { labelEls.current[k] = el; }} className="absolute left-0 top-0 opacity-0 transition-opacity duration-300">
              <button type="button" onMouseEnter={() => p.onHover?.(k)} onMouseLeave={() => p.onHover?.(null)} onFocus={() => p.onHover?.(k)} onClick={() => p.onSelect?.(k)}
                className={`ml-2 -mt-3 flex items-start gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-left backdrop-blur-md transition ${active ? "bg-gold text-navy-deep" : "bg-navy-deep/70 text-on-dark hover:bg-navy-deep/90"}`}>
                <span className="leading-tight">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em]">{l.name}</span>
                  {l.country && <span className={`block text-[10px] ${active ? "text-navy-deep/70" : "text-on-dark-muted"}`}>{l.country}</span>}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
