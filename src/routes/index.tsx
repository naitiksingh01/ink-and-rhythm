import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Cursor, HoverScramble, Intro, Reveal, Scramble } from "@/components/site/fx";
import { MiniPlayer, MusicProvider, OnRepeat, useMusic } from "@/components/site/music";
import { CommandMenu, CountUp, DotField, Magnetic, ScrollText, Tilt } from "@/components/site/advanced";

function Cmd() { const m = useMusic(); return <CommandMenu onToggleMusic={m.toggle} />; }

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Naitik Singh Bhadoriya — Full Stack & Systems Engineer" },
      { name: "description", content: "C++ systems meets modern React interfaces. Portfolio of Naitik Singh Bhadoriya, developer from Indore, India." },
      { property: "og:title", content: "Naitik Singh Bhadoriya — Engineer" },
      { property: "og:description", content: "High-performance C++ systems meets modern React interfaces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV: [string, string][] = [["work", "#work"], ["about", "#about"], ["stack", "#stack"], ["music", "#music"], ["contact", "#contact"]];
const STACK = ["C++", "TypeScript", "Next.js 15", "React 19", "Systems Design", "TanStack Query", "Node / Express", "Python", "Tailwind"];
const PROJECTS = [
  { n: "01", name: "Project Alpha", desc: "Full-stack application in active development. Precision architecture, deliberate UI.", tags: ["Next.js", "TypeScript", "TanStack"], year: "2026" },
  { n: "02", name: "Project Beta", desc: "Backend-heavy system focused on performance and real-time data.", tags: ["React", "Node", "Express"], year: "2025" },
  { n: "03", name: "System Project", desc: "High-performance C++ work. Currently in stealth.", tags: ["C++", "Systems"], year: "stealth" },
];

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata" }));
    f(); const id = setInterval(f, 1000); return () => clearInterval(id);
  }, []);
  return <span>{t} IST</span>;
}

function Label({ cmd }: { cmd: string }) {
  return <div className="mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">$ {cmd}<span className="animate-blink">_</span></div>;
}

