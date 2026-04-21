"use client";

import { useState } from "react";
import Image from "next/image";
import { compareAnime, type AnimeComparisonResult } from "@/lib/api";
import DimensionBar from "@/components/dimension-bar";

const DIMENSIONS = ["story", "animation", "characters", "emotional_impact", "rewatchability"] as const;

export default function ComparePage() {
    const [subjectA, setSubjectA] = useState("");
    const [subjectB, setSubjectB] = useState("");
    const [result, setResult] = useState<AnimeComparisonResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function compare() {
        const a = subjectA.trim();
        const b = subjectB.trim();
        if (!a || !b || loading) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await compareAnime(a, b);
            setResult(res);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Comparison failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="font-display text-3xl font-bold tracking-widest gradient-text">ANIME BATTLE</h1>
                <p className="mt-2 text-sm text-slate-500">Pit two anime head-to-head for an AI verdict</p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                    value={subjectA}
                    onChange={(e) => setSubjectA(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && compare()}
                    placeholder="First anime..."
                    className="flex-1 w-full rounded-xl border border-[#2a2a3d] bg-[#12121a] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-colors"
                />
                <div className="font-display text-xl font-black text-slate-500 shrink-0 px-2">VS</div>
                <input
                    value={subjectB}
                    onChange={(e) => setSubjectB(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && compare()}
                    placeholder="Second anime..."
                    className="flex-1 w-full rounded-xl border border-[#2a2a3d] bg-[#12121a] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 transition-colors"
                />
            </div>
            <div className="mt-4 flex justify-center">
                <button
                    onClick={compare}
                    disabled={!subjectA.trim() || !subjectB.trim() || loading}
                    className="rounded-xl bg-cyan-500 px-8 py-3 text-sm font-bold text-black hover:bg-cyan-400 disabled:opacity-40 transition-all"
                >
                    {loading ? "Analysing..." : "Compare"}
                </button>
            </div>

            {/* Skeleton */}
            {loading && (
                <div className="mt-10 space-y-6 animate-pulse">
                    <div className="flex gap-4">
                        <div className="h-48 w-32 rounded-xl bg-[#12121a]" />
                        <div className="flex-1 space-y-3 pt-4">
                            <div className="h-5 w-40 rounded bg-[#12121a]" />
                            <div className="h-4 w-24 rounded bg-[#12121a]" />
                        </div>
                        <div className="h-48 w-32 rounded-xl bg-[#12121a]" />
                    </div>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="space-y-2">
                            <div className="h-3 w-full rounded-full bg-[#12121a]" />
                            <div className="h-2 w-3/4 rounded bg-[#12121a]" />
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                    {error}
                </div>
            )}

            {/* Results */}
            {result && !loading && (
                <div className="mt-10 space-y-8">
                    {/* Cover images + MAL scores */}
                    <div className="flex items-end justify-between gap-4">
                        {/* Side A */}
                        <div className="flex flex-col items-center gap-2 w-1/3">
                            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-cyan-500/30 bg-[#12121a]">
                                {result.image_a ? (
                                    <Image src={result.image_a} alt={result.subject_a} fill className="object-cover" unoptimized />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-600 text-xs">No image</div>
                                )}
                                {result.mal_scores && (
                                    <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-bold text-cyan-400">
                                        ★ {result.mal_scores.subject_a.toFixed(1)}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs font-semibold text-cyan-400 text-center leading-tight line-clamp-2">{result.subject_a}</p>
                            {result.meta_a && (
                                <div className="text-[10px] text-slate-500 text-center">
                                    {result.meta_a.year && <span>{result.meta_a.year}</span>}
                                    {result.meta_a.episodes && <span> · {result.meta_a.episodes} eps</span>}
                                </div>
                            )}
                        </div>

                        {/* VS */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-display text-2xl font-black text-slate-600">VS</span>
                        </div>

                        {/* Side B */}
                        <div className="flex flex-col items-center gap-2 w-1/3">
                            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-purple-500/30 bg-[#12121a]">
                                {result.image_b ? (
                                    <Image src={result.image_b} alt={result.subject_b} fill className="object-cover" unoptimized />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-600 text-xs">No image</div>
                                )}
                                {result.mal_scores && (
                                    <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-bold text-purple-400">
                                        ★ {result.mal_scores.subject_b.toFixed(1)}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs font-semibold text-purple-400 text-center leading-tight line-clamp-2">{result.subject_b}</p>
                            {result.meta_b && (
                                <div className="text-[10px] text-slate-500 text-center">
                                    {result.meta_b.year && <span>{result.meta_b.year}</span>}
                                    {result.meta_b.episodes && <span> · {result.meta_b.episodes} eps</span>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dimension bars */}
                    <div className="rounded-2xl border border-[#2a2a3d] bg-[#12121a] p-6 space-y-6">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider border-b border-[#2a2a3d] pb-3">
                            <span className="text-cyan-400">{result.subject_a}</span>
                            <span>Dimensions</span>
                            <span className="text-purple-400">{result.subject_b}</span>
                        </div>
                        {DIMENSIONS.map((dim) => (
                            <DimensionBar
                                key={dim}
                                label={dim}
                                data={result.dimensions[dim]}
                                subjectA={result.subject_a}
                                subjectB={result.subject_b}
                            />
                        ))}
                    </div>

                    {/* Overall winner */}
                    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 p-6 text-center space-y-3">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Overall Winner</p>
                        <p className="font-display text-2xl font-black text-cyan-400 text-glow-cyan">{result.overall_winner}</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">{result.verdict}</p>
                    </div>

                    {/* Best for */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-cyan-500/20 bg-[#12121a] p-4">
                            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">Best for fans of {result.subject_a}</p>
                            <p className="text-sm text-slate-400">{result.best_for.subject_a}</p>
                        </div>
                        <div className="rounded-xl border border-purple-500/20 bg-[#12121a] p-4">
                            <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-2">Best for fans of {result.subject_b}</p>
                            <p className="text-sm text-slate-400">{result.best_for.subject_b}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
