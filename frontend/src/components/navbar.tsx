"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const NAV_LINKS = [
    { href: "/chat", label: "Chat" },
    { href: "/detect", label: "Detect" },
    { href: "/compare", label: "Compare" },
    { href: "/search", label: "Search" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 font-display text-lg font-bold tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                    <Zap className="h-5 w-5" />
                    ANIMETRIX
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href || pathname.startsWith(href + "/");
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`relative px-4 py-1.5 text-sm font-medium transition-colors rounded-md ${active
                                        ? "text-cyan-400"
                                        : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                {label}
                                {active && (
                                    <span className="absolute inset-x-2 -bottom-px h-px bg-cyan-400 shadow-[0_0_8px_1px_rgba(0,212,255,0.6)]" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <div className="md:hidden border-t border-white/5 bg-[#0a0a0f]/95 px-4 pb-4 pt-2">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href || pathname.startsWith(href + "/");
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`block py-2.5 text-sm font-medium transition-colors ${active ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </nav>
    );
}
