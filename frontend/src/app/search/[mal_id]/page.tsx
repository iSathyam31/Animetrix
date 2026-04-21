import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnimeDetail } from "@/lib/api";

interface Props {
    params: Promise<{ mal_id: string }>;
}

export default async function AnimeDetailPage({ params }: Props) {
    const { mal_id } = await params;
    const id = parseInt(mal_id, 10);

    if (isNaN(id)) notFound();

    let data;
    try {
        data = await getAnimeDetail(id);
    } catch {
        notFound();
    }

    const { anime, characters, recommendations, staff } = data;

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            {/* Back */}
            <Link href="/search" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors mb-6 inline-block">
                ← Back to Search
            </Link>

            {/* Hero section */}
            <div className="flex flex-col sm:flex-row gap-8">
                {/* Cover */}
                <div className="relative w-48 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden border border-[#2a2a3d] bg-[#12121a] self-start">
                    {anime.image ? (
                        <Image src={anime.image} alt={anime.title} fill className="object-cover" unoptimized />
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-600 text-xs">No image</div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-3 flex-1">
                    <h1 className="font-display text-2xl font-bold text-slate-100 leading-snug">
                        {anime.title_english || anime.title}
                    </h1>
                    {anime.title_english && anime.title !== anime.title_english && (
                        <p className="text-sm text-slate-500">{anime.title}</p>
                    )}
                    {anime.title_japanese && (
                        <p className="text-xs text-slate-600">{anime.title_japanese}</p>
                    )}

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-3 mt-1">
                        {anime.score && (
                            <span className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-sm font-bold text-cyan-400">
                                ★ {anime.score.toFixed(1)}
                            </span>
                        )}
                        {anime.rank && (
                            <span className="rounded-lg bg-[#1a1a28] border border-[#2a2a3d] px-3 py-1 text-xs text-slate-400">
                                Rank #{anime.rank}
                            </span>
                        )}
                        {anime.type && (
                            <span className="rounded-lg bg-[#1a1a28] border border-[#2a2a3d] px-3 py-1 text-xs text-slate-400">
                                {anime.type}
                            </span>
                        )}
                        {anime.episodes && (
                            <span className="rounded-lg bg-[#1a1a28] border border-[#2a2a3d] px-3 py-1 text-xs text-slate-400">
                                {anime.episodes} episodes
                            </span>
                        )}
                        {anime.status && (
                            <span className="rounded-lg bg-[#1a1a28] border border-[#2a2a3d] px-3 py-1 text-xs text-slate-400">
                                {anime.status}
                            </span>
                        )}
                        {anime.year && (
                            <span className="rounded-lg bg-[#1a1a28] border border-[#2a2a3d] px-3 py-1 text-xs text-slate-400">
                                {anime.season ? `${anime.season} ` : ""}{anime.year}
                            </span>
                        )}
                        {anime.rating && (
                            <span className="rounded-lg bg-[#1a1a28] border border-[#2a2a3d] px-3 py-1 text-xs text-slate-400">
                                {anime.rating}
                            </span>
                        )}
                    </div>

                    {/* Genres */}
                    {anime.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {anime.genres.map((g) => (
                                <span key={g} className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-0.5 text-xs text-purple-300">
                                    {g}
                                </span>
                            ))}
                            {anime.themes.map((t) => (
                                <span key={t} className="rounded-full border border-[#2a2a3d] bg-[#12121a] px-3 py-0.5 text-xs text-slate-400">
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Studios */}
                    {anime.studios.length > 0 && (
                        <p className="text-xs text-slate-500">
                            <span className="text-slate-400 font-medium">Studio: </span>
                            {anime.studios.join(", ")}
                        </p>
                    )}

                    {/* Synopsis */}
                    {anime.synopsis && (
                        <p className="text-sm text-slate-400 leading-relaxed mt-1 line-clamp-6">
                            {anime.synopsis}
                        </p>
                    )}
                </div>
            </div>

            {/* Characters */}
            {characters.length > 0 && (
                <section className="mt-12">
                    <h2 className="font-display text-sm font-bold tracking-widest text-slate-400 uppercase mb-4">Characters</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {characters.map((c) => (
                            <div key={c.name} className="flex flex-col items-center gap-1 text-center">
                                <div className="relative h-16 w-16 rounded-full overflow-hidden border border-[#2a2a3d] bg-[#12121a]">
                                    {c.image ? (
                                        <Image src={c.image} alt={c.name} fill className="object-cover" unoptimized />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-600 text-lg">👤</div>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-300 leading-tight line-clamp-2">{c.name}</p>
                                {c.role && (
                                    <p className="text-[9px] text-slate-600">{c.role}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Staff */}
            {staff.length > 0 && (
                <section className="mt-12">
                    <h2 className="font-display text-sm font-bold tracking-widest text-slate-400 uppercase mb-4">Staff</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {staff.slice(0, 12).map((s) => (
                            <div key={s.name} className="flex items-center gap-3 rounded-xl border border-[#2a2a3d] bg-[#12121a] p-3">
                                <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-[#2a2a3d] bg-[#1a1a28]">
                                    {s.image ? (
                                        <Image src={s.image} alt={s.name} fill className="object-cover" unoptimized />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-600 text-sm">👤</div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-300 truncate">{s.name}</p>
                                    <p className="text-[10px] text-slate-600 truncate">{s.positions.join(", ")}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <section className="mt-12">
                    <h2 className="font-display text-sm font-bold tracking-widest text-slate-400 uppercase mb-4">You May Also Like</h2>
                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
                        {recommendations.map((r) => (
                            <Link
                                key={r.title}
                                href={r.mal_id ? `/search/${r.mal_id}` : "#"}
                                className="group shrink-0 w-32 flex flex-col gap-2"
                            >
                                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-[#2a2a3d] bg-[#12121a] group-hover:border-cyan-500/40 transition-colors">
                                    {r.image ? (
                                        <Image src={r.image} alt={r.title} fill className="object-cover" unoptimized />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-600 text-xs">No image</div>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-2 group-hover:text-cyan-300 transition-colors">{r.title}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Background info */}
            {anime.background && (
                <section className="mt-12 rounded-xl border border-[#2a2a3d] bg-[#12121a] p-5">
                    <h2 className="font-display text-sm font-bold tracking-widest text-slate-400 uppercase mb-3">Background</h2>
                    <p className="text-sm text-slate-500 leading-relaxed">{anime.background}</p>
                </section>
            )}
        </div>
    );
}
