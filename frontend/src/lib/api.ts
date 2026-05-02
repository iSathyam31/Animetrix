export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface AnimeSearchResult {
    mal_id: number;
    title: string;
    title_english?: string | null;
    image?: string | null;
    type?: string | null;
    episodes?: number | null;
    score?: number | null;
    year?: number | null;
    status?: string | null;
}

export interface DimensionScore {
    score_a: number;
    score_b: number;
    winner: string;
    reason: string;
}

export interface AnimeDimensions {
    story: DimensionScore;
    animation: DimensionScore;
    characters: DimensionScore;
    emotional_impact: DimensionScore;
    rewatchability: DimensionScore;
}

export interface BestFor {
    subject_a: string;
    subject_b: string;
}

export interface MalScores {
    subject_a: number;
    subject_b: number;
}

export interface AnimeMeta {
    episodes?: number | null;
    year?: number | null;
    genres: string[];
    studios: string[];
}

export interface AnimeComparisonResult {
    mode: string;
    subject_a: string;
    subject_b: string;
    dimensions: AnimeDimensions;
    overall_winner: string;
    verdict: string;
    best_for: BestFor;
    mal_scores?: MalScores | null;
    image_a?: string | null;
    image_b?: string | null;
    meta_a?: AnimeMeta | null;
    meta_b?: AnimeMeta | null;
}

export interface CharacterDetectionResult {
    character_name: string;
    anime_title: string;
    confidence: string;
    visual_traits: string[];
    notes?: string | null;
}

export interface ChatResponse {
    response: string;
    session_id: string;
    user_id: string;
}

export async function searchAnime(term: string, limit: number = 18): Promise<AnimeSearchResult[]> {
    const res = await fetch(`${API_BASE}/anime/search?q=${encodeURIComponent(term)}&limit=${limit}`);
    if (!res.ok) throw new Error("Search failed");
    return res.json();
}

export async function getAnimeDetail(malId: number): Promise<any> {
    const res = await fetch(`${API_BASE}/anime/${malId}`);
    if (!res.ok) throw new Error("Failed to fetch anime details");
    return res.json();
}

export async function postChat(message: string, userId: string, sessionId: string): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, user_id: userId, session_id: sessionId })
    });
    if (!res.ok) throw new Error("Chat request failed");
    return res.json();
}

export async function clearChat(userId: string, sessionId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/chat/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, session_id: sessionId })
    });
    if (!res.ok) throw new Error("Clear chat failed");
}

export async function detectCharacter(file: File): Promise<CharacterDetectionResult> {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch(`${API_BASE}/character/detect`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("Character detection failed");
    return res.json();
}

export async function compareAnime(subjectA: string, subjectB: string): Promise<AnimeComparisonResult> {
    const res = await fetch(`${API_BASE}/comparison`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject_a: subjectA, subject_b: subjectB })
    });
    if (!res.ok) throw new Error("Comparison failed");
    return res.json();
}
