'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '@/providers/MoodProvider';
import { authService } from '@/services/auth.service';
import { MOODS } from '@/config/moods';
import { toast } from 'sonner';

const NAV = [
    { href: '/tonight', label: 'Tonight', icon: '🌙', desc: 'your space' },
    { href: '/fragments', label: 'Fragments', icon: '✦', desc: 'thoughts' },
    { href: '/echoes', label: 'Echoes', icon: '✉', desc: 'unsent' },
    { href: '/nightline', label: 'Nightline', icon: '◈', desc: 'timeline' },
    { href: '/atmosphere', label: 'Atmosphere', icon: '◉', desc: 'moods' },
    { href: '/capsules', label: 'Time Capsules', icon: '⟁', desc: 'future' },
];

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { current, mood } = useMood();
    const [loggingOut, setLoggingOut] = useState(false);

    // Close drawer on route change (mobile)
    useEffect(() => { onClose(); }, [pathname]);

    // Lock body scroll when mobile drawer open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await authService.logout();
            toast.success('Until next time', { description: 'The archive is waiting for your return.' });
            router.push('/login');
        } catch {
            toast.error('Could not log out', { description: 'Try again.' });
        } finally {
            setLoggingOut(false);
        }
    };

    const sidebarContent = (
        <div className="flex flex-col h-full py-7 px-4">

            {/* Brand */}
            <div className="mb-8 px-2 flex items-center justify-between">
                <div>
                    <p
                        className="font-display text-2xl text-white/90 tracking-wide"
                        style={{ textShadow: `0 0 24px ${current.glow}88` }}
                    >
                        3:17 AM
                    </p>
                    <p className="text-[9px] text-white/25 tracking-[0.35em] mt-0.5 uppercase">
                        Midnight Archive
                    </p>
                </div>
                {/* Mobile close button */}
                <button
                    onClick={onClose}
                    className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
                >
                    ✕
                </button>
            </div>

            {/* Current mood pill */}
            <motion.div
                animate={{ boxShadow: `0 0 16px ${current.glow}33` }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                className="mx-2 mb-6 px-3 py-2 rounded-xl flex items-center gap-2"
                style={{
                    background: `${current.glow}10`,
                    border: `1px solid ${current.glow}25`,
                }}
            >
                <span className="text-base">{MOODS[mood].emoji}</span>
                <div>
                    <p className="text-[10px] text-white/25 tracking-widest uppercase leading-none mb-0.5">
                        Tonight
                    </p>
                    <p className="text-xs font-medium" style={{ color: current.glow }}>
                        {MOODS[mood].label}
                    </p>
                </div>
            </motion.div>

            {/* Nav */}
            <nav className="flex flex-col gap-1 flex-1">
                {NAV.map(({ href, label, icon, desc }, i) => {
                    const active = pathname.startsWith(href);
                    return (
                        <motion.div
                            key={href}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={href}
                                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 relative overflow-hidden
                  ${active
                                        ? 'text-white'
                                        : 'text-white/35 hover:text-white/65 hover:bg-white/4'
                                    }
                `}
                                style={active ? {
                                    background: `${current.glow}14`,
                                    border: `1px solid ${current.glow}28`,
                                } : { border: '1px solid transparent' }}
                            >
                                {/* Active glow bar */}
                                {active && (
                                    <motion.div
                                        // layoutId="activeBar"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                                        style={{ background: current.glow, boxShadow: `0 0 8px ${current.glow}` }}
                                    />
                                )}

                                <span
                                    className={`text-base transition-all duration-200 pl-1 ${active ? '' : 'group-hover:scale-110'}`}
                                    style={active ? { color: current.glow, filter: `drop-shadow(0 0 6px ${current.glow})` } : {}}
                                >
                                    {icon}
                                </span>

                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm leading-none ${active ? 'text-white/90' : ''}`}>
                                        {label}
                                    </p>
                                    {active && (
                                        <p className="text-[10px] mt-0.5" style={{ color: `${current.glow}88` }}>
                                            {desc}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Divider */}
            <div
                className="mx-2 my-4 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${current.glow}25, transparent)` }}
            />

            {/* Logout */}
            <motion.button
                onClick={handleLogout}
                disabled={loggingOut}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                className="
          group flex items-center gap-3 px-3 py-2.5 rounded-xl mx-0
          text-white/25 hover:text-pink-400/70
          hover:bg-pink-500/6 border border-transparent
          hover:border-pink-500/15
          transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
          w-full text-left
        "
            >
                <span className="text-base pl-1 transition-all duration-200 group-hover:scale-110">
                    {loggingOut ? (
                        <span className="inline-block w-4 h-4 border border-pink-400/40 border-t-pink-400/80 rounded-full animate-spin" />
                    ) : '↪'}
                </span>
                <div>
                    <p className="text-sm">{loggingOut ? 'Leaving...' : 'Leave the Night'}</p>
                    <p className="text-[10px] text-white/15 group-hover:text-pink-400/30 transition-colors">
                        sign out
                    </p>
                </div>
            </motion.button>

        </div>
    );

    return (
        <>
            {/* ── Desktop: fixed sidebar ── */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-full w-56 flex-col z-40"
                style={{
                    background: 'rgba(7, 8, 22, 0.75)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                }}
            >
                {sidebarContent}
            </aside>

            {/* ── Mobile: drawer + backdrop ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={onClose}
                            className="lg:hidden fixed inset-0 z-40"
                            style={{ background: 'rgba(7, 8, 22, 0.7)', backdropFilter: 'blur(4px)' }}
                        />

                        {/* Drawer */}
                        <motion.aside
                            key="drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
                            className="lg:hidden fixed left-0 top-0 h-full w-64 z-50 flex flex-col"
                            style={{
                                background: 'rgba(7, 8, 22, 0.96)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                                borderRight: '1px solid rgba(255,255,255,0.07)',
                            }}
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}