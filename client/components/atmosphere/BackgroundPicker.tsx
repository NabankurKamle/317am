'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBackground } from '@/providers/BackgroundProvider';
import { BACKGROUNDS } from '@/config/backgrounds';
import { toast } from 'sonner';

export function BackgroundPicker() {
    const { mode, setMode } = useBackground();
    const [open, setOpen] = useState(false);

    const current = BACKGROUNDS.find(b => b.id === mode)!;

    const handlePick = (b: typeof BACKGROUNDS[0]) => {
        setMode(b.id);
        setOpen(false);
        toast.info(b.label, { description: b.vibe, duration: 3500 });
    };

    return (
        <div className="relative mx-0 mb-3">
            {/* Trigger */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                   text-white/25 hover:text-white/55 hover:bg-white/4
                   border border-transparent hover:border-white/8
                   transition-all duration-200 group"
            >
                <span className="text-base pl-1 group-hover:scale-110 transition-transform duration-200">
                    {current.emoji}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm leading-none">{current.label}</p>
                    <p className="text-[10px] text-white/15 mt-0.5">{current.desc}</p>
                </div>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] text-white/15"
                >
                    ▲
                </motion.span>
            </button>

            {/* Popover — opens upward */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-30"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.18 }}
                            className="absolute bottom-full left-0 right-0 mb-2 z-40 rounded-2xl overflow-hidden"
                            style={{
                                background: 'rgba(7, 8, 22, 0.97)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
                            }}
                        >
                            <p className="text-[9px] text-white/20 tracking-[0.35em] uppercase px-4 pt-3 pb-2">
                                Night Sky
                            </p>

                            {BACKGROUNDS.map(b => {
                                const active = b.id === mode;
                                return (
                                    <button
                                        key={b.id}
                                        onClick={() => handlePick(b)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-150
                               hover:bg-white/5 text-left"
                                    >
                                        <span
                                            className="text-base w-6 text-center flex-shrink-0"
                                            style={active ? { filter: 'drop-shadow(0 0 4px rgba(139,92,246,0.8))' } : {}}
                                        >
                                            {b.emoji}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-sm leading-none"
                                                style={{ color: active ? '#A78BFA' : 'rgba(255,255,255,0.6)' }}
                                            >
                                                {b.label}
                                            </p>
                                            <p className="text-[10px] text-white/20 mt-0.5">{b.desc}</p>
                                        </div>
                                        {active && (
                                            <span className="text-[10px] text-glow-violet flex-shrink-0">✦</span>
                                        )}
                                    </button>
                                );
                            })}

                            <div className="h-2" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}