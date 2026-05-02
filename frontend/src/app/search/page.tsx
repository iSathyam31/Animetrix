"use client";

import { useState } from "react";
import { searchAnime, type AnimeSearchResult } from "@/lib/api";
import AnimeCard from "@/components/anime-card";

const POPULAR_SEARCHES = ["Attack on Titan", "Demon Slayer", "One Piece", "Naruto", "Jujutsu Kaisen"];

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<AnimeSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    async function search(q?: string) {
        const term = (q ?? query).trim();
        if (!term || loading) return;
        if (q) setQuery(q);
        setLoading(true);
        setError(null);
        try {
            const data = await searchAnime(term, 18);
            setResults(data);
            setSearched(true);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Search failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">

            {/* Page header */}
            <div className="mb-12 text-center">
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-1 text-xs font-semibold tracking-widest text-emerald-300 uppercase">
                    AniList GraphQL
                </span>
                <h1 className="mt-4 font-display text-3xl font-bold tracking-widest text-slate-100">
                    Anime <span className="gradient-text">Encyclopedia</span>
                </h1>
                <p className="mt-2 text-sm text-slate-500">Search over 24,000 anime titles from the AniList database</p>
            </div>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
                <div className="flex gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && search()}
                        placeholder="Search anime titles…"
                        className="flex-1 rounded-xl border border-white/[0.06] bg-[#0e0e1a] px-5 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500/35 transition-colors"
                    />
                    <button
                        onClick={() => search()}
                        disabled={!query.trim() || loading}
                        className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 hover:shadow-[0_0_16px_rgba(52,211,153,0.25)] disabled:opacity-40 transition-all duration-200"
                    >
                        {loading ? "…" : "Search"}
                    </button>
                </div>

                {/* Popular tags */}
                {!searched && (
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                        {POPULAR_SEARCHES.map(s => (
                            <button
                                key={s}
                                onClick={() => search(s)}
                                className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3.5 py-1 text-xs text-slate-500 hover:border-emerald-500/25 hover:text-emerald-300 hover:bg-emerald-500/[0.05] transition-all duration-200"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/[0.07] px-4 py-3 text-sm text-rose-400 max-w-2xl mx-auto">
                    {error}
                </div>
            )}

            {/* Skeleton */}
            {loading && (
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-white/[0.04] bg-[#0e0e1a]">
                            <div className="aspect-[3/4] skeleton" />
                            <div className="p-3 space-y-2">
                                <div className="h-3 rounded skeleton" />
                                <div className="h-2 w-2/3 rounded skeleton" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
                <div className="mt-10">
                    <p className="text-xs text-slate-600 mb-5">
                        {results.length} results for &quot;{query}&quot;
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {results.map((anime) => (
                            <AnimeCard key={anime.mal_id} anime={anime} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty */}
            {!loading && searched && results.length === 0 && (
                <div className="mt-20 text-center text-slate-600">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-sm">No results found for &quot;{query}&quot;</p>
                    <p className="text-xs mt-1">Try a different title or check the spelling.</p>
                </div>
            )}

            {/* Initial */}
            {!searched && !loading && (
                <div className="mt-20 text-center text-slate-700">
                    <p className="text-5xl mb-5">📚</p>
                    <p className="text-sm text-slate-600">Type an anime title above and hit Search</p>
                    <p className="text-xs text-slate-700 mt-1.5">Or click one of the popular tags above</p>
                </div>
            )}
        </div>
    );
}
