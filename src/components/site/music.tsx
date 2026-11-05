import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import t1 from "@/assets/music/track01.mp3.asset.json";
import t2 from "@/assets/music/track02.mp3.asset.json";
import t3 from "@/assets/music/track03.mp3.asset.json";
import cover from "@/assets/music/cover01.jpg";

export const playlist = [
  { title: "Track 01", artist: "Tame Impala", src: t1.url, cover },
  { title: "Track 02", artist: "Satinder Sartaaj", src: t2.url, cover },
  { title: "Track 03", artist: "Drake", src: t3.url, cover },
];

type Ctx = {
  idx: number; playing: boolean; time: number; dur: number; vol: number;
  play: (i?: number) => void; toggle: () => void; next: () => void; prev: () => void;
  seek: (p: number) => void; setVol: (v: number) => void; loaded: boolean;
};
const MusicCtx = createContext<Ctx | null>(null);
export const useMusic = () => useContext(MusicCtx)!;

export const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

export function MusicProvider({ children }: { children: ReactNode }) {
  const a = useRef<HTMLAudioElement>(null);
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVolS] = useState(0.8);

  const play = (i?: number) => {
    const el = a.current!;
    if (i !== undefined && (i !== idx || !loaded)) {
      setIdx(i); setLoaded(true);
      el.src = playlist[i]!.src;
    } else if (!loaded) {
      setLoaded(true); el.src = playlist[idx]!.src;
    }
    el.play().catch(() => {});
  };
  const toggle = () => (playing ? a.current!.pause() : play());
  const next = () => play((idx + 1) % playlist.length);
  const prev = () => play((idx - 1 + playlist.length) % playlist.length);
  const seek = (p: number) => { if (a.current && dur) a.current.currentTime = p * dur; };
  const setVol = (v: number) => { setVolS(v); if (a.current) a.current.volume = v; };

  useEffect(() => {
    const el = a.current!;
    el.volume = vol;
    const on = () => setPlaying(true), off = () => setPlaying(false);
    const tu = () => setTime(el.currentTime), dm = () => setDur(el.duration);
    const end = () => next();
    el.addEventListener("play", on); el.addEventListener("pause", off);
    el.addEventListener("timeupdate", tu); el.addEventListener("loadedmetadata", dm); el.addEventListener("ended", end);
    return () => {
      el.removeEventListener("play", on); el.removeEventListener("pause", off);
      el.removeEventListener("timeupdate", tu); el.removeEventListener("loadedmetadata", dm); el.removeEventListener("ended", end);
    };
  });

  return (
    <MusicCtx.Provider value={{ idx, playing, time, dur, vol, play, toggle, next, prev, seek, setVol, loaded }}>
      <audio ref={a} preload="none" />
      {children}
    </MusicCtx.Provider>
  );
}

export function Eq({ on, className = "" }: { on: boolean; className?: string }) {
  return (
    <span className={`inline-flex h-3 items-end gap-[2px] ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`w-[2px] h-full bg-current ${on ? "eq-bar" : "scale-y-25"}`} style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

function Bar() {
  const m = useMusic();
  return (
    <div
      className="group relative h-1 w-full bg-accent"
      data-hover
      onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); m.seek((e.clientX - r.left) / r.width); }}
    >
      <div className="h-full bg-foreground" style={{ width: `${m.dur ? (m.time / m.dur) * 100 : 0}%` }} />
    </div>
  );
}

const Btn = ({ children, onClick, label, big }: { children: ReactNode; onClick: () => void; label: string; big?: boolean }) => (
  <button
    aria-label={label}
    onClick={onClick}
    className={`grid place-items-center rounded-full border transition hover:bg-foreground hover:text-background ${big ? "h-14 w-14 bg-foreground text-background" : "h-10 w-10"}`}
  >
    {children}
  </button>
);

export function OnRepeat() {
  const m = useMusic();
  const t = playlist[m.idx]!;
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,420px)_1fr]">
      <div className="relative aspect-square overflow-hidden border">
        <img src={t.cover} alt={`${t.title} cover`} className={`h-full w-full object-cover grayscale transition duration-700 ${m.playing ? "scale-105" : "scale-100 opacity-70"}`} />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs uppercase tracking-widest">
          <span className="bg-background px-2 py-1">{m.playing ? "now playing" : m.loaded ? "paused" : "idle"}</span>
          <span className="bg-background px-2 py-1"><Eq on={m.playing} /></span>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-8">
        <div>
          <div className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">{m.loaded ? t.title : "No track loaded"}</div>
          <div className="mt-2 font-serif text-xl italic text-muted-foreground">{m.loaded ? t.artist : "Click a track below to start"}</div>
        </div>
        <div className="space-y-3">
          <Bar />
          <div className="flex justify-between text-xs text-muted-foreground"><span>{fmt(m.time)}</span><span>{fmt(m.dur)}</span></div>
          <div className="flex items-center gap-3">
            <Btn label="Previous" onClick={m.prev}>⏮</Btn>
            <Btn label={m.playing ? "Pause" : "Play"} onClick={m.toggle} big>{m.playing ? "❚❚" : "▶"}</Btn>
            <Btn label="Next" onClick={m.next}>⏭</Btn>
            <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              vol
              <input type="range" min={0} max={1} step={0.01} value={m.vol} onChange={(e) => m.setVol(+e.target.value)} className="w-24 accent-foreground" />
            </label>
          </div>
        </div>
        <ul className="divide-y border-y">
          {playlist.map((p, i) => (
            <li key={p.title}>
              <button onClick={() => play(i)} className={`group flex w-full items-center gap-4 py-4 text-left transition hover:pl-3 ${i === m.idx && m.loaded ? "" : "text-muted-foreground"}`}>
                <span className="w-8 text-xs">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 font-display text-xl font-bold group-hover:text-foreground">{p.title}</span>
                <span className="font-serif italic">{p.artist}</span>
                {i === m.idx && m.playing && <Eq on />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  function play(i: number) { m.play(i); }
}

export function MiniPlayer() {
  const m = useMusic();
  const t = playlist[m.idx]!;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 border bg-background/80 p-2 pr-4 backdrop-blur-md">
      <img src={t.cover} alt="" className={`h-10 w-10 rounded-full object-cover grayscale ${m.playing ? "animate-spin-slow" : ""}`} />
      <div className="hidden w-32 text-xs sm:block">
        <div className="truncate">{m.loaded ? t.title : "sound off"}</div>
        <div className="truncate text-muted-foreground">{m.loaded ? t.artist : "tap to play"}</div>
      </div>
      <button aria-label={m.playing ? "Pause music" : "Play music"} onClick={m.toggle} className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-xs text-background">
        {m.playing ? "❚❚" : "▶"}
      </button>
      <Eq on={m.playing} />
    </div>
  );
}
