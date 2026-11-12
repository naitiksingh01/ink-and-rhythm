import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Asterisk, MapPin } from "lucide-react";
import { Intro, Reveal } from "@/components/site/fx";
import { MiniPlayer, MusicProvider, OnRepeat, useMusic } from "@/components/site/music";
import { AmbientShapes, CommandMenu, CopyEmail, InlinePreview, ThemeToggle } from "@/components/site/advanced";
import { PreviewArt, ProjectVisual } from "@/components/site/project-visual";

function QuickMenu() {
  const music = useMusic();
  return <CommandMenu onToggleMusic={music.toggle} />;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Naitik Singh — Full-stack developer" },
      { name: "description", content: "Portfolio of Naitik Singh Bhadoriya, a Computer Science student and full-stack developer from Indore, India." },
      { property: "og:title", content: "Naitik Singh — Full-stack developer" },
      { property: "og:description", content: "Web applications, systems work and selected projects by Naitik Singh Bhadoriya." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [["Work", "#work"], ["About", "#about"], ["Music", "#music"], ["Contact", "#contact"]];
const STACK = ["React", "Next.js", "TypeScript", "C++", "Node.js", "Express", "TanStack Query", "Tailwind CSS", "Python"];
const PROJECTS = [
  {
    name: "Project Alpha",
    type: "alpha" as const,
    year: "2026",
    description: "A full-stack web application in active development, with a focus on clear architecture and a simple interface.",
    tags: ["Next.js", "TypeScript", "TanStack"],
  },
  {
    name: "Project Beta",
    type: "beta" as const,
    year: "2025",
    description: "A backend-focused project exploring real-time data, application performance and reliable data flow.",
    tags: ["React", "Node.js", "Express"],
  },
  {
    name: "System Project",
    type: "system" as const,
    year: "Stealth",
    description: "Performance-focused C++ work. The details are private for now.",
    tags: ["C++", "Systems", "Algorithms"],
  },
];

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);
  return <span suppressHydrationWarning>{time || "--:--"}</span>;
}

function Index() {
  const [ready, setReady] = useState(false);

  return (
    <MusicProvider>
      <div className="grain min-h-screen overflow-x-hidden bg-background text-foreground">
        {!ready && <Intro onDone={() => setReady(true)} />}
        <AmbientShapes />

        <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[880px] items-center justify-between px-5 sm:px-6">
            <a href="#top" aria-label="Back to top" className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-secondary">
              <Asterisk size={27} strokeWidth={1.8} />
            </a>
            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-sm md:flex" aria-label="Main navigation">
              {NAV.map(([label, href]) => (
                <a key={label} href={href} className="text-muted-foreground transition hover:text-foreground">{label}</a>
              ))}
            </nav>
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <QuickMenu />
            </div>
          </div>
        </header>

        <main id="main-content" className="mx-auto max-w-[720px] px-5 sm:px-6">
          <section id="top" className="pb-16 pt-36 sm:pt-44">
            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h1 className="font-hand text-6xl leading-[.9] tracking-tight sm:text-7xl">naitik singh</h1>
                  <p className="mt-4 text-sm text-muted-foreground">Full-stack developer · Indore, India</p>
                </div>
                <div className="mb-1 hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" /> Available for work
                </div>
              </div>
            </Reveal>

            <Reveal delay={100} className="mt-10 space-y-5 text-[17px] leading-[1.75] tracking-[-0.01em]">
              <p>Hey, I’m Naitik. I’m a Computer Science student and full-stack developer from Indore, India.</p>
              <p>
                I build{" "}
                <InlinePreview href="#work" preview={<PreviewArt type="alpha" />}>web applications</InlinePreview>{" "}
                with React, Next.js and TypeScript. I also use{" "}
                <InlinePreview href="#work" preview={<PreviewArt type="system" />}>C++</InlinePreview>{" "}
                for data structures, algorithms and performance-focused work.
              </p>
              <p>
                I care about simple interfaces, readable code and software that feels fast. Away from the editor, there’s usually{" "}
                <a href="#music" className="underline decoration-border underline-offset-4 transition hover:decoration-foreground">music playing</a>.
              </p>
              <p className="text-muted-foreground">Here’s some of what I’ve been working on.</p>
            </Reveal>
          </section>

          <section id="work" aria-labelledby="work-title" className="py-14">
            <Reveal>
              <div className="mb-7 flex items-center justify-between">
                <h2 id="work-title" className="text-xl font-medium tracking-tight">Selected work</h2>
                <span className="text-sm text-muted-foreground">3 projects</span>
              </div>
            </Reveal>
            <div className="space-y-14">
              {PROJECTS.map((project, index) => (
                <Reveal key={project.name} delay={index * 60}>
                  <article className="group">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-base font-medium">{project.name}</h3>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{project.year}</span>
                    </div>
                    <div className="aspect-[16/10] overflow-hidden rounded-2xl border bg-secondary">
                      <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.018]">
                        <ProjectVisual type={project.type} />
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{project.description}</p>
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2" aria-label={`${project.name} technologies`}>
                      {project.tags.map((tag) => <li key={tag} className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{tag}</li>)}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="about" aria-labelledby="about-title" className="border-t py-16">
            <Reveal>
              <h2 id="about-title" className="text-xl font-medium tracking-tight">About</h2>
              <div className="mt-6 space-y-5 text-[16px] leading-7 text-muted-foreground">
                <p>I’m studying Computer Science and building web projects alongside my coursework. Most of my work sits between product interfaces and the systems behind them.</p>
                <p>I’m open to freelance projects, internships and collaborations.</p>
              </div>
              <div className="mt-8">
                <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Tools I work with</h3>
                <ul className="flex flex-wrap gap-2">
                  {STACK.map((item) => <li key={item} className="rounded-full border px-3 py-1.5 text-xs">{item}</li>)}
                </ul>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} /> Indore, India <span className="mx-1">·</span> <Clock /> IST
              </div>
            </Reveal>
          </section>

          <section id="music" aria-labelledby="music-title" className="border-t py-16">
            <Reveal>
              <div className="mb-8">
                <h2 id="music-title" className="text-xl font-medium tracking-tight">On repeat</h2>
                <p className="mt-2 text-sm text-muted-foreground">Three tracks I keep coming back to.</p>
              </div>
              <OnRepeat />
            </Reveal>
          </section>

          <section id="contact" aria-labelledby="contact-title" className="border-t py-20">
            <Reveal>
              <h2 id="contact-title" className="text-2xl font-medium tracking-tight">Get in touch</h2>
              <p className="mt-3 max-w-md text-[15px] leading-6 text-muted-foreground">Have a project, internship or collaboration in mind? Send me an email.</p>
              <div className="mt-7 flex flex-col items-start gap-4">
                <a href="mailto:naitiksinghh01@gmail.com" className="group inline-flex items-center gap-2 text-lg font-medium underline decoration-border underline-offset-8 transition hover:decoration-foreground">
                  naitiksinghh01@gmail.com <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <CopyEmail />
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="mx-auto flex max-w-[720px] flex-wrap items-center justify-between gap-3 border-t px-5 py-7 text-xs text-muted-foreground sm:px-6">
          <span>© 2026 Naitik Singh Bhadoriya</span>
          <a href="#top" className="transition hover:text-foreground">Back to top ↑</a>
        </footer>

        <MiniPlayer />
      </div>
    </MusicProvider>
  );
}
