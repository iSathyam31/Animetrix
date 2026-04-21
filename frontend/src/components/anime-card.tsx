import Image from "next/image";
import Link from "next/link";
import type { AnimeSearchResult } from "@/lib/api";

interface AnimeCardProps {
    anime: AnimeSearchResult;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
    const scoreColor =
        !anime.score ? "text-slate-500" :
            anime.score >= 8 ? "text-emerald-400" :
                anime.score >= 6 ? "text-yellow-400" :
                    "text-rose-400";

    return (
        <Link
            href={`/search/${anime.mal_id}`}
            className="group relative flex flex-col rounded-xl border border-[#2a2a3d] bg-[#12121a] overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] hover:-translate-y-1"
        >
            {/* Cover image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1a1a28]">
                {anime.image ? (
                    <Image
                        src={anime.image}
                        alt={anime.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        unoptimized
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-600 text-sm">
                        No image
                    </div>
                )}

                {/* Score badge */}
                {anime.score && (
                    <div className={`absolute top-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-bold backdrop-blur-sm ${scoreColor}`}>
                        ★ {anime.score.toFixed(1)}
                    </div>
                )}

                {/* Type badge */}
                {anime.type && (
                    <div className="absolute top-2 left-2 rounded-md bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 backdrop-blur-sm">
                        {anime.type}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-200 leading-snug group-hover:text-cyan-300 transition-colors">
                    {anime.title_english || anime.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    {anime.year && <span>{anime.year}</span>}
                    {anime.year && anime.episodes && <span>·</span>}
                    {anime.episodes && <span>{anime.episodes} eps</span>}
                </div>
                {anime.status && (
                    <span className="mt-1 self-start rounded-full bg-[#1a1a28] border border-[#2a2a3d] px-2 py-0.5 text-[10px] text-slate-400">
                        {anime.status}
                    </span>
                )}
            </div>
        </Link>
    );
}
