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
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const finished = useRef(false);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      setLeaving(true);
      window.setTimeout(() => done.current(), 700);
    };
    let value = 0;
    const timer = window.setInterval(() => {
      value = Math.min(100, value + 4);
      setProgress(value);
      if (value === 100) {
        window.clearInterval(timer);
        window.setTimeout(finish, 180);
      }
    }, 28);
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[90] bg-background transition-[clip-path] duration-700 ease-[cubic-bezier(.77,0,.18,1)]"
      style={{ clipPath: leaving ? "inset(0 0 100% 0)" : "inset(0)" }}
      aria-label="Opening portfolio"
    >
      <button
        onClick={() => {
          if (finished.current) return;
          finished.current = true;
          setLeaving(true);
          window.setTimeout(() => done.current(), 700);
        }}
        className="absolute right-6 top-6 rounded-full border px-4 py-2 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
      >
        Skip intro
      </button>
      <div className="flex h-full flex-col items-center justify-center px-6">
        <div className="font-hand text-6xl leading-none sm:text-7xl">naitik singh</div>
        <div className="mt-8 h-px w-44 overflow-hidden bg-border">
          <div className="h-full bg-foreground transition-[width] duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 w-44 text-right font-mono text-[10px] text-muted-foreground">
          {String(progress).padStart(3, "0")}
        </div>
      </div>
    </div>
  );
}
