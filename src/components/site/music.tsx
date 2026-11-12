import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
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
        <span key={i} className={`h-full w-[2px] bg-current ${on ? "eq-bar" : "scale-y-25"}`} style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

const Btn = ({ children, onClick, label, big }: { children: ReactNode; onClick: () => void; label: string; big?: boolean }) => (
  <button
    aria-label={label}
    onClick={onClick}
    className={`grid place-items-center rounded-full border transition hover:bg-foreground hover:text-background ${big ? "h-11 w-11 bg-foreground text-background hover:opacity-80" : "h-9 w-9"}`}
  >
    {children}
  </button>
);

export function OnRepeat() {
  const m = useMusic();
  const track = playlist[m.idx]!;
  return (
    <div className="grid gap-7 sm:grid-cols-[210px_minmax(0,1fr)] sm:gap-8">
      <div className="relative aspect-square overflow-hidden rounded-2xl border bg-secondary">
        <img src={track.cover} alt={`${track.title} cover`} className={`h-full w-full object-cover grayscale transition duration-700 ${m.playing ? "scale-105 opacity-100" : "scale-100 opacity-75"}`} />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[9px] uppercase tracking-widest">
          <span className="rounded-full bg-background px-2.5 py-1.5">{m.playing ? "Now playing" : m.loaded ? "Paused" : "Select a track"}</span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-background"><Eq on={m.playing} /></span>
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-6">
        <div>
          <div className="text-lg font-medium">{m.loaded ? track.title : "Nothing playing yet"}</div>
          <div className="mt-1 text-sm text-muted-foreground">{m.loaded ? track.artist : "Pick one of the three tracks below."}</div>
        </div>
        <div>
          <input
            aria-label="Seek through track"
            type="range"
            min={0}
            max={m.dur || 100}
            step={0.1}
            value={m.dur ? m.time : 0}
            disabled={!m.loaded}
            onChange={(event) => m.seek(Number(event.target.value) / (m.dur || 100))}
            className="h-1 w-full accent-foreground disabled:opacity-30"
          />
          <div className="mt-2 flex justify-between font-mono text-[9px] text-muted-foreground"><span>{fmt(m.time)}</span><span>{fmt(m.dur)}</span></div>
          <div className="mt-3 flex items-center gap-2.5">
            <Btn label="Previous track" onClick={m.prev}><SkipBack size={14} /></Btn>
            <Btn label={m.playing ? "Pause" : "Play"} onClick={m.toggle} big>{m.playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</Btn>
            <Btn label="Next track" onClick={m.next}><SkipForward size={14} /></Btn>
            <label className="ml-auto flex items-center gap-2 text-muted-foreground">
              <Volume2 size={14} />
              <input aria-label="Volume" type="range" min={0} max={1} step={0.01} value={m.vol} onChange={(event) => m.setVol(+event.target.value)} className="w-16 accent-foreground sm:w-20" />
            </label>
          </div>
        </div>
        <ul className="divide-y border-y">
          {playlist.map((item, i) => (
            <li key={item.title}>
              <button onClick={() => m.play(i)} className={`group flex w-full items-center gap-3 py-3 text-left transition hover:px-2 ${i === m.idx && m.loaded ? "" : "text-muted-foreground"}`}>
                <span className="w-5 font-mono text-[9px]">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-sm font-medium group-hover:text-foreground">{item.title}</span>
                <span className="text-xs">{item.artist}</span>
                {i === m.idx && m.playing && <Eq on />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function MiniPlayer() {
  const m = useMusic();
  const track = playlist[m.idx]!;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-full border bg-background/90 p-1.5 pr-3 shadow-soft backdrop-blur-xl">
      <img src={track.cover} alt="" className={`h-9 w-9 rounded-full object-cover grayscale ${m.playing ? "animate-spin-slow" : ""}`} />
      <div className="hidden w-28 text-[11px] sm:block">
        <div className="truncate font-medium">{m.loaded ? track.title : "Music is off"}</div>
        <div className="truncate text-muted-foreground">{m.loaded ? track.artist : "Tap to listen"}</div>
      </div>
      <button aria-label={m.playing ? "Pause music" : "Play music"} onClick={m.toggle} className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background transition hover:opacity-80">
        {m.playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
      </button>
      <Eq on={m.playing} className="mr-1" />
    </div>
  );
}
