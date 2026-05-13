'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMood } from '@/providers/MoodProvider';
import { MOODS } from '@/config/moods';
import { useAuthContext } from '@/providers/AuthProvider';

interface TopBarProps {
    title?: string;
    subtitle?: string;
    onMenuToggle: () => void;   // ← required now
    menuOpen: boolean;
}

function LiveClock({ glow }: { glow: string }) {
    const [time, setTime] = useState('');
    useEffect(() => {
        const tick = () =>
            setTime(new Date().toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', hour12: false,
            }));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    return (
        <span
            className="font-display text-lg tabular-nums hidden sm:block"
            style={{ color: `${glow}99` }}
        >
            {time}
        </span>
    );
}

export function TopBar({ title, subtitle, onMenuToggle, menuOpen }: TopBarProps) {
    const { current, mood } = useMood();
    const { user } = useAuthContext();

    const hour = new Date().getHours();
    const greeting =
        hour < 5 ? 'Still awake?' :
            hour < 12 ? 'Good morning' :
                hour < 17 ? 'Good afternoon' :
                    hour < 21 ? 'Good evening' :
                        'Good night';

    return (
        <header
            className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4"
            style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: 'rgba(7, 8, 22, 0.6)',
            }}
        >
            {/* Left — hamburger (mobile) + title */}
            <div className="flex items-center gap-3">
                {/* Hamburger — only on mobile */}
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
                    aria-label="Toggle menu"
                >
                    <motion.span
                        animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="block w-5 h-px bg-white/50 origin-center"
                    />
                    <motion.span
                        animate={menuOpen ? { opacity: 0, x: -4 } : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className="block w-5 h-px bg-white/50"
                    />
                    <motion.span
                        animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="block w-5 h-px bg-white/50 origin-center"
                    />
                </button>

                {/* Title or greeting */}
                {title ? (
                    <div>
                        <h2 className="font-display text-lg sm:text-xl text-white/75 leading-tight">{title}</h2>
                        {subtitle && <p className="text-white/30 text-xs hidden sm:block">{subtitle}</p>}
                    </div>
                ) : (
                    <div className="lg:hidden">
                        <p className="text-white/30 text-[10px] tracking-widest uppercase leading-none">{greeting}</p>
                        {user && <p className="font-display text-base text-white/60 leading-tight">{user.username}</p>}
                    </div>
                )}
            </div>

            {/* Right — clock + mood */}
            <div className="flex items-center gap-2 sm:gap-4">
                <LiveClock glow={current.glow} />

                <motion.div
                    animate={{ boxShadow: `0 0 12px ${current.glow}55` }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full"
                    style={{
                        background: `${current.glow}14`,
                        border: `1px solid ${current.glow}30`,
                    }}
                >
                    <span className="text-sm">{MOODS[mood].emoji}</span>
                    <span
                        className="text-xs hidden sm:block"
                        style={{ color: current.glow }}
                    >
                        {MOODS[mood].label}
                    </span>
                </motion.div>
            </div>
        </header>
    );
}