"use client";

import { useState, useRef, useEffect } from "react";
import { postChat, clearChat, type ChatResponse } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>("");
    const [userId] = useState<string>(() => crypto.randomUUID());
    const [error, setError] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function send() {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg: Message = { role: "user", content: text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);
        setError(null);

        try {
            const res: ChatResponse = await postChat({
                message: text,
                user_id: userId,
                session_id: sessionId || undefined,
            });
            setSessionId(res.session_id);
            setMessages((prev) => [...prev, { role: "assistant", content: res.response }]);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Something went wrong.");
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    }

    async function handleClear() {
        if (!sessionId) return;
        await clearChat(sessionId, userId).catch(() => null);
        setMessages([]);
        setSessionId("");
    }

    function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-56px)]">
            {/* Header */}
            <div className="border-b border-[#2a2a3d] bg-[#0a0a0f]/80 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-base">
                            🤖
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a0f]" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-200">Chibi</p>
                        <p className="text-xs text-slate-500">Anime Recommendation AI</p>
                    </div>
                </div>
                {sessionId && (
                    <button
                        onClick={handleClear}
                        className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                    >
                        Clear chat
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl">
                            🤖
                        </div>
                        <div>
                            <p className="font-display text-lg font-bold tracking-wider text-slate-200">Hey, I&apos;m Chibi!</p>
                            <p className="text-sm text-slate-500 mt-1 max-w-xs">
                                Tell me your mood or what you enjoyed and I&apos;ll find the perfect anime for you.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {["Recommend a dark fantasy", "Something like Attack on Titan", "Best romance anime"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setInput(s)}
                                    className="rounded-full border border-[#2a2a3d] bg-[#12121a] px-3 py-1.5 text-xs text-slate-400 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
                        {msg.role === "assistant" && (
                            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-sm mt-1">
                                🤖
                            </div>
                        )}
                        <div
                            className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                                ? "bg-cyan-500/20 border border-cyan-500/30 text-slate-200 rounded-tr-sm whitespace-pre-wrap"
                                : "bg-[#12121a] border border-[#2a2a3d] text-slate-300 rounded-tl-sm prose prose-invert prose-sm max-w-none"
                                }`}
                        >
                            {msg.role === "assistant" ? (
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        img: ({ ...props }) => (
                                            <img {...props} className="rounded-lg border border-[#2a2a3d] my-2 max-w-[180px] hover:scale-105 transition-transform duration-300 shadow-lg" alt={props.alt || "Anime image"} />
                                        ),
                                        a: ({ ...props }) => (
                                            <a {...props} className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer" />
                                        ),
                                        p: ({ ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                                        ul: ({ ...props }) => <ul {...props} className="list-disc pl-4 mb-2" />,
                                        ol: ({ ...props }) => <ol {...props} className="list-decimal pl-4 mb-2" />,
                                        li: ({ ...props }) => <li {...props} className="mb-1" />,
                                        h1: ({ ...props }) => <h1 {...props} className="text-lg font-bold mb-2 text-white" />,
                                        h2: ({ ...props }) => <h2 {...props} className="text-base font-bold mb-2 text-white" />,
                                        h3: ({ ...props }) => <h3 {...props} className="text-sm font-bold mb-1 text-white" />,
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-sm mt-1">
                            🤖
                        </div>
                        <div className="bg-[#12121a] border border-[#2a2a3d] rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1 items-center h-5">
                                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0ms]" />
                                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:150ms]" />
                                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:300ms]" />
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                        {error}
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[#2a2a3d] bg-[#0a0a0f]/80 px-4 py-3">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Ask Chibi for a recommendation..."
                        rows={1}
                        className="flex-1 resize-none rounded-xl border border-[#2a2a3d] bg-[#12121a] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-colors max-h-36 overflow-y-auto"
                    />
                    <button
                        onClick={send}
                        disabled={loading || !input.trim()}
                        className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-black transition-all hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                        Send
                    </button>
                </div>
                <p className="text-center text-[10px] text-slate-600 mt-2">Enter to send · Shift+Enter for new line</p>
            </div>
        </div>
    );
}
