'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea, Input } from '@nextui-org/react';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { MoodBadge } from '@/components/ui/MoodBadge';
import { echoesService } from '@/services/echoes.service';
import { MOODS, type MoodKey } from '@/config/moods';
import { toast } from 'sonner';

function EchoCard({ echo, onDissolve }: { echo: any; onDissolve: (id: string) => void }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
            <GlassCard glow="#A855F7" className="group cursor-pointer" onClick={() => setOpen(o => !o)}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <motion.span
                            animate={{ rotateX: open ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-glow-purple text-lg inline-block"
                        >
                            ✉
                        </motion.span>
                        <div>
                            <p className="text-white/70 text-sm font-medium">To: {echo.to || 'Someone'}</p>
                            {echo.subject && <p className="text-white/30 text-xs">{echo.subject}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {echo.mood && <MoodBadge mood={echo.mood as MoodKey} />}
                        <span className="text-white/20 text-xs">
                            {new Date(echo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 border-t border-white/6 mt-2">
                                <p className="text-white/55 text-sm leading-relaxed whitespace-pre-wrap">{echo.content}</p>
                                <button
                                    onClick={e => { e.stopPropagation(); onDissolve(echo._id); }}
                                    className="mt-4 text-[11px] text-white/20 hover:text-pink-400/60 transition-colors"
                                >
                                    Dissolve this echo
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>
        </motion.div>
    );
}

export default function EchoesPage() {
    const [echoes, setEchoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [composing, setComposing] = useState(false);
    const [form, setForm] = useState({ to: '', subject: '', content: '', mood: 'lonely' as MoodKey });
    const [saving, setSaving] = useState(false);


    const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

    useEffect(() => {
        echoesService.getAll().then(setEchoes).finally(() => setLoading(false));
    }, []);

    const handleSend = async () => {
        if (!form.content.trim()) return;
        setSaving(true);
        try {
            const echo = await echoesService.create(form);
            setEchoes(prev => [echo, ...prev]);
            setComposing(false);
            setForm({ to: '', subject: '', content: '', mood: 'lonely' });
            toast.success('Echo sealed', { description: 'Your unsent words are safe.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDissolve = async (id: string) => {
        await echoesService.dissolve(id);
        setEchoes(prev => prev.filter(e => e._id !== id));
        toast.success('Echo dissolved', { description: 'It faded into the night.' });
    };

    return (
        <AppShell>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-4xl text-white/80">Echoes</h1>
                    <p className="text-white/30 text-sm mt-1">Messages you'll never send.</p>
                </div>
                <NeonButton onClick={() => setComposing(c => !c)} color="secondary" glowColor="#EC4899" size="sm">
                    {composing ? 'Cancel' : '+ Write an Echo'}
                </NeonButton>
            </div>

            {/* Compose panel */}
            <AnimatePresence>
                {composing && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="mb-8"
                    >
                        <GlassCard glow="#A855F7" className="flex flex-col gap-4">
                            <p className="text-white/40 text-xs tracking-widest uppercase">Unsent Letter</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="To" placeholder="a name, a memory..." value={form.to} onValueChange={set('to')}
                                    classNames={{ label: 'text-white/35 text-xs', input: 'bg-transparent text-white/75 placeholder:text-white/15', inputWrapper: 'bg-white/4 border border-white/8 focus-within:!border-glow-purple/50' }} />
                                <Input label="Subject (optional)" placeholder="left unsaid..." value={form.subject} onValueChange={set('subject')}
                                    classNames={{ label: 'text-white/35 text-xs', input: 'bg-transparent text-white/75 placeholder:text-white/15', inputWrapper: 'bg-white/4 border border-white/8 focus-within:!border-glow-purple/50' }} />
                            </div>
                            <Textarea label="What would you say?" placeholder="write freely..." value={form.content} onValueChange={set('content')} minRows={5}
                                classNames={{ label: 'text-white/35 text-xs', input: 'bg-transparent text-white/70 placeholder:text-white/12 leading-relaxed', inputWrapper: 'bg-white/4 border border-white/8 focus-within:!border-glow-purple/50' }} />
                            <div className="flex flex-wrap gap-2">
                                {(Object.keys(MOODS) as MoodKey[]).map(m => (
                                    <button key={m} onClick={() => setForm(f => ({ ...f, mood: m }))}
                                        className="text-xs px-3 py-1 rounded-full transition-all"
                                        style={{
                                            background: form.mood === m ? `${MOODS[m].glow}22` : 'rgba(255,255,255,0.04)',
                                            border: `1px solid ${form.mood === m ? MOODS[m].glow + '55' : 'rgba(255,255,255,0.08)'}`,
                                            color: form.mood === m ? MOODS[m].glow : 'rgba(255,255,255,0.35)',
                                        }}
                                    >
                                        {MOODS[m].emoji} {MOODS[m].label}
                                    </button>
                                ))}
                            </div>
                            <NeonButton onClick={handleSend} isLoading={saving} color="secondary" glowColor="#A855F7">
                                Seal this Echo
                            </NeonButton>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            {loading ? (
                <div className="flex flex-col gap-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="glass rounded-2xl h-16 animate-pulse" />)}
                </div>
            ) : echoes.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                    <p className="font-display text-5xl text-white/10 mb-4">✉</p>
                    <p className="text-white/25 text-sm">No unsent words yet.</p>
                </motion.div>
            ) : (
                <AnimatePresence>
                    <div className="flex flex-col gap-3">
                        {echoes.map(e => <EchoCard key={e._id} echo={e} onDissolve={handleDissolve} />)}
                    </div>
                </AnimatePresence>
            )}
        </AppShell>
    );
}