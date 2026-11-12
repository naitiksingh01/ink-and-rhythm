export function PreviewArt({ type }: { type: "alpha" | "system" }) {
  if (type === "alpha") {
    return (
      <svg viewBox="0 0 320 200" className="h-full w-full bg-foreground text-background" aria-hidden>
        <rect x="24" y="18" width="272" height="164" rx="12" fill="var(--background)" />
        <circle cx="40" cy="33" r="2" fill="var(--foreground)" opacity=".25" />
        <circle cx="48" cy="33" r="2" fill="var(--foreground)" opacity=".25" />
        <path d="M24 43 H296 M68 43 V182" stroke="var(--foreground)" opacity=".12" />
        <text x="84" y="66" fill="var(--foreground)" fontSize="10" fontFamily="sans-serif">Application dashboard</text>
        {[0, 1, 2].map((item) => <rect key={item} x={84 + item * 65} y="78" width="55" height="29" rx="5" fill="none" stroke="var(--foreground)" strokeOpacity=".15" />)}
        <path d="M84 151 C110 144 111 119 139 132 S181 157 201 125 S242 116 278 94" fill="none" stroke="var(--foreground)" strokeWidth="2" />
        <path d="M84 164 H278" stroke="var(--foreground)" opacity=".1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full bg-foreground text-background" aria-hidden>
      {[30, 52, 74].map((r) => <circle key={r} cx="244" cy="100" r={r} fill="none" stroke="currentColor" opacity=".14" />)}
      <text x="24" y="42" fill="currentColor" fontSize="8" fontFamily="monospace" opacity=".6">SYSTEMS / CPP</text>
      <text x="24" y="78" fill="currentColor" fontSize="9" fontFamily="monospace">template &lt;typename T&gt;</text>
      <text x="24" y="96" fill="currentColor" fontSize="9" fontFamily="monospace" opacity=".65">auto main() -&gt; int;</text>
      <text x="24" y="158" fill="currentColor" fontSize="34" fontWeight="600" fontFamily="sans-serif">C++</text>
    </svg>
  );
}

export function ProjectVisual({ type }: { type: "alpha" | "beta" | "system" }) {
  if (type === "alpha") {
    return (
      <div className="h-full w-full bg-foreground p-5 text-background sm:p-9">
        <div className="mx-auto flex h-full max-w-xl flex-col overflow-hidden rounded-xl bg-background text-foreground shadow-soft">
          <div className="flex h-8 shrink-0 items-center gap-1.5 border-b px-3">
            {[0, 1, 2].map((dot) => <span key={dot} className="h-1.5 w-1.5 rounded-full bg-foreground opacity-25" />)}
            <span className="ml-3 font-mono text-[7px] text-muted-foreground">project-alpha / overview</span>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-[52px_1fr] sm:grid-cols-[76px_1fr]">
            <div className="border-r p-3">
              <div className="mb-5 h-5 w-5 rounded-md bg-foreground" />
              {[0, 1, 2, 3].map((line) => <div key={line} className="mb-3 h-1 rounded-full bg-foreground opacity-15" style={{ width: `${75 - line * 8}%` }} />)}
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-end justify-between">
                <div><div className="font-mono text-[7px] uppercase tracking-widest text-muted-foreground">Overview</div><div className="mt-1 text-sm font-medium sm:text-base">Application dashboard</div></div>
                <div className="rounded-full border px-2 py-1 font-mono text-[6px]">LIVE</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["Activity", "Requests", "Uptime"].map((label) => (
                  <div key={label} className="rounded-lg border p-2.5">
                    <div className="font-mono text-[6px] uppercase text-muted-foreground">{label}</div>
                    <div className="mt-2 h-1.5 w-2/3 rounded-full bg-foreground opacity-70" />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex min-h-0 flex-1 items-end rounded-lg border p-3">
                <svg viewBox="0 0 360 90" className="h-20 w-full" fill="none" aria-hidden>
                  <path d="M0 72 C35 68 45 35 80 46 S135 74 165 42 S220 14 250 34 S305 62 360 12" stroke="currentColor" strokeWidth="2" />
                  <path d="M0 72 C35 68 45 35 80 46 S135 74 165 42 S220 14 250 34 S305 62 360 12 V90 H0Z" fill="currentColor" opacity=".06" />
                  {[0, 1, 2, 3].map((line) => <path key={line} d={`M0 ${line * 25} H360`} stroke="currentColor" opacity=".08" />)}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "beta") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-secondary p-5 text-foreground sm:p-9">
        <svg viewBox="0 0 640 360" className="h-full w-full" fill="none" aria-hidden>
          <path d="M105 90 L275 180 L130 280 M275 180 L470 82 M275 180 L505 265 M470 82 L505 265" stroke="currentColor" opacity=".22" strokeDasharray="4 5" />
          <path d="M105 90 L470 82 M130 280 L505 265" stroke="currentColor" opacity=".08" />
          {[[105,90],[130,280],[470,82],[505,265]].map(([x,y], i) => (
            <g key={i}><circle cx={x} cy={y} r="22" fill="var(--background)" stroke="currentColor" strokeOpacity=".2" /><circle cx={x} cy={y} r="5" fill="currentColor" opacity=".65" /></g>
          ))}
          <circle cx="275" cy="180" r="62" fill="var(--foreground)" />
          <circle cx="275" cy="180" r="49" stroke="var(--background)" strokeOpacity=".25" />
          <text x="275" y="177" textAnchor="middle" fill="var(--background)" fontSize="13" fontFamily="monospace">REAL-TIME</text>
          <text x="275" y="196" textAnchor="middle" fill="var(--background)" opacity=".6" fontSize="9" fontFamily="monospace">DATA LAYER</text>
        </svg>
        <div className="absolute left-8 top-7 rounded-full border bg-background px-3 py-1.5 font-mono text-[8px] uppercase tracking-widest">Node / Express</div>
        <div className="absolute bottom-7 right-8 rounded-lg border bg-background px-3 py-2 font-mono text-[8px] text-muted-foreground">client → api → database</div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-foreground p-6 text-background sm:p-10">
      <svg viewBox="0 0 640 360" className="absolute inset-0 h-full w-full opacity-20" fill="none" aria-hidden>
        {[42, 76, 110, 144].map((r) => <circle key={r} cx="490" cy="180" r={r} stroke="currentColor" />)}
        <path d="M0 180 H640 M490 0 V360" stroke="currentColor" opacity=".25" />
        <path d="M355 45 L625 315 M355 315 L625 45" stroke="currentColor" opacity=".15" />
      </svg>
      <div className="relative flex h-full max-w-sm flex-col justify-between font-mono">
        <div className="flex items-center justify-between text-[8px] uppercase tracking-[.2em] opacity-60"><span>systems / cpp</span><span>perf.focused</span></div>
        <div className="text-[10px] leading-6 opacity-80 sm:text-xs">
          <div><span className="opacity-50">01</span> template &lt;typename T&gt;</div>
          <div><span className="opacity-50">02</span> concept Numeric = requires(T value) {"{"}</div>
          <div><span className="opacity-50">03</span>&nbsp;&nbsp;value + value;</div>
          <div><span className="opacity-50">04</span> {"}"};</div>
          <div><span className="opacity-50">05</span></div>
          <div><span className="opacity-50">06</span> auto main() -&gt; int;</div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-4xl font-semibold tracking-tighter sm:text-5xl">C++</span>
          <span className="mb-1 rounded-full border border-current px-3 py-1 text-[8px] uppercase tracking-widest">Stealth project</span>
        </div>
      </div>
    </div>
  );
}
