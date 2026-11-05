import { useEffect, useRef, useState, type ReactNode } from "react";

/** Interactive dot field that bends away from the cursor. */
export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim() || "white";
    let w = 0, h = 0, raf = 0, mx = -999, my = -999, t = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      w = c.offsetWidth; h = c.offsetHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e: MouseEvent) => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = fg;
      const gap = 28;
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy);
          const f = Math.max(0, 1 - d / 160);
          const wave = Math.sin(x * 0.01 + y * 0.012 + t * 2) * 0.5 + 0.5;
          const px = x + (dx / (d || 1)) * f * 24, py = y + (dy / (d || 1)) * f * 24;
          ctx.globalAlpha = 0.08 + wave * 0.12 + f * 0.7;
          ctx.beginPath(); ctx.arc(px, py, 0.8 + f * 1.8, 0, Math.PI * 2); ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize", resize); window.addEventListener("mousemove", move);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", move); };
  }, []);
  return <canvas ref={ref} aria-hidden className="absolute inset-0 -z-10 h-full w-full" />;
}

/** Element that gets pulled toward the cursor. */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
      }}
      onMouseLeave={() => { ref.current!.style.transform = ""; }}
    >
      {children}
    </div>
  );
}

/** Paragraph whose words light up as you scroll through it. */
export function ScrollText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const r = ref.current!.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4))));
    };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="transition-opacity duration-300" style={{ opacity: i / words.length < p ? 1 : 0.15 }}>{w} </span>
      ))}
    </p>
  );
}

/** Number that counts up when visible. */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / 1400);
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

/** Card that tilts in 3D following the cursor, with a light spot. */
export function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden transition-transform duration-200 ease-out [transform-style:preserve-3d] ${className}`}
      onMouseMove={(e) => {
        const el = ref.current!, r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg)`;
        el.style.setProperty("--lx", `${x * 100}%`); el.style.setProperty("--ly", `${y * 100}%`);
      }}
      onMouseLeave={() => { ref.current!.style.transform = ""; }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [.group:hover_&]:opacity-100" style={{ background: "radial-gradient(400px circle at var(--lx) var(--ly), color-mix(in oklab, var(--foreground) 10%, transparent), transparent 60%)" }} />
      {children}
    </div>
  );
}

const CMDS: [string, string][] = [
  ["Go to top", "#top"], ["About", "#about"], ["Work", "#work"], ["Experience & stack", "#stack"],
  ["Music", "#music"], ["Contact", "#contact"], ["Send email", "mailto:naitiksinghh01@gmail.com"],
];

/** Ctrl/⌘ + K command menu. */
export function CommandMenu({ onToggleMusic }: { onToggleMusic: () => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const all: [string, string][] = [...CMDS, ["Play / pause music", "music"]];
  const list = all.filter(([l]) => l.toLowerCase().includes(q.toLowerCase()));
  const run = (h: string) => {
    setOpen(false); setQ("");
    if (h === "music") onToggleMusic(); else window.location.href = h;
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); setSel(0); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  return (
    <>
      <button onClick={() => setOpen(true)} className="hidden items-center gap-2 border px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground md:flex">
        Menu <kbd className="border px-1">⌘K</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-[75] flex items-start justify-center bg-background/70 pt-[18vh] backdrop-blur-sm animate-in fade-in" onClick={() => setOpen(false)}>
          <div className="w-[min(560px,92vw)] border bg-card animate-in zoom-in-95 slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus value={q} placeholder="Type a command…"
              onChange={(e) => { setQ(e.target.value); setSel(0); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") setSel((s) => Math.min(list.length - 1, s + 1));
                if (e.key === "ArrowUp") setSel((s) => Math.max(0, s - 1));
                if (e.key === "Enter" && list[sel]) run(list[sel][1]);
              }}
              className="w-full border-b bg-transparent px-5 py-4 text-sm outline-none placeholder:text-muted-foreground"
            />
            <ul className="max-h-80 overflow-auto py-2">
              {list.map(([l, h], i) => (
                <li key={l}>
                  <button onMouseEnter={() => setSel(i)} onClick={() => run(h)} className={`flex w-full justify-between px-5 py-3 text-left text-sm ${i === sel ? "bg-foreground text-background" : ""}`}>
                    {l}<span className="text-xs opacity-60">↵</span>
                  </button>
                </li>
              ))}
              {!list.length && <li className="px-5 py-3 text-sm text-muted-foreground">No results</li>}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
