import Link from "next/link";

const FEATURES = [
  {
    href: "/chat",
    icon: "💬",
    title: "Chibi Chat",
    badge: "Powered by AI",
    description:
      "Describe your mood, favourite genres, or a show you loved — Chibi remembers your taste and curates personalised anime picks just for you.",
    color: "indigo",
    cta: "Start Chatting",
  },
  {
    href: "/detect",
    icon: "🔍",
    title: "Character Detect",
    badge: "Vision AI",
    description:
      "Upload any anime screenshot or fan-art. Our Gemini Vision model identifies the character, their show, visual traits and lore in seconds.",
    color: "violet",
    cta: "Try Detection",
  },
  {
    href: "/compare",
    icon: "⚔️",
    title: "Anime Battle",
    badge: "Head-to-Head",
    description:
      "Pit two anime against each other across story, animation, characters, and sound. Get a detailed AI verdict on the ultimate winner.",
    color: "rose",
    cta: "Start Battle",
  },
  {
    href: "/search",
    icon: "📚",
    title: "Encyclopedia",
    badge: "Jikan · AniList",
    description:
      "Search the entire anime catalogue. Browse detailed pages with genres, cast, staff, scores, and community recommendations.",
    color: "emerald",
    cta: "Explore Anime",
  },
];

const ACCENT: Record<string, { border: string; badge: string; cta: string; glow: string }> = {
  indigo:  {
    border: "hover:border-indigo-500/40",
    badge:  "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    cta:    "text-indigo-400 group-hover:text-indigo-300",
    glow:   "group-hover:shadow-[0_4px_24px_rgba(99,102,241,0.14)]",
  },
  violet:  {
    border: "hover:border-violet-500/40",
    badge:  "bg-violet-500/10 text-violet-300 border-violet-500/20",
    cta:    "text-violet-400 group-hover:text-violet-300",
    glow:   "group-hover:shadow-[0_4px_24px_rgba(167,139,250,0.14)]",
  },
  rose:    {
    border: "hover:border-rose-500/40",
    badge:  "bg-rose-500/10 text-rose-300 border-rose-500/20",
    cta:    "text-rose-400 group-hover:text-rose-300",
    glow:   "group-hover:shadow-[0_4px_24px_rgba(248,113,113,0.12)]",
  },
  emerald: {
    border: "hover:border-emerald-500/40",
    badge:  "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    cta:    "text-emerald-400 group-hover:text-emerald-300",
    glow:   "group-hover:shadow-[0_4px_24px_rgba(52,211,153,0.12)]",
  },
};

const STATS = [
  { label: "Anime Titles",   value: "24,000+", icon: "📺" },
  { label: "AI Detections",  value: "Instant",  icon: "⚡" },
  { label: "Recommendations",value: "Infinite", icon: "✨" },
  { label: "Active Users",   value: "Growing",  icon: "🌐" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 text-center">

        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/[0.07] blur-[110px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/[0.06] blur-[90px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-indigo-600/[0.04] blur-[80px]" />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(129,140,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-7 max-w-4xl">

          {/* Badge */}
          <span className="fade-up rounded-full border border-indigo-500/20 bg-indigo-500/[0.08] px-5 py-1.5 text-xs font-semibold tracking-widest text-indigo-300 uppercase">
            AI-Powered Anime Intelligence
          </span>

          {/* Welcome line */}
          <p className="fade-up-delay-1 text-sm font-medium text-slate-500 tracking-wider uppercase">
            Welcome To
          </p>

          {/* Main title */}
          <h1 className="fade-up-delay-1 font-display text-6xl font-black tracking-widest sm:text-7xl lg:text-8xl gradient-text text-glow leading-none">
            ANIMETRIX
          </h1>

          {/* Subtitle */}
          <p className="fade-up-delay-2 max-w-2xl text-base text-slate-400 sm:text-lg leading-relaxed">
            Your all-in-one AI anime companion. Get personalised recommendations, identify anime characters from images, compare shows head-to-head, and explore the full anime universe.
          </p>

          {/* CTAs */}
          <div className="fade-up-delay-3 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/chat"
              className="rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_28px_rgba(99,102,241,0.4)] hover:-translate-y-0.5"
            >
              Talk to Chibi →
            </Link>
            <Link
              href="/search"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-8 py-3.5 text-sm font-bold text-slate-300 transition-all duration-300 hover:bg-white/[0.07] hover:text-slate-100 hover:-translate-y-0.5"
            >
              Explore Anime
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="fade-up-delay-4 flex flex-col items-center gap-2 mt-4">
            <span className="text-xs text-slate-600">Scroll to explore features</span>
            <div className="h-8 w-px bg-gradient-to-b from-indigo-500/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.04] bg-white/[0.02]">
        <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.04]">
          {STATS.map(({ label, value, icon }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 px-6 py-8">
              <span className="text-2xl">{icon}</span>
              <span className="font-display text-xl font-bold text-slate-100">{value}</span>
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES SECTION ──────────────────────────────────────────────────── */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-28 sm:px-6">

        {/* Section header */}
        <div className="mb-16 text-center">
          <span className="rounded-full border border-indigo-500/20 bg-indigo-500/[0.08] px-4 py-1 text-xs font-semibold tracking-widest text-indigo-300 uppercase">
            Everything You Need
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-wider text-slate-100 sm:text-4xl">
            Four Powerful Modules
          </h2>
          <p className="mt-3 text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Built on the latest AI models — from Gemini Vision to GPT-4.1 — Animetrix brings the smartest anime tools into one seamless platform.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const a = ACCENT[f.color];
            return (
              <Link
                key={f.href}
                href={f.href}
                className={`group flex flex-col gap-5 rounded-2xl border border-[#1e1e38] bg-[#0e0e1a] p-6 card-hover ${a.border} ${a.glow}`}
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{f.icon}</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${a.badge}`}>
                    {f.badge}
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="font-display text-sm font-bold tracking-wider text-slate-100 group-hover:text-white transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                {/* CTA */}
                <span className={`text-xs font-semibold transition-colors flex items-center gap-1 ${a.cta}`}>
                  {f.cta}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.04] bg-[#0a0a16]">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 text-center">
          <span className="rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-4 py-1 text-xs font-semibold tracking-widest text-violet-300 uppercase">
            How It Works
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-wider text-slate-100">
            Simple, Fast, Intelligent
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "Ask or Upload", body: "Type a question to Chibi or drop an image into the Character Detector. No setup required." },
              { step: "02", title: "AI Processes", body: "State-of-the-art models from Google and Azure analyse your request in real time." },
              { step: "03", title: "Get Results", body: "Receive rich, detailed answers — recommendations, character profiles, comparisons, and more." },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex flex-col items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/[0.08]">
                  <span className="font-display text-sm font-bold text-indigo-400">{step}</span>
                </div>
                <h3 className="font-display text-sm font-bold tracking-wider text-slate-200">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/[0.04]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/[0.08] to-transparent" />
        </div>
        <div className="relative mx-auto max-w-2xl px-4 py-24 sm:px-6 text-center flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl font-bold tracking-wider text-slate-100 sm:text-4xl">
            Ready to Dive In?
          </h2>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed">
            Start your AI anime journey today — no account needed.
          </p>
          <Link
            href="/chat"
            className="rounded-xl bg-indigo-600 px-10 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_32px_rgba(99,102,241,0.4)] hover:-translate-y-0.5"
          >
            Talk to Chibi, Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-6 text-center">
        <p className="text-xs text-slate-600">
          © 2025 Animetrix · Built with Next.js, FastAPI & Google Gemini
        </p>
      </footer>

    </div>
  );
}
