'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@nextui-org/react';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useMood } from '@/providers/MoodProvider';
import { MOODS, type MoodKey } from '@/config/moods';
import api from '@/services/api';
import { toast } from 'sonner';

export default function AtmospherePage() {
    const { mood: currentMood, setMood } = useMood();
    const [history, setHistory] = useState<any[]>([]);
    const [selected, setSelected] = useState<MoodKey>(currentMood);
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        api.get('/atmosphere').then(r => setHistory(r.data));
    }, []);

    const handleLog = async () => {
        setSaving(true);
        try {
            const entry = await api.post('/atmosphere', { mood: selected, note }).then(r => r.data);
            setHistory(prev => [entry, ...prev]);
            setMood(selected);
            setNote('');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            toast.success(`${MOODS[selected].emoji} ${MOODS[selected].label}`, { description: 'Atmosphere captured.' });
        } finally {
            setSaving(false);
        }
    };

    const moodCounts = history.reduce((acc: Record<string, number>, e) => {
        acc[e.mood] = (acc[e.mood] || 0) + 1;
        return acc;
    }, {});
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

    return (
        <AppShell>
            <div className="mb-8">
                <h1 className="font-display text-4xl text-white/80">Atmosphere</h1>
                <p className="text-white/30 text-sm mt-1">How does tonight feel?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Log mood */}
                <div className="lg:col-span-2">
                    <GlassCard glow={MOODS[selected].glow} className="flex flex-col gap-6">
                        <p className="text-white/35 text-xs tracking-widest uppercase">Log Your Atmosphere</p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {(Object.keys(MOODS) as MoodKey[]).map(m => (
                                <motion.button
                                    key={m}
                                    onClick={() => setSelected(m)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative p-4 rounded-xl text-left transition-all duration-300 overflow-hidden"
                                    style={{
                                        background: selected === m ? `${MOODS[m].glow}15` : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${selected === m ? MOODS[m].glow + '55' : 'rgba(255,255,255,0.07)'}`,
                                        boxShadow: selected === m ? `0 0 20px ${MOODS[m].glow}20` : 'none',
                                    }}
                                >
                                    <span className="text-2xl block mb-1">{MOODS[m].emoji}</span>
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: selected === m ? MOODS[m].glow : 'rgba(255,255,255,0.45)' }}
                                    >
                                        {MOODS[m].label}
                                    </span>
                                    {moodCounts[m] && (
                                        <span
                                            className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full"
                                            style={{ background: `${MOODS[m].glow}22`, color: `${MOODS[m].glow}99` }}
                                        >
                                            ×{moodCounts[m]}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        <Textarea
                            label="Add a note (optional)"
                            placeholder="what's making you feel this way..."
                            value={note}
                            onValueChange={setNote}
                            minRows={3}
                            classNames={{
                                label: 'text-white/35 text-xs',
                                input: 'bg-transparent text-white/70 placeholder:text-white/12 leading-relaxed',
                                inputWrapper: 'bg-white/4 border border-white/8 focus-within:!border-glow-violet/50',
                            }}
                        />

                        <AnimatePresence mode="wait">
                            {saved ? (
                                <motion.p
                                    key="saved"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="text-center text-sm"
                                    style={{ color: MOODS[selected].glow }}
                                >
                                    {MOODS[selected].emoji} Atmosphere logged.
                                </motion.p>
                            ) : (
                                <NeonButton
                                    key="btn"
                                    onClick={handleLog}
                                    isLoading={saving}
                                    glowColor={MOODS[selected].glow}
                                    style={{ background: `${MOODS[selected].glow}22`, borderColor: `${MOODS[selected].glow}55`, color: MOODS[selected].glow }}
                                >
                                    Log Atmosphere
                                </NeonButton>
                            )}
                        </AnimatePresence>
                    </GlassCard>
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-4">
                    {topMood && (
                        <GlassCard glow={MOODS[topMood[0] as MoodKey]?.glow}>
                            <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Most Felt</p>
                            <p className="text-4xl mb-1">{MOODS[topMood[0] as MoodKey]?.emoji}</p>
                            <p className="font-display text-2xl" style={{ color: MOODS[topMood[0] as MoodKey]?.glow }}>
                                {MOODS[topMood[0] as MoodKey]?.label}
                            </p>
                            <p className="text-white/25 text-xs mt-1">{topMood[1]} times</p>
                        </GlassCard>
                    )}
                    <GlassCard>
                        <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Recent Atmospheres</p>
                        <div className="flex flex-col gap-2">
                            {history.slice(0, 8).map(e => (
                                <div key={e._id} className="flex items-center justify-between">
                                    <span className="text-sm flex items-center gap-2">
                                        <span>{MOODS[e.mood as MoodKey]?.emoji}</span>
                                        <span className="text-white/45">{MOODS[e.mood as MoodKey]?.label}</span>
                                    </span>
                                    <span className="text-white/20 text-[11px]">
                                        {new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            ))}
                            {history.length === 0 && <p className="text-white/20 text-xs">No logs yet.</p>}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AppShell>
    );
}