import Link from "next/link";

const FEATURES = [
  {
    href: "/chat",
    icon: "💬",
    title: "Chibi Chat",
    description: "AI-powered anime recommendation chatbot with memory. Describe your mood and get personalised picks.",
    color: "cyan",
  },
  {
    href: "/detect",
    icon: "🔍",
    title: "Character Detect",
    description: "Upload any anime image and instantly identify the character, their show, and visual traits.",
    color: "purple",
  },
  {
    href: "/compare",
    icon: "⚔️",
    title: "Anime Battle",
    description: "Pit two anime head-to-head across story, animation, characters and more. Get an AI verdict.",
    color: "rose",
  },
  {
    href: "/search",
    icon: "📚",
    title: "Encyclopedia",
    description: "Search the entire anime catalogue. Detailed pages with cast, staff, and recommendations.",
    color: "emerald",
  },
];

const BORDER_COLORS: Record<string, string> = {
  cyan: "hover:border-cyan-500/60 hover:shadow-[0_0_24px_rgba(0,212,255,0.18)]",
  purple: "hover:border-purple-500/60 hover:shadow-[0_0_24px_rgba(168,85,247,0.18)]",
  rose: "hover:border-rose-500/60 hover:shadow-[0_0_24px_rgba(255,107,107,0.18)]",
  emerald: "hover:border-emerald-500/60 hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
          {/* Eyebrow */}
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold tracking-widest text-cyan-400 uppercase">
            AI-Powered Anime Intelligence
          </span>

          {/* Title */}
          <h1 className="font-display text-5xl font-black tracking-widest sm:text-7xl lg:text-8xl gradient-text">
            ANIMETRIX
          </h1>

          {/* Tagline */}
          <p className="max-w-xl text-base text-slate-400 sm:text-lg leading-relaxed">
            Recommendations, character identification, head-to-head comparisons,
            and a full anime encyclopedia — all powered by AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link
              href="/chat"
              className="rounded-lg bg-cyan-500 px-7 py-3 text-sm font-bold text-black transition-all hover:bg-cyan-400 hover:shadow-[0_0_24px_rgba(0,212,255,0.5)]"
            >
              Talk to Chibi
            </Link>
            <Link
              href="/search"
              className="rounded-lg border border-[#2a2a3d] bg-[#12121a] px-7 py-3 text-sm font-bold text-slate-200 transition-all hover:border-cyan-500/40 hover:text-cyan-300"
            >
              Explore Anime
            </Link>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <h2 className="mb-10 text-center font-display text-2xl font-bold tracking-widest text-slate-300">
          WHAT CAN YOU DO?
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`group flex flex-col gap-4 rounded-xl border border-[#2a2a3d] bg-[#12121a] p-6 transition-all duration-300 hover:-translate-y-1 ${BORDER_COLORS[f.color]}`}
            >
              <span className="text-4xl">{f.icon}</span>
              <div>
                <h3 className="font-display text-sm font-bold tracking-wider text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
              <span className="mt-auto text-xs font-semibold text-slate-500 group-hover:text-cyan-400 transition-colors">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