function Index() {
  const [ready, setReady] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const s = () => setScroll(window.scrollY);
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);

  const onHeroMove = (e: React.MouseEvent) => {
    const el = heroRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width - 0.5) * 30}px`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height - 0.5) * 30}px`);
  };

  return (
    <MusicProvider>
      <div className="grain min-h-screen overflow-x-hidden">
        {!ready && <Intro onDone={() => setReady(true)} />}
        <Cursor />

        {/* progress */}
        <div className="fixed left-0 top-0 z-50 h-px bg-foreground" style={{ width: `${typeof document !== "undefined" ? (scroll / Math.max(1, document.body.scrollHeight - window.innerHeight)) * 100 : 0}%` }} />

        <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 mix-blend-difference md:px-10">
          <a href="#top" className="font-display text-lg font-extrabold">NSB<span className="text-muted-foreground">©26</span></a>
          <nav className="hidden gap-8 text-xs uppercase tracking-[0.2em] md:flex">
            {NAV.map(([l, h]) => <a key={l} href={h} className="hover:line-through"><HoverScramble text={l} /></a>)}
          </nav>
          <div className="flex items-center gap-4"><Cmd /><span className="text-xs text-muted-foreground"><Clock /></span></div>
        </header>

        {/* HERO */}
        <section id="top" ref={heroRef} onMouseMove={onHeroMove} className="relative flex min-h-screen flex-col justify-end px-6 pb-10 pt-32 md:px-10">
          <div className="grid-bg absolute inset-0 -z-10" />
          <DotField />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-background to-transparent" />
          <div className="mb-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-foreground" /> available for work — indore, india
          </div>
          {ready && (
            <h1 className="font-display font-extrabold uppercase leading-[0.82] tracking-tighter" style={{ transform: "translate(var(--mx,0),var(--my,0))", transition: "transform .4s ease-out" }}>
              <span className="block overflow-hidden text-[11vw] md:text-[7vw]"><span className="rise-line">Naitik Singh</span></span>
              <span className="block overflow-hidden text-[11vw] md:text-[7vw]">
                <span className="rise-line text-outline" style={{ animationDelay: ".15s" }}>Bhadoriya</span>
              </span>
            </h1>
          )}
          <div className="mt-10 grid gap-8 border-t pt-6 md:grid-cols-3">
            <p className="text-sm leading-relaxed text-muted-foreground md:col-span-2 md:max-w-xl">
              {ready && <Scramble text="Full-stack developer" className="text-foreground" />} based in Indore, India. I build web apps with React, Next.js and TypeScript, and write C++ for performance-focused work.
            </p>
            <div className="flex gap-3 md:justify-end">
              <Magnetic><a href="#work" className="block border bg-foreground px-6 py-3 text-xs uppercase tracking-widest text-background transition hover:bg-transparent hover:text-foreground">View work ↘</a></Magnetic>
              <Magnetic><a href="#contact" className="block border px-6 py-3 text-xs uppercase tracking-widest transition hover:bg-foreground hover:text-background">Contact</a></Magnetic>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="-rotate-1 border-y bg-foreground py-4 text-background">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xl font-bold uppercase md:text-2xl">
            {[...STACK, ...STACK].map((s, i) => <span key={i} className="flex items-center gap-10">{s}<span>✦</span></span>)}
          </div>
        </div>

        {/* ABOUT */}
        <section id="about" className="px-6 py-24 md:px-10">
          <Label cmd="whoami" />
          <Reveal>
            <h2 className="max-w-5xl font-display text-4xl font-bold leading-[0.95] tracking-tight md:text-6xl">
              About <span className="font-serif font-normal italic text-muted-foreground">me</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <Reveal delay={100}>
              <ScrollText className="text-xl leading-relaxed md:text-2xl" text="I'm a Computer Science student and full-stack developer. I work on web apps with Next.js and TypeScript, and I use C++ for data structures, algorithms and systems work. I like clean code, fast apps and simple interfaces." />
              <blockquote className="mt-10 border-l-2 border-foreground pl-6 font-serif text-2xl italic">
                "Make it work, make it right, make it fast."
                <footer className="mt-2 font-mono text-xs not-italic text-muted-foreground">— Kent Beck</footer>
              </blockquote>
            </Reveal>
            <Reveal delay={200}>
              <dl className="divide-y border-y text-sm">
                {[["role", "Full Stack Developer"], ["focus", "Systems · Interfaces"], ["based in", "Indore, India"], ["education", "Computer Science"], ["status", "● available"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-4"><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </Reveal>
          </div>
          <div className="mt-20 grid grid-cols-2 border-t md:grid-cols-4">
            {([[3, "+", "Years coding"], [10, "+", "Projects built"], [5, "", "Languages & frameworks"], [100, "%", "Effort, every time"]] as [number, string, string][]).map(([n, suf, l]) => (
              <div key={l} className="border-b border-r p-6 last:border-r-0">
                <div className="font-display text-4xl font-extrabold md:text-5xl"><CountUp to={n} suffix={suf} /></div>
                <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="px-6 py-24 md:px-10">
          <Label cmd="ls ~/projects" />
          <Reveal><h2 className="mb-16 font-display text-4xl font-bold tracking-tight md:text-6xl">Selected <span className="font-serif font-normal italic">work</span></h2></Reveal>
          <div className="space-y-6">
            {PROJECTS.map((p, i) => (
              <div key={p.n} className="sticky" style={{ top: `${96 + i * 24}px` }}>
                <Tilt className="group border bg-card">
                  <a href="#contact" className="grid min-h-[300px] gap-8 p-8 md:grid-cols-[1fr_1.2fr] md:p-12">
                    <div className="flex flex-col justify-between gap-6">
                      <span className="text-xs text-muted-foreground">{p.n} / {String(PROJECTS.length).padStart(2, "0")} — {p.year}</span>
                      <h3 className="font-display text-3xl font-extrabold uppercase tracking-tight md:text-5xl">{p.name}</h3>
                      <div className="flex flex-wrap gap-2">{p.tags.map((t) => <span key={t} className="border px-2 py-0.5 text-[10px] uppercase">{t}</span>)}</div>
                    </div>
                    <div className="flex flex-col justify-between gap-6">
                      <div className="relative aspect-[16/9] overflow-hidden border bg-background grid-bg">
                        <span className="absolute inset-0 grid place-items-center font-display text-7xl font-extrabold text-outline opacity-40 transition duration-700 group-hover:scale-110 group-hover:opacity-100">{p.n}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{p.desc} <span className="text-foreground">↗</span></p>
                    </div>
                  </a>
                </Tilt>
              </div>
            ))}
          </div>
        </section>

        {/* HISTORY + STACK */}
        <section id="stack" className="grid gap-20 border-t px-6 py-24 md:grid-cols-2 md:px-10">
          <div>
            <Label cmd="history" />
            {[["2025 — now", "Full Stack Developer", "Building web applications with Next.js, TypeScript and TanStack Query.", "Freelance"], ["ongoing", "Computer Science", "Studying data structures, algorithms, operating systems and systems design, mostly in C++.", "Student"]].map(([d, t, s, r], i) => (
              <Reveal key={t} delay={i * 100} className="relative border-l py-6 pl-8">
                <span className="absolute -left-[5px] top-8 h-2.5 w-2.5 rounded-full bg-foreground" />
                <div className="text-xs text-muted-foreground">{d} · {r}</div>
                <div className="mt-2 font-display text-2xl font-bold">{t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s}</p>
              </Reveal>
            ))}
          </div>
          <div>
            <Label cmd="cat stack.json" />
            <Reveal>
              <pre className="overflow-x-auto border bg-card p-6 text-sm leading-7">
{`{
  `}<span className="text-muted-foreground">"languages"</span>{`:  ["C++", "TypeScript", "Python"],
  `}<span className="text-muted-foreground">"frameworks"</span>{`: ["React", "Next.js 15",
                 "TanStack Query", "Node/Express",
                 "Tailwind"],
  `}<span className="text-muted-foreground">"tools"</span>{`:      ["Git", "Vercel", "Figma",
                 "Systems Design"]
}`}
              </pre>
            </Reveal>
          </div>
        </section>

        {/* MUSIC */}
        <section id="music" className="border-t px-6 py-24 md:px-10">
          <Label cmd="afplay --now-playing" />
          <Reveal><h2 className="mb-16 font-display text-4xl font-bold tracking-tight md:text-6xl">On <span className="font-serif font-normal italic">repeat</span></h2></Reveal>
          <Reveal><OnRepeat /></Reveal>
        </section>

        {/* CONTACT */}
        <section id="contact" className="border-t px-6 py-24 md:px-10">
          <Label cmd="contact --send" />
          <Reveal>
            <h2 className="font-display text-[10vw] font-extrabold uppercase leading-[0.9] tracking-tighter md:text-[5.5vw]">
              Get in<br /><span className="text-outline">touch</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div className="space-y-6 text-sm">
              <p className="max-w-md text-muted-foreground">Open to freelance work, internships and collaborations. Send me a message and I'll get back to you.</p>
              <a href="mailto:naitiksinghh01@gmail.com" className="block font-display text-xl font-bold underline-offset-8 hover:underline md:text-3xl">naitiksinghh01@gmail.com</a>
              <div className="text-muted-foreground">Indore, India · available for work</div>
            </div>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                window.location.href = `mailto:naitiksinghh01@gmail.com?subject=${encodeURIComponent(`Hello from ${f.get("name")}`)}&body=${encodeURIComponent(`${f.get("message")}\n\n— ${f.get("email")}`)}`;
              }}
            >
              {["name", "email"].map((n) => (
                <input key={n} name={n} type={n === "email" ? "email" : "text"} required placeholder={n} className="w-full border-b bg-transparent py-3 outline-none placeholder:text-muted-foreground focus:border-foreground" />
              ))}
              <textarea name="message" required rows={4} placeholder="message" className="w-full resize-none border-b bg-transparent py-3 outline-none placeholder:text-muted-foreground focus:border-foreground" />
              <button className="w-full border bg-foreground py-4 text-xs uppercase tracking-[0.3em] text-background transition hover:bg-transparent hover:text-foreground">Send message →</button>
            </form>
          </div>
        </section>

        <footer className="flex flex-wrap justify-between gap-4 border-t px-6 py-8 text-xs text-muted-foreground md:px-10">
          <span>© 2026 Naitik Singh Bhadoriya</span>
          <span>Indore, India</span>
          <a href="#top" className="hover:text-foreground">back to top ↑</a>
        </footer>

        <MiniPlayer />
      </div>
    </MusicProvider>
  );
}
