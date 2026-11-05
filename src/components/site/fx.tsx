import { useEffect, useRef, useState, type ReactNode } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEFX";

export function Scramble({ text, className, trigger = true }: { text: string; className?: string; trigger?: boolean }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const total = text.length * 3 + 12;
    const id = setInterval(() => {
      frame++;
      setOut(
        text
          .split("")
          .map((c, i) => (c === " " ? " " : frame > i * 3 + 8 ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (frame >= total) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [text, trigger]);
  return <span className={className}>{out}</span>;
}

export function HoverScramble({ text, className }: { text: string; className?: string }) {
  const [k, setK] = useState(0);
  return (
    <span onMouseEnter={() => setK((v) => v + 1)} className={className}>
      <Scramble key={k} text={text} trigger={k > 0} />
    </span>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = 0, y = 0, rx = 0, ry = 0, big = false, raf = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      big = !!(e.target as HTMLElement).closest("a,button,input,textarea,[data-hover]");
    };
    const loop = () => {
      rx += (x - rx) * 0.15; ry += (y - ry) * 0.15;
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${big ? 2.2 : 1})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    loop();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] mix-blend-difference max-md:hidden">
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-foreground" />
      <div ref={ring} className="absolute left-0 top-0 h-9 w-9 rounded-full border border-foreground transition-[scale] duration-300" style={{ transition: "transform 0.08s linear" }} />
    </div>
  );
}

export function Intro({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [leaving, setLeaving] = useState(false);
  const boot = [
    "> init kernel.naitik ........ ok",
    "> mount /dev/creativity ..... ok",
    "> compile --O3 portfolio.cpp  ok",
    "> link react@19 + c++20 ..... ok",
    "> handshake: visitor ........ accepted",
  ];
  useEffect(() => {
    const t = setInterval(() => setN((v) => Math.min(100, v + Math.ceil(Math.random() * 6))), 45);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    setLines(boot.slice(0, Math.floor((n / 100) * boot.length)));
    if (n >= 100) {
      const a = setTimeout(() => setLeaving(true), 400);
      const b = setTimeout(onDone, 1500);
      return () => { clearTimeout(a); clearTimeout(b); };
    }
  }, [n]);
  useEffect(() => {
    const skip = () => { setLeaving(true); setTimeout(onDone, 900); };
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, []);
  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col justify-between bg-background p-6 md:p-10 transition-[clip-path] duration-1000"
      style={{ clipPath: leaving ? "inset(0 0 100% 0)" : "inset(0 0 0 0)", transitionTimingFunction: "cubic-bezier(.77,0,.18,1)" }}
    >
      <div className="flex justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <span>nsb://boot</span>
        <span>press any key to skip</span>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground md:text-sm">
        {lines.map((l) => <div key={l}>{l}</div>)}
        <span className="animate-blink">█</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="font-display text-[28vw] font-extrabold leading-[0.8] tracking-tighter md:text-[20vw]">
          {String(n).padStart(3, "0")}
        </div>
        <div className="mb-4 hidden font-serif text-3xl italic md:block">Naitik Singh</div>
      </div>
      <div className="absolute bottom-0 left-0 h-px bg-foreground transition-all" style={{ width: `${n}%` }} />
    </div>
  );
}
