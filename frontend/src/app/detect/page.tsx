"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { detectCharacter, type CharacterDetectionResult } from "@/lib/api";
import ReactMarkdown from "react-markdown";

const CONFIDENCE_STYLES: Record<string, string> = {
    high: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    low: "text-rose-400 bg-rose-400/10 border-rose-400/30",
};

const CONFIDENCE_BAR: Record<string, { width: string; color: string }> = {
    high: { width: "w-[85%]", color: "bg-emerald-400" },
    medium: { width: "w-[50%]", color: "bg-yellow-400" },
    low: { width: "w-[20%]", color: "bg-rose-400" },
};

export default function DetectPage() {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<CharacterDetectionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFile(f: File) {
        if (!f.type.startsWith("image/")) {
            setError("Please upload an image file (JPEG, PNG, WebP, or GIF).");
            return;
        }
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setResult(null);
        setError(null);
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
    }

    async function detect() {
        if (!file || loading) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await detectCharacter(file);
            setResult(res);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Detection failed.");
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = "";
    }

    const bar = result ? CONFIDENCE_BAR[result.confidence] : null;

    return (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
            <div className="mb-10 text-center">
                <h1 className="font-display text-3xl font-bold tracking-widest gradient-text">CHARACTER DETECT</h1>
                <p className="mt-2 text-sm text-slate-500">Upload an anime image to identify the character</p>
            </div>

            {/* Drop zone */}
            {!preview && (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-16 cursor-pointer transition-all duration-200 ${dragging
                        ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(0,212,255,0.15)]"
                        : "border-[#2a2a3d] bg-[#12121a] hover:border-cyan-500/50 hover:bg-cyan-500/5"
                        }`}
                >
                    <span className="text-5xl">🖼️</span>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-slate-300">Drop image here or click to browse</p>
                        <p className="text-xs text-slate-600 mt-1">JPEG, PNG, WebP, GIF · Max 10 MB</p>
                    </div>
                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
                </div>
            )}

            {/* Preview + actions */}
            {preview && (
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative w-full sm:w-56 shrink-0 aspect-square rounded-xl overflow-hidden border border-[#2a2a3d] bg-[#12121a]">
                        <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                    </div>

                    <div className="flex flex-col gap-3 justify-center">
                        <p className="text-sm font-semibold text-slate-300">{file?.name}</p>
                        <p className="text-xs text-slate-500">{file ? `${(file.size / 1024).toFixed(0)} KB` : ""}</p>
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={detect}
                                disabled={loading}
                                className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-cyan-400 disabled:opacity-50 transition-all"
                            >
                                {loading ? "Detecting..." : "Identify Character"}
                            </button>
                            <button
                                onClick={reset}
                                className="rounded-lg border border-[#2a2a3d] bg-[#12121a] px-5 py-2.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Skeleton loader */}
            {loading && (
                <div className="mt-8 rounded-2xl border border-[#2a2a3d] bg-[#12121a] p-6 space-y-4 animate-pulse">
                    <div className="h-7 w-48 rounded-lg bg-[#2a2a3d]" />
                    <div className="h-4 w-32 rounded-lg bg-[#2a2a3d]" />
                    <div className="h-3 w-full rounded-full bg-[#2a2a3d]" />
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => <div key={i} className="h-6 w-20 rounded-full bg-[#2a2a3d]" />)}
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                    {error}
                </div>
            )}

            {/* Result */}
            {result && !loading && (
                <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-[#12121a] p-6 space-y-5 shadow-[0_0_30px_rgba(0,212,255,0.08)]">
                    {/* Name + show */}
                    <div>
                        <h2 className="font-display text-2xl font-bold text-cyan-400 text-glow-cyan">{result.character_name}</h2>
                        <p className="text-base text-slate-400 mt-1">from <span className="text-slate-200 font-semibold">{result.anime_title}</span></p>
                    </div>

                    {/* Confidence */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium uppercase tracking-wider">Confidence</span>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${CONFIDENCE_STYLES[result.confidence]}`}>
                                {result.confidence}
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#1a1a28]">
                            <div className={`h-full rounded-full transition-all duration-700 ${bar?.width} ${bar?.color}`} />
                        </div>
                    </div>

                    {/* Visual traits */}
                    {result.visual_traits.length > 0 && (
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Visual Traits</p>
                            <div className="flex flex-wrap gap-2">
                                {result.visual_traits.map((t) => (
                                    <span key={t} className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {result.notes && (
                        <div className="text-sm text-slate-400 leading-relaxed border-t border-[#2a2a3d] pt-4 prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                                components={{
                                    img: ({ ...props }) => (
                                        <img {...props} className="rounded-lg border border-[#2a2a3d] my-2 max-w-[180px] hover:scale-105 transition-transform duration-300 shadow-lg" alt={props.alt || "Anime image"} />
                                    ),
                                }}
                            >
                                {result.notes}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
