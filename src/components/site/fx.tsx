import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("in");
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Intro({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"draw" | "out">("draw");
  const done = useRef(onDone);
  done.current = onDone;
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setPhase("out");
    window.setTimeout(() => done.current(), 1100);
  };

  useEffect(() => {
    const start = performance.now();
    const total = 2600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(finish, 250);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("keydown", finish);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const out = phase === "out";
  return (
    <div className="fixed inset-0 z-[90]" aria-label="Opening portfolio">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-foreground transition-transform duration-[1000ms] ease-[cubic-bezier(.77,0,.18,1)]" style={{ transform: out ? "translateY(-100%)" : "none" }} />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-foreground transition-transform duration-[1000ms] ease-[cubic-bezier(.77,0,.18,1)]" style={{ transform: out ? "translateY(100%)" : "none" }} />
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-background transition-all duration-500 ${out ? "scale-110 opacity-0 blur-sm" : ""}`}>
        <svg viewBox="0 0 600 160" className="w-[min(86vw,620px)]" aria-label="naitik singh">
          <text x="50%" y="62%" textAnchor="middle" className="intro-sign font-hand" fontSize="128" fill="currentColor" stroke="currentColor" strokeWidth="1.4">naitik singh</text>
        </svg>
        <div className="mt-6 flex w-[min(70vw,360px)] items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
          <span className="intro-rise" style={{ animationDelay: "300ms" }}>Portfolio</span>
          <span className="h-px flex-1 overflow-hidden bg-background/20">
            <span className="block h-full bg-background" style={{ width: `${count}%` }} />
          </span>
          <span className="tabular-nums">{String(count).padStart(3, "0")}</span>
        </div>
        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] opacity-40 intro-rise" style={{ animationDelay: "700ms" }}>Indore · 2026</div>
      </div>
      <button onClick={finish} className={`absolute right-6 top-6 rounded-full border border-background/30 px-4 py-2 text-xs text-background/70 transition hover:text-background ${out ? "opacity-0" : ""}`}>
        Skip intro
      </button>
    </div>
  );
}

/** Letters rise in one by one. */
export function SplitText({ text, show, className = "", delay = 0 }: { text: string; show: boolean; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)]"
            style={{ transform: show ? "none" : "translateY(110%) rotate(8deg)", opacity: show ? 1 : 0, transitionDelay: `${delay + i * 45}ms` }}
          >
            {ch === " " ? "\u00a0" : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Dot grid that reacts to the cursor. */
export function DotGrid() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e: PointerEvent) => { mouse.tx = e.clientX; mouse.ty = e.clientY; };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    const gap = 28;
    const draw = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      const color = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "black";
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      const off = (window.scrollY * 0.3) % gap;
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2 - off; y < h + gap; y += gap) {
          const dx = x - mouse.x, dy = y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const f = Math.max(0, 1 - d / 180);
          const wave = reduce ? 0 : Math.sin(t / 1400 + x / 140 + y / 180) * 0.5 + 0.5;
          const px = x + (d > 0 ? (dx / d) * f * 14 : 0);
          const py = y + (d > 0 ? (dy / d) * f * 14 : 0);
          ctx.globalAlpha = 0.07 + wave * 0.05 + f * 0.5;
          ctx.beginPath();
          ctx.arc(px, py, 0.8 + f * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}

/** 3D tilt with cursor spotlight. */
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg) scale(1.015)`;
    el.style.setProperty("--sx", `${x * 100}%`);
    el.style.setProperty("--sy", `${y * 100}%`);
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt-card relative transition-transform duration-300 ease-out will-change-transform ${className}`}>
      {children}
      <div aria-hidden className="tilt-shine pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300" />
    </div>
  );
}

/** Thin scroll progress bar. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div ref={ref} aria-hidden className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-foreground" style={{ transform: "scaleX(0)" }} />;
}
