'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { MoodBadge } from '@/components/ui/MoodBadge';
import { fragmentsService } from '@/services/fragments.service';
import { echoesService } from '@/services/echoes.service';
import { MOODS, type MoodKey } from '@/config/moods';
import { toast } from 'sonner';

type TimelineItem = {
    _id: string;
    type: 'fragment' | 'echo' | 'mood';
    title?: string;
    content?: string;
    mood?: MoodKey;
    glowColor?: string;
    to?: string;
    createdAt: string;
};

const TYPE_ICON = { fragment: '✦', echo: '✉', mood: '◉' };
const TYPE_LABEL = { fragment: 'Fragment', echo: 'Echo', mood: 'Atmosphere' };
const TYPE_HREF = { fragment: '/fragments', echo: '/echoes', mood: '/atmosphere' };

export default function NightlinePage() {
    const [items, setItems] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const didScroll = useRef(false);

    useEffect(() => {
        Promise.all([fragmentsService.getAll(), echoesService.getAll()])
            .then(([frags, echos]) => {
                const all: TimelineItem[] = [
                    ...frags.map((f: any) => ({ ...f, type: 'fragment' as const })),
                    ...echos.map((e: any) => ({ ...e, type: 'echo' as const })),
                ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setItems(all);
            })
            .finally(() => setLoading(false));
    }, []);

    // Scroll to hashed item after items load
    useEffect(() => {
        if (loading || didScroll.current || items.length === 0) return;
        const hash = window.location.hash.replace('#', '');
        if (!hash) return;
        const el = document.getElementById(hash);
        if (el) {
            // Small delay to let layout settle
            setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Briefly highlight the target card
                el.classList.add('nightline-highlight');
                setTimeout(() => el.classList.remove('nightline-highlight'), 2000);
            }, 150);
        }
        didScroll.current = true;
    }, [loading, items]);

    const copyLink = (itemId: string) => {
        const url = `${window.location.origin}/nightline#${itemId}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(itemId);
            toast.success('Link copied', { description: 'Share it or bookmark it for later.' });
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const grouped = items.reduce((acc: Record<string, TimelineItem[]>, item) => {
        const date = new Date(item.createdAt).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
        });
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
    }, {});

    return (
        <AppShell>
            {/* Highlight animation style */}
            <style>{`
        .nightline-highlight {
          animation: nightline-pulse 2s ease-out forwards;
        }
        @keyframes nightline-pulse {
          0%   { box-shadow: 0 0 0 3px rgba(139,92,246,0.6); }
          100% { box-shadow: 0 0 0 3px rgba(139,92,246,0); }
        }
      `}</style>

            <div className="mb-10">
                <h1 className="font-display text-4xl text-white/80">Nightline</h1>
                <p className="text-white/30 text-sm mt-1">Everything you've left behind, in order.</p>
            </div>

            {loading ? (
                <div className="flex flex-col gap-4 max-w-2xl">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="glass rounded-2xl h-20 animate-pulse" style={{ animationDelay: `${i * 0.08}s` }} />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-24">
                    <p className="font-display text-5xl text-white/10 mb-4">◈</p>
                    <p className="text-white/25 text-sm">Your timeline is empty. Start leaving traces.</p>
                </div>
            ) : (
                <div className="max-w-2xl w-full">
                    {Object.entries(grouped).map(([date, dayItems], gi) => (
                        <motion.div
                            key={date}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: gi * 0.05 }}
                            className="mb-10"
                        >
                            <p className="text-white/20 text-xs tracking-widest uppercase mb-5">
                                {date}
                            </p>

                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-[16px] top-0 bottom-0 w-px bg-gradient-to-b from-glow-violet/30 via-white/5 to-transparent" />

                                <div className="flex flex-col gap-5">
                                    {dayItems.map((item, i) => {
                                        const glow = item.glowColor || (item.mood ? MOODS[item.mood]?.glow : '#8B5CF6') || '#8B5CF6';
                                        const time = new Date(item.createdAt).toLocaleTimeString('en-US', {
                                            hour: '2-digit', minute: '2-digit',
                                        });
                                        const itemId = `${item.type}-${item._id}`;

                                        return (
                                            <motion.div
                                                key={item._id}
                                                id={itemId}           // ← anchor id for hash linking
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: gi * 0.05 + i * 0.04 }}
                                                className="flex gap-5 pl-1 rounded-2xl transition-all duration-300"
                                            >
                                                {/* Dot */}
                                                <div className="relative flex-shrink-0 mt-1.5">
                                                    <div
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                                                        style={{
                                                            background: `${glow}18`,
                                                            border: `1px solid ${glow}44`,
                                                            boxShadow: `0 0 8px ${glow}33`,
                                                            color: glow,
                                                        }}
                                                    >
                                                        {TYPE_ICON[item.type]}
                                                    </div>
                                                </div>

                                                {/* Card */}
                                                <div
                                                    className="flex-1 glass rounded-xl p-4 group"
                                                    style={{ borderColor: `${glow}22` }}
                                                >
                                                    {/* Card header */}
                                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                        <span
                                                            className="text-[10px] tracking-widest uppercase"
                                                            style={{ color: `${glow}99` }}
                                                        >
                                                            {TYPE_LABEL[item.type]}
                                                        </span>
                                                        {item.mood && <MoodBadge mood={item.mood} />}
                                                        <span className="text-white/20 text-[11px] ml-auto">{time}</span>
                                                    </div>

                                                    {item.title && (
                                                        <p className="font-display text-lg text-white/75 mb-1">
                                                            {item.title}
                                                        </p>
                                                    )}
                                                    {item.type === 'echo' && item.to && (
                                                        <p className="text-white/35 text-xs mb-1">To: {item.to}</p>
                                                    )}
                                                    <p className="text-white/45 text-sm leading-relaxed line-clamp-3">
                                                        {item.content}
                                                    </p>

                                                    {/* Footer: go to item + copy link */}
                                                    <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        {/* Go to the actual page (fragments / echoes) */}
                                                        <a
                                                            href={`${TYPE_HREF[item.type]}`}
                                                            className="text-[11px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
                                                        >
                                                            <span>↗</span>
                                                            <span>Go to {TYPE_LABEL[item.type]}s</span>
                                                        </a>

                                                        <span className="text-white/10">·</span>

                                                        {/* Copy deep link */}
                                                        <button
                                                            onClick={() => copyLink(itemId)}
                                                            className="text-[11px] transition-colors flex items-center gap-1"
                                                            style={{
                                                                color: copiedId === itemId ? glow : 'rgba(255,255,255,0.3)',
                                                            }}
                                                        >
                                                            <span>{copiedId === itemId ? '✓' : '⌘'}</span>
                                                            <span>{copiedId === itemId ? 'Copied!' : 'Copy link'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </AppShell>
    );
}