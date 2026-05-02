import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STATS = [
  { label: "Anime Titles",   value: "24,000+", icon: "📚" },
  { label: "AI Detections",  value: "Instant",  icon: "⚡" },
  { label: "Recommendations",value: "Infinite", icon: "✨" },
];

const BENTO_FEATURES = [
  {
    href: "/chat",
    icon: "💬",
    title: "Chibi Chat",
    badge: "AI Powered",
    description: "Describe your mood or favorite genres. Chibi curates personalized anime picks just for you.",
    colSpan: "md:col-span-2 lg:col-span-2",
    bg: "bg-indigo-500/5 hover:bg-indigo-500/10",
    border: "border-indigo-500/20 hover:border-indigo-500/40",
    text: "text-indigo-400",
  },
  {
    href: "/detect",
    icon: "🔍",
    title: "Vision Detect",
    badge: "Gemini AI",
    description: "Upload an image. We'll identify the character and the show they belong to in seconds.",
    colSpan: "md:col-span-1 lg:col-span-1",
    bg: "bg-violet-500/5 hover:bg-violet-500/10",
    border: "border-violet-500/20 hover:border-violet-500/40",
    text: "text-violet-400",
  },
  {
    href: "/compare",
    icon: "⚔️",
    title: "Anime Battle",
    badge: "Head-to-head",
    description: "Pit two shows against each other across story, animation, and characters to find the ultimate winner.",
    colSpan: "md:col-span-1 lg:col-span-1",
    bg: "bg-rose-500/5 hover:bg-rose-500/10",
    border: "border-rose-500/20 hover:border-rose-500/40",
    text: "text-rose-400",
  },
  {
    href: "/search",
    icon: "📚",
    title: "Encyclopedia",
    badge: "Jikan Database",
    description: "Search our massive database of over 24,000 anime titles, complete with scores, trailers, and cast details.",
    colSpan: "md:col-span-2 lg:col-span-2",
    bg: "bg-emerald-500/5 hover:bg-emerald-500/10",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    text: "text-emerald-400",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] overflow-x-hidden relative">

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015] z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col gap-16">
        
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="flex flex-col items-center text-center gap-6">
          <span className="fade-up rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Your Anime Intelligence Hub
          </span>

          <h1 className="fade-up-delay-1 font-display text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-100 leading-none">
            ANIMETRIX
          </h1>

          <p className="fade-up-delay-2 max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed mt-2">
            An all-in-one AI companion. Get personalized recommendations, detect characters from screenshots, compare shows, and explore the universe.
          </p>
        </section>

        {/* ── BENTO BOX FEATURES ──────────────────────────────────────────── */}
        <section className="fade-up-delay-3 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BENTO_FEATURES.map((feature, idx) => (
              <Link
                key={feature.href}
                href={feature.href}
                className={`group flex flex-col justify-between rounded-3xl border ${feature.border} ${feature.bg} ${feature.colSpan} p-8 transition-all duration-300 hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className={`text-4xl ${feature.text}`}>{feature.icon}</div>
                    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      {feature.badge}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-xl font-bold text-slate-100 mb-2 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">
                  Try it out
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── STATS BAR ────────────────────────────────────────────────────── */}
        <section className="fade-up-delay-4 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map(({ label, value, icon }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/[0.04] bg-[#0e0e1a]/50 px-6 py-5 backdrop-blur-sm">
                <span className="text-2xl">{icon}</span>
                <div className="flex flex-col">
                  <span className="font-display text-xl font-bold text-slate-100">{value}</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.04] py-8 text-center bg-[#07070f]">
        <p className="text-xs font-medium tracking-wide text-slate-600 uppercase">
          © {new Date().getFullYear()} Animetrix · Built with Next.js & FastAPI
        </p>
      </footer>
    </div>
  );
}
