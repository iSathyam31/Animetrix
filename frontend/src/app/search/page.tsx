"use client";

import { useState } from "react";
import { searchAnime, type AnimeSearchResult } from "@/lib/api";
import AnimeCard from "@/components/anime-card";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<AnimeSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    async function search() {
        const q = query.trim();
        if (!q || loading) return;
        setLoading(true);
        setError(null);
        try {
            const data = await searchAnime(q, 18);
            setResults(data);
            setSearched(true);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Search failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="font-display text-3xl font-bold tracking-widest gradient-text">ANIME ENCYCLOPEDIA</h1>
                <p className="mt-2 text-sm text-slate-500">Search over 20,000 anime titles from MyAnimeList</p>
            </div>

            {/* Search bar */}
            <div className="flex gap-3 max-w-2xl mx-auto">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                    placeholder="Search anime titles..."
                    className="flex-1 rounded-xl border border-[#2a2a3d] bg-[#12121a] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-colors"
                />
                <button
                    onClick={search}
                    disabled={!query.trim() || loading}
                    className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-black hover:bg-cyan-400 disabled:opacity-40 transition-all"
                >
                    {loading ? "..." : "Search"}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400 max-w-2xl mx-auto">
                    {error}
                </div>
            )}

            {/* Skeleton */}
            {loading && (
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="animate-pulse rounded-xl overflow-hidden border border-[#2a2a3d] bg-[#12121a]">
                            <div className="aspect-[3/4] bg-[#1a1a28]" />
                            <div className="p-3 space-y-2">
                                <div className="h-3 rounded bg-[#2a2a3d]" />
                                <div className="h-2 w-2/3 rounded bg-[#2a2a3d]" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
                <div className="mt-10">
                    <p className="text-xs text-slate-500 mb-4">{results.length} results for &quot;{query}&quot;</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {results.map((anime) => (
                            <AnimeCard key={anime.mal_id} anime={anime} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loading && searched && results.length === 0 && (
                <div className="mt-20 text-center text-slate-500">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-sm">No results found for &quot;{query}&quot;</p>
                    <p className="text-xs mt-1">Try a different title or check the spelling.</p>
                </div>
            )}

            {/* Initial state */}
            {!searched && !loading && (
                <div className="mt-20 text-center text-slate-600">
                    <p className="text-4xl mb-4">📚</p>
                    <p className="text-sm">Type an anime title and press Search</p>
                </div>
            )}
        </div>
    );
}
