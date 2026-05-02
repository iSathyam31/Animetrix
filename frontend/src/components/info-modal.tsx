"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, ScanSearch, Swords, BookOpen } from "lucide-react";

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MODULES = [
    {
        icon: <MessageSquare className="w-5 h-5 text-indigo-400" />,
        title: "Chibi Chat",
        description: "Ask Chibi for personalized anime recommendations based on your mood, favorite genres, or similar shows.",
    },
    {
        icon: <ScanSearch className="w-5 h-5 text-violet-400" />,
        title: "Character Detection",
        description: "Upload any anime screenshot or fan-art. Our AI will identify the character, the show they belong to, and their visual traits.",
    },
    {
        icon: <Swords className="w-5 h-5 text-rose-400" />,
        title: "Anime Compare",
        description: "Pit two anime against each other. Our AI evaluates story, animation, characters, and sound to declare an ultimate winner.",
    },
    {
        icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
        title: "Encyclopedia Search",
        description: "Search a database of over 24,000 anime to find details, cast, staff, community scores, and recommendations.",
    },
];

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const container = typeof document !== "undefined" ? document.body : null;
    if (!mounted || !container) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-[#07070f]/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-xl bg-[#0e0e1a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
                                <h2 className="font-display font-bold text-lg text-slate-100">
                                    How to use Animetrix
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-5 space-y-6">
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Animetrix is your AI-powered anime companion. Here are the four main tools at your disposal:
                                </p>

                                <div className="grid gap-4">
                                    {MODULES.map((mod, idx) => (
                                        <div key={idx} className="flex gap-4 items-start">
                                            <div className="mt-0.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                                                {mod.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-200">{mod.title}</h3>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                    {mod.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-5 border-t border-white/[0.04] bg-white/[0.01] flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2 text-sm font-semibold text-slate-100 bg-white/[0.06] hover:bg-white/[0.1] rounded-lg transition-colors"
                                >
                                    Got it
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
