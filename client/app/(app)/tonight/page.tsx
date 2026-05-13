'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useMood } from '@/providers/MoodProvider';
import { useAuthContext } from '@/providers/AuthProvider';
import { MOODS, type MoodKey } from '@/config/moods';
import { fragmentsService } from '@/services/fragments.service';
import { echoesService } from '@/services/echoes.service';
import { capsulesService } from '@/services/capsules.service';
import api from '@/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
    fragments: number;
    echoes: number;
    capsules: number;
    topMood: { mood: string; count: number } | null;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
    icon, label, count, href, glow, delay,
}: {
    icon: string; label: string; count: number | string;
    href: string; glow: string; delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.45 }}
        >
            <Link href={href} className="block group">
                <div
                    className="relative rounded-2xl p-5 transition-all duration-300 overflow-hidden"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid rgba(255,255,255,0.07)`,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${glow}40`;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${glow}14`;
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = `rgba(255,255,255,0.07)`;
                        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                >
                    {/* Subtle top glow line */}
                    <div
                        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(90deg, transparent, ${glow}70, transparent)` }}
                    />

                    <div className="flex items-start justify-between mb-3">
                        <span
                            className="text-2xl transition-all duration-300 group-hover:scale-110 inline-block"
                            style={{ filter: `drop-shadow(0 0 6px ${glow}66)` }}
                        >
                            {icon}
                        </span>
                        {/* Arrow on hover */}
                        <span className="text-white/0 group-hover:text-white/30 transition-all duration-200 text-xs translate-x-1 group-hover:translate-x-0">
                            →
                        </span>
                    </div>

                    <p
                        className="font-display text-3xl sm:text-4xl mb-1 transition-all duration-300"
                        style={{ color: count === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.82)' }}
                    >
                        {count}
                    </p>
                    <p className="text-xs text-white/30 tracking-widest uppercase leading-none">
                        {label}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
    { label: 'Leave a Fragment', href: '/fragments/new', icon: '✦', glow: '#8B5CF6', desc: 'write a thought' },
    { label: 'Write an Echo', href: '/echoes', icon: '✉', glow: '#A855F7', desc: 'unsent words' },
    { label: 'Log Atmosphere', href: '/atmosphere', icon: '◉', glow: '#7DD3FC', desc: 'how do you feel' },
    { label: 'Seal a Capsule', href: '/capsules', icon: '⟁', glow: '#6EE7B7', desc: 'write to the future' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TonightPage() {
    const { mood, setMood, current, } = useMood();
    const { user } = useAuthContext();
    const [stats, setStats] = useState<Stats>({ fragments: 0, echoes: 0, capsules: 0, topMood: null });
    const [loadingStats, setLoadingStats] = useState(true);

    const hour = new Date().getHours();
    const timeLabel =
        hour < 5 ? 'Still awake' :
            hour < 12 ? 'Good morning' :
                hour < 17 ? 'Good afternoon' :
                    hour < 21 ? 'Good evening' :
                        'Good night';

    useEffect(() => {
        Promise.all([
            fragmentsService.getAll(),
            echoesService.getAll(),
            capsulesService.getAll(),
            api.get('/atmosphere/stats').then(r => r.data).catch(() => null),
        ]).then(([frags, echos, caps, moodStats]) => {
            setStats({
                fragments: frags.length,
                echoes: echos.length,
                capsules: caps.length,
                topMood: moodStats?.topMood ?? null,
            });
        }).finally(() => setLoadingStats(false));
    }, []);

    return (
        <AppShell topBarTitle="Tonight" topBarSubtitle="your archive">
            <div className="max-w-3xl mx-auto w-full">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 sm:mb-10"
                >
                    <p className="text-white/25 text-xs tracking-[0.3em] uppercase mb-1">
                        {timeLabel}
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl text-white/85 leading-tight">
                        {user?.username
                            ? <>{user.username}<span className="text-white/25">,</span><br />tonight</>
                            : 'Tonight'
                        }
                    </h1>
                    <p className="text-white/30 text-sm mt-2">What's keeping you awake?</p>
                </motion.div>

                {/* ── Mood Selector ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.45 }}
                    className="mb-8"
                >
                    <GlassCard glow={current.glow}>
                        <p className="text-[10px] text-white/25 tracking-[0.35em] uppercase mb-4">
                            Your Atmosphere
                        </p>
                        {/* Scrollable on mobile, wrap on desktop */}
                        <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible scrollbar-none">
                            {(Object.keys(MOODS) as MoodKey[]).map(m => (
                                <button
                                    key={m}
                                    onClick={() => { }}
                                    className="flex-shrink-0 sm:flex-shrink transition-all duration-250"
                                >
                                    <span
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-250"
                                        style={{
                                            background: mood === m ? `${MOODS[m].glow}20` : 'rgba(255,255,255,0.04)',
                                            border: `1px solid ${mood === m ? MOODS[m].glow + '55' : 'rgba(255,255,255,0.08)'}`,
                                            color: mood === m ? MOODS[m].glow : 'rgba(255,255,255,0.35)',
                                            boxShadow: mood === m ? `0 0 12px ${MOODS[m].glow}20` : 'none',
                                        }}
                                    >
                                        {MOODS[m].emoji} {MOODS[m].label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>

                {/* ── Stats Grid ── */}
                <div className="mb-8">
                    <p className="text-[10px] text-white/25 tracking-[0.35em] uppercase mb-4">
                        Your Archive
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {loadingStats ? (
                            // Skeleton
                            [...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl h-28 animate-pulse"
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        animationDelay: `${i * 0.1}s`,
                                    }}
                                />
                            ))
                        ) : (
                            <>
                                <StatCard
                                    icon="✦" label="Fragments" count={stats.fragments}
                                    href="/fragments" glow="#8B5CF6" delay={0.2}
                                />
                                <StatCard
                                    icon="✉" label="Echoes" count={stats.echoes}
                                    href="/echoes" glow="#A855F7" delay={0.27}
                                />
                                <StatCard
                                    icon="⟁" label="Capsules" count={stats.capsules}
                                    href="/capsules" glow="#7DD3FC"
                                    // Span full width on mobile when it's the 3rd item in a 2-col grid
                                    delay={0.34}
                                />
                            </>
                        )}
                    </div>

                    {/* Top mood stat — only if data exists */}
                    {!loadingStats && stats.topMood && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.42 }}
                            className="mt-3"
                        >
                            <Link href="/atmosphere" className="block group">
                                <div
                                    className="rounded-2xl px-5 py-4 flex items-center justify-between transition-all duration-300"
                                    style={{
                                        background: `${MOODS[stats.topMood.mood as MoodKey]?.glow ?? '#8B5CF6'}0C`,
                                        border: `1px solid ${MOODS[stats.topMood.mood as MoodKey]?.glow ?? '#8B5CF6'}22`,
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">
                                            {MOODS[stats.topMood.mood as MoodKey]?.emoji ?? '◉'}
                                        </span>
                                        <div>
                                            <p className="text-[10px] text-white/25 tracking-widest uppercase leading-none mb-0.5">
                                                Most Felt
                                            </p>
                                            <p
                                                className="text-sm font-medium"
                                                style={{ color: MOODS[stats.topMood.mood as MoodKey]?.glow ?? '#8B5CF6' }}
                                            >
                                                {MOODS[stats.topMood.mood as MoodKey]?.label} · {stats.topMood.count}×
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-white/15 group-hover:text-white/35 transition-colors text-xs">
                                        view history →
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* ── Quick Actions ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.45 }}
                >
                    <p className="text-[10px] text-white/25 tracking-[0.35em] uppercase mb-4">
                        Begin Something
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {QUICK_ACTIONS.map(({ label, href, icon, glow, desc }, i) => (
                            <motion.div
                                key={href}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.07 }}
                            >
                                <Link href={href} className="block group">
                                    <div
                                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-250"
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.07)',
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.background = `${glow}0C`;
                                            (e.currentTarget as HTMLElement).style.borderColor = `${glow}33`;
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                                        }}
                                    >
                                        <span
                                            className="text-lg w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-250 group-hover:scale-110"
                                            style={{
                                                background: `${glow}15`,
                                                border: `1px solid ${glow}30`,
                                                color: glow,
                                                filter: `drop-shadow(0 0 4px ${glow}44)`,
                                            }}
                                        >
                                            {icon}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors leading-none mb-0.5">
                                                {label}
                                            </p>
                                            <p className="text-xs text-white/25">{desc}</p>
                                        </div>
                                        <span className="ml-auto text-white/0 group-hover:text-white/25 transition-all duration-200 text-xs flex-shrink-0">
                                            →
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </AppShell>
    );
}