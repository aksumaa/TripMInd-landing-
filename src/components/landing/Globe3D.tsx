import { lazy, Suspense, useEffect, useState } from "react";
import type { GlobeProps } from "./GlobeScene";

const Scene = lazy(() => import("./GlobeScene"));

function Placeholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="aspect-square w-[62%] animate-pulse rounded-full bg-gradient-to-br from-azure/30 to-navy/40 shadow-glow" />
    </div>
  );
}

/** Client-only realistic 3D globe; renders a soft placeholder during SSR and while textures load. */
export function Globe3D({ className = "", ...p }: GlobeProps & { className?: string }) {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  return (
    <div className={className}>
      {ok ? <Suspense fallback={<Placeholder />}><Scene {...p} /></Suspense> : <Placeholder />}
    </div>
  );
}
