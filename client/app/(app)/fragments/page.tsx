'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { MoodBadge } from '@/components/ui/MoodBadge';
import { useFragments } from '@/hooks/useFragments';
import type { MoodKey } from '@/config/moods';

// ─── Fragment Modal ───────────────────────────────────────────────────────────
function FragmentModal({
    fragment,
    onClose,
}: {
    fragment: any;
    onClose: () => void;
}) {
    const date = new Date(fragment.createdAt).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    // Lock scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={onClose}
                className="fixed inset-0 z-50"
                style={{ background: 'rgba(7,8,22,0.85)', backdropFilter: 'blur(8px)' }}
            />

            {/* Panel — slides up from bottom on mobile, centered on desktop */}
            <motion.div
                key="panel"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: 'spring', stiffness: 340, damping: 36 }}
                className="fixed z-50 inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-6"
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="relative w-full sm:max-w-2xl max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden"
                    style={{
                        background: 'rgba(11, 16, 32, 0.97)',
                        backdropFilter: 'blur(24px)',
                        border: `1px solid ${fragment.glowColor ?? '#8B5CF6'}30`,
                        boxShadow: `0 0 60px ${fragment.glowColor ?? '#8B5CF6'}18`,
                    }}
                >
                    {/* Glow top edge */}
                    <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${fragment.glowColor ?? '#8B5CF6'}80, transparent)`,
                        }}
                    />

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
                        <div className="min-w-0 flex-1">
                            <h2 className="font-display text-2xl sm:text-3xl text-white/85 leading-tight mb-2">
                                {fragment.title || 'Untitled Fragment'}
                            </h2>
                            <div className="flex items-center flex-wrap gap-2">
                                <MoodBadge mood={fragment.mood as MoodKey} />
                                <span className="text-white/20 text-xs">{date}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/8 transition-all mt-1"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Scrollable content */}
                    <div className="overflow-y-auto flex-1 px-6 py-5">
                        <p className="text-white/65 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                            {fragment.content}
                        </p>

                        {/* Song */}
                        {fragment.song && (
                            <div
                                className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl"
                                style={{
                                    background: `${fragment.glowColor ?? '#8B5CF6'}10`,
                                    border: `1px solid ${fragment.glowColor ?? '#8B5CF6'}25`,
                                }}
                            >
                                <span className="text-white/40">♪</span>
                                <span className="text-white/50 text-sm">{fragment.song}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-white/5 flex-shrink-0">
                        <p className="text-white/15 text-xs text-center">
                            tap outside or press Esc to close
                        </p>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// ─── Fragment Card ────────────────────────────────────────────────────────────
function FragmentCard({
    fragment,
    onLetGo,
    onOpen,
}: {
    fragment: any;
    onLetGo: (id: string) => void;
    onOpen: (fragment: any) => void;
}) {
    const date = new Date(fragment.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
        >
            <GlassCard glow={fragment.glowColor} className="group relative h-full flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl text-white/80 leading-tight">
                        {fragment.title || 'Untitled Fragment'}
                    </h3>
                    <MoodBadge mood={fragment.mood as MoodKey} />
                </div>

                {/* Content preview — always clamped on card */}
                <p className="text-white/45 text-sm leading-relaxed line-clamp-3 flex-1">
                    {fragment.content}
                </p>


                {/* Song */}
                {fragment.song && (
                    <p className="text-white/30 text-xs flex items-center gap-1.5">
                        <span>♪</span> {fragment.song}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-white/25 text-[11px]">{date}</span>
                    <div className="flex items-center gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onOpen(fragment)}
                            className="text-[11px] text-white/25 hover:text-white/55 transition-colors"
                        >
                            Open
                        </button>
                        <button
                            onClick={() => onLetGo(fragment._id)}
                            className="text-[11px] text-white/20 hover:text-pink-400/60 transition-colors"
                        >
                            Let Go
                        </button>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FragmentsPage() {
    const { fragments, loading, fetchFragments, letGo } = useFragments();
    const [activeFragment, setActiveFragment] = useState<any | null>(null);

    useEffect(() => { fetchFragments(); }, []);

    return (
        <AppShell>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-4xl text-white/80">Fragments</h1>
                    <p className="text-white/30 text-sm mt-1">
                        {fragments.length > 0
                            ? `${fragments.length} thought${fragments.length !== 1 ? 's' : ''} left behind`
                            : 'Nothing here yet.'}
                    </p>
                </div>
                <NeonButton as={Link} href="/fragments/new" color="primary" glowColor="#8B5CF6" size="sm">
                    + Leave a Fragment
                </NeonButton>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="glass rounded-2xl h-52 animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            ) : fragments.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                    <p className="font-display text-5xl text-white/10 mb-4">✦</p>
                    <p className="text-white/25 text-sm">The night is empty. Leave your first fragment.</p>
                    <NeonButton as={Link} href="/fragments/new" className="mt-6" glowColor="#8B5CF6" variant="bordered">
                        Begin
                    </NeonButton>
                </motion.div>
            ) : (
                <AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {fragments.map(f => (
                            <FragmentCard
                                key={f._id}
                                fragment={f}
                                onLetGo={letGo}
                                onOpen={setActiveFragment}
                            />
                        ))}
                    </div>
                </AnimatePresence>
            )}

            {/* Modal — rendered outside the grid */}
            {activeFragment && (
                <FragmentModal
                    fragment={activeFragment}
                    onClose={() => setActiveFragment(null)}
                />
            )}
        </AppShell>
    );
}