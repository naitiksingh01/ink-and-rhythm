import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Cursor, HoverScramble, Intro, Reveal, Scramble } from "@/components/site/fx";
import { MiniPlayer, MusicProvider, OnRepeat } from "@/components/site/music";

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
          <span className="text-xs text-muted-foreground"><Clock /></span>
        </header>

        {/* HERO */}
        <section id="top" ref={heroRef} onMouseMove={onHeroMove} className="relative flex min-h-screen flex-col justify-end px-6 pb-10 pt-32 md:px-10">
          <div className="grid-bg absolute inset-0 -z-10" />
          <div className="mb-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-foreground" /> available for work — indore, india
          </div>
          {ready && (
            <h1 className="font-display font-extrabold uppercase leading-[0.82] tracking-tighter" style={{ transform: "translate(var(--mx,0),var(--my,0))", transition: "transform .4s ease-out" }}>
              <span className="block overflow-hidden text-[16vw] md:text-[12vw]"><span className="rise-line">I build</span></span>
              <span className="block overflow-hidden text-[16vw] md:text-[12vw]">
                <span className="rise-line text-outline" style={{ animationDelay: ".12s" }}>things</span>{" "}
                <span className="rise-line font-serif font-normal normal-case italic tracking-normal" style={{ animationDelay: ".2s" }}>that</span>
              </span>
              <span className="block overflow-hidden text-[16vw] md:text-[12vw]"><span className="rise-line" style={{ animationDelay: ".28s" }}>don't break.</span></span>
            </h1>
          )}
          <div className="mt-10 grid gap-8 border-t pt-6 md:grid-cols-3">
            <p className="text-sm leading-relaxed text-muted-foreground md:col-span-2 md:max-w-xl">
              {ready && <Scramble text="Naitik Singh Bhadoriya" className="text-foreground" />} — high-performance C++ systems meets modern React interfaces. Obsessed with precision, speed, and software that feels inevitable.
            </p>
            <div className="flex gap-3 md:justify-end">
              <a href="#work" className="border bg-foreground px-6 py-3 text-xs uppercase tracking-widest text-background transition hover:bg-transparent hover:text-foreground">View work ↘</a>
              <a href="#contact" className="border px-6 py-3 text-xs uppercase tracking-widest transition hover:bg-foreground hover:text-background">Contact</a>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="-rotate-2 border-y bg-foreground py-4 text-background">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-3xl font-extrabold uppercase md:text-5xl">
            {[...STACK, ...STACK].map((s, i) => <span key={i} className="flex items-center gap-10">{s}<span>✦</span></span>)}
          </div>
        </div>

        {/* ABOUT */}
        <section id="about" className="px-6 py-32 md:px-10">
          <Label cmd="whoami" />
          <Reveal>
            <h2 className="max-w-5xl font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-8xl">
              Not just code. <span className="font-serif font-normal italic text-muted-foreground">Engineering.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <Reveal delay={100}>
              <p className="text-lg leading-relaxed text-muted-foreground">
                I'm a CS student and developer focused on software that performs under pressure — low-level systems in C++ or polished full-stack products with Next.js and TypeScript. I care about clean architecture, measurable performance, and interfaces that feel sharp.
              </p>
              <blockquote className="mt-10 border-l-2 border-foreground pl-6 font-serif text-3xl italic">
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
        </section>

        {/* MANIFESTO */}
        <section className="border-y px-6 py-32 md:px-10">
          <Label cmd="cat manifesto.txt" />
          {[["Ship it clean.", "Ship it fast.", "Ship it once."], ["If it isn't measured,", "it isn't", "engineering."], ["Break the build —", "never", "the trust."]].map((l, i) => (
            <Reveal key={i} delay={i * 80}>
              <p className="font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-7xl">
                {l[0]} <span className="text-outline">{l[1]}</span> <span className="font-serif font-normal normal-case italic">{l[2]}</span>
              </p>
            </Reveal>
          ))}
        </section>

        {/* WORK */}
        <section id="work" className="px-6 py-32 md:px-10">
          <Label cmd="ls ~/projects" />
          <Reveal><h2 className="mb-16 font-display text-5xl font-bold tracking-tight md:text-8xl">Selected <span className="font-serif font-normal italic">work</span></h2></Reveal>
          <div className="border-t">
            {PROJECTS.map((p) => (
              <Reveal key={p.n}>
                <a href="#contact" className="group relative grid grid-cols-[3rem_1fr] items-baseline gap-4 overflow-hidden border-b py-10 md:grid-cols-[5rem_1fr_1fr_6rem]">
                  <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-foreground transition-transform duration-500 group-hover:scale-y-100" />
                  <span className="text-xs text-muted-foreground group-hover:text-background">{p.n}</span>
                  <span className="font-display text-4xl font-extrabold uppercase tracking-tight transition-all duration-500 group-hover:translate-x-4 group-hover:text-background md:text-6xl">{p.name}</span>
                  <span className="col-start-2 text-sm text-muted-foreground group-hover:text-background md:col-start-auto">
                    {p.desc}
                    <span className="mt-3 flex flex-wrap gap-2">{p.tags.map((t) => <span key={t} className="border px-2 py-0.5 text-[10px] uppercase group-hover:border-background">{t}</span>)}</span>
                  </span>
                  <span className="hidden text-right text-xs group-hover:text-background md:block">{p.year} ↗</span>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HISTORY + STACK */}
        <section id="stack" className="grid gap-20 border-t px-6 py-32 md:grid-cols-2 md:px-10">
          <div>
            <Label cmd="history" />
            {[["2025 — now", "Full Stack Developer", "Production apps with Next.js 15, TypeScript and TanStack Query. Architecture and performance first.", "Freelance"], ["ongoing", "Computer Science", "DSA, systems design, operating systems, competitive programming. Heavy C++ focus.", "Student"]].map(([d, t, s, r], i) => (
              <Reveal key={t} delay={i * 100} className="relative border-l py-6 pl-8">
                <span className="absolute -left-[5px] top-8 h-2.5 w-2.5 rounded-full bg-foreground" />
                <div className="text-xs text-muted-foreground">{d} · {r}</div>
                <div className="mt-2 font-display text-3xl font-bold">{t}</div>
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
        <section id="music" className="border-t px-6 py-32 md:px-10">
          <Label cmd="afplay --now-playing" />
          <Reveal><h2 className="mb-16 font-display text-5xl font-bold tracking-tight md:text-8xl">On <span className="font-serif font-normal italic">repeat</span></h2></Reveal>
          <Reveal><OnRepeat /></Reveal>
        </section>

        {/* CONTACT */}
        <section id="contact" className="border-t px-6 py-32 md:px-10">
          <Label cmd="contact --send" />
          <Reveal>
            <h2 className="font-display text-[13vw] font-extrabold uppercase leading-[0.85] tracking-tighter md:text-[9vw]">
              Let's build<br /><span className="font-serif font-normal normal-case italic">something</span> <span className="text-outline">hard.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div className="space-y-6 text-sm">
              <p className="max-w-md text-muted-foreground">Open to new opportunities, collaborations, and difficult problems. Drop a message — I read everything.</p>
              <a href="mailto:naitiksinghh01@gmail.com" className="block font-display text-2xl font-bold underline-offset-8 hover:underline md:text-4xl">naitiksinghh01@gmail.com</a>
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
          <span>compiled with -O3 · no bugs shipped (allegedly)</span>
          <a href="#top" className="hover:text-foreground">back to top ↑</a>
        </footer>

        <MiniPlayer />
      </div>
    </MusicProvider>
  );
}
