import type { DimensionScore } from "@/lib/api";

interface DimensionBarProps {
    label: string;
    data: DimensionScore;
    subjectA: string;
    subjectB: string;
}

const DIMENSION_LABELS: Record<string, string> = {
    story: "Story",
    animation: "Animation",
    characters: "Characters",
    emotional_impact: "Emotional Impact",
    rewatchability: "Rewatchability",
};

export default function DimensionBar({ label, data, subjectA, subjectB }: DimensionBarProps) {
    const total = data.score_a + data.score_b;
    const pctA = total > 0 ? (data.score_a / total) * 100 : 50;
    const pctB = total > 0 ? (data.score_b / total) * 100 : 50;
    const winnerA = data.winner === subjectA;
    const winnerB = data.winner === subjectB;

    return (
        <div className="flex flex-col gap-2">
            {/* Label row */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span className={winnerA ? "text-cyan-400" : ""}>{data.score_a.toFixed(1)}</span>
                <span>{DIMENSION_LABELS[label] ?? label}</span>
                <span className={winnerB ? "text-purple-400" : ""}>{data.score_b.toFixed(1)}</span>
            </div>

            {/* Bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#1a1a28]">
                <div
                    className={`h-full rounded-l-full transition-all duration-700 ${winnerA
                        ? "bg-cyan-500 shadow-[0_0_10px_rgba(0,212,255,0.5)]"
                        : "bg-cyan-900/60"
                        }`}
                    style={{ width: `${pctA}%` }}
                />
                <div
                    className={`h-full rounded-r-full transition-all duration-700 ${winnerB
                        ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        : "bg-purple-900/60"
                        }`}
                    style={{ width: `${pctB}%` }}
                />
            </div>

            {/* Reason */}
            <p className="text-xs text-slate-500 leading-relaxed">{data.reason}</p>
        </div>
    );
}
