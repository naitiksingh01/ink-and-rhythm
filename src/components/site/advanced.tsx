import { useEffect, useState, type ReactNode } from "react";
import { Check, Command, Copy, Moon, Music2, Sun, X } from "lucide-react";

const SHAPES = [
  { left: "7%", top: "18%", size: "3rem", delay: "-2s" },
  { left: "88%", top: "26%", size: "2rem", delay: "-8s" },
  { left: "13%", top: "64%", size: "1.75rem", delay: "-5s" },
  { left: "84%", top: "73%", size: "3.5rem", delay: "-11s" },
  { left: "72%", top: "8%", size: "1.5rem", delay: "-4s" },
];

export function AmbientShapes() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {SHAPES.map((shape, i) => (
        <span
          key={i}
          className="absolute animate-float font-sans text-foreground opacity-[0.055] blur-[.4px]"
          style={{ left: shape.left, top: shape.top, fontSize: shape.size, animationDelay: shape.delay }}
        >
          ✳
        </span>
      ))}
    </div>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("portfolio-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export function InlinePreview({ children, href, preview }: { children: ReactNode; href: string; preview: ReactNode }) {
  return (
    <span className="group relative inline-block">
      <a href={href} className="underline decoration-border underline-offset-4 transition hover:decoration-foreground">
        {children}
      </a>
      <span className="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 z-30 hidden w-72 -translate-x-1/2 translate-y-2 overflow-hidden rounded-xl border bg-card opacity-0 shadow-soft transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:block">
        <span className="block aspect-[16/10]">{preview}</span>
      </span>
    </span>
  );
}

export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const email = "naitiksinghh01@gmail.com";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const input = document.createElement("textarea");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition hover:bg-secondary"
      aria-live="polite"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Email copied" : "Copy email"}
    </button>
  );
}

const COMMANDS: [string, string][] = [
  ["Selected work", "#work"],
  ["About me", "#about"],
  ["Music", "#music"],
  ["Contact", "#contact"],
  ["Send an email", "mailto:naitiksinghh01@gmail.com"],
];

export function CommandMenu({ onToggleMusic }: { onToggleMusic: () => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const list = [...COMMANDS, ["Play or pause music", "music"] as [string, string]].filter(([label]) =>
    label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        setSelected(0);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = (action: string) => {
    setOpen(false);
    setQuery("");
    if (action === "music") onToggleMusic();
    else if (action.startsWith("#")) document.querySelector(action)?.scrollIntoView({ behavior: "smooth" });
    else window.location.href = action;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open quick menu"
        className="flex h-9 items-center gap-2 rounded-full border px-3 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
      >
        <Command size={13} />
        <span className="hidden sm:inline">K</span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-background/70 px-4 pt-[16vh] backdrop-blur-sm animate-in fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Quick menu"
            className="w-full max-w-md overflow-hidden rounded-2xl border bg-popover shadow-soft animate-in zoom-in-95 slide-in-from-top-2"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center border-b px-4">
              <Command size={15} className="text-muted-foreground" />
              <input
                autoFocus
                value={query}
                aria-label="Search commands"
                placeholder="Where do you want to go?"
                onChange={(event) => { setQuery(event.target.value); setSelected(0); }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") { event.preventDefault(); setSelected((value) => Math.min(list.length - 1, value + 1)); }
                  if (event.key === "ArrowUp") { event.preventDefault(); setSelected((value) => Math.max(0, value - 1)); }
                  if (event.key === "Enter" && list[selected]) run(list[selected][1]);
                }}
                className="w-full bg-transparent px-3 py-4 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button aria-label="Close quick menu" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <ul className="max-h-72 overflow-auto p-2">
              {list.map(([label, action], index) => (
                <li key={label}>
                  <button
                    onMouseEnter={() => setSelected(index)}
                    onClick={() => run(action)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${index === selected ? "bg-secondary" : ""}`}
                  >
                    {action === "music" ? <Music2 size={15} /> : <span className="w-[15px] text-center text-muted-foreground">↗</span>}
                    {label}
                  </button>
                </li>
              ))}
              {!list.length && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matching commands</li>}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
