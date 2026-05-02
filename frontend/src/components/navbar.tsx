"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sparkles, Info } from "lucide-react";
import InfoModal from "./info-modal";

const NAV_LINKS = [
    { href: "/chat",    label: "Chat",     emoji: "💬" },
    { href: "/detect",  label: "Detect",   emoji: "🔍" },
    { href: "/compare", label: "Compare",  emoji: "⚔️" },
    { href: "/search",  label: "Search",   emoji: "📚" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#07070f]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group"
                >
                    <div className="relative flex h-7 w-7 items-center justify-center">
                        <div className="absolute inset-0 rounded-lg bg-indigo-500/20 blur-sm group-hover:bg-indigo-500/30 transition-all duration-300" />
                        <Sparkles className="relative h-4 w-4 text-indigo-400" />
                    </div>
                    <span className="font-display text-base font-bold tracking-widest text-slate-100 group-hover:text-indigo-300 transition-colors duration-200">
                        ANIMETRIX
                    </span>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href || pathname.startsWith(href + "/");
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    active
                                        ? "text-indigo-300 bg-indigo-500/10"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                                }`}
                            >
                                {label}
                                {active && (
                                    <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-indigo-500/0 via-indigo-400 to-indigo-500/0" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={() => setInfoOpen(true)}
                        className="rounded-lg bg-white/[0.04] px-4 py-1.5 text-sm font-semibold text-slate-200 hover:bg-white/[0.08] transition-all duration-200 flex items-center gap-2 border border-white/[0.04]"
                    >
                        <Info className="w-4 h-4 text-slate-400" />
                        How to use
                    </button>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-slate-400 hover:text-slate-200 transition-colors p-1"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <div className="md:hidden border-t border-white/[0.04] bg-[#0e0e1a]/95 backdrop-blur-xl px-4 pb-5 pt-3 space-y-1">
                    {NAV_LINKS.map(({ href, label, emoji }) => {
                        const active = pathname === href || pathname.startsWith(href + "/");
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                    active
                                        ? "text-indigo-300 bg-indigo-500/10"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                                }`}
                            >
                                <span>{emoji}</span>
                                {label}
                            </Link>
                        );
                    })}
                    <div className="pt-2 border-t border-white/[0.04]">
                        <button
                            onClick={() => { setInfoOpen(true); setOpen(false); }}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/[0.08] transition-colors border border-white/[0.04]"
                        >
                            <Info className="w-4 h-4 text-slate-400" />
                            How to use
                        </button>
                    </div>
                </div>
            )}

            <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
        </nav>
    );
}
