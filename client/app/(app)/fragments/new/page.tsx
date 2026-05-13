'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { fragmentsService } from '@/services/fragments.service';
import { MOODS, type MoodKey } from '@/config/moods';
import { toast } from 'sonner';

const GLOW_PRESETS = [
    '#8B5CF6', '#EC4899', '#7DD3FC', '#6EE7B7', '#FCD34D', '#F87171',
];

export default function NewFragmentPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<MoodKey>('calm');
    const [glow, setGlow] = useState('#8B5CF6');
    const [song, setSong] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!content.trim()) {
            toast.error('Empty fragment', { description: 'A fragment needs something inside it.' });
            return;
        }
        setSaving(true);
        try {
            await fragmentsService.create({ title, content, mood, glowColor: glow, song });
            toast.success(
                title ? `"${title}" saved` : 'Fragment saved',
                { description: 'Left behind in the archive.' }
            );
            router.push('/fragments');
        } catch {
            toast.error('Lost in the night', { description: 'Could not save your fragment. Try again.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppShell>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
            >
                <div className="mb-8">
                    <h1 className="font-display text-4xl text-white/80">Leave a Fragment</h1>
                    <p className="text-white/30 text-sm mt-1">No judgement. Just the night.</p>
                </div>

                <GlassCard glow={glow} className="flex flex-col gap-6">
                    {/* Title */}
                    <Input
                        label="Title (optional)"
                        placeholder="untitled thought..."
                        value={title}
                        onValueChange={setTitle}
                        classNames={{
                            label: 'text-white/35 text-xs tracking-wide',
                            input: 'bg-transparent text-white/80 text-lg font-display placeholder:text-white/15',
                            inputWrapper: 'bg-white/4 border border-white/8 hover:border-white/20 focus-within:!border-glow-violet/50',
                        }}
                    />

                    {/* Content */}
                    <Textarea
                        label="What's on your mind?"
                        placeholder="let it out..."
                        value={content}
                        onValueChange={setContent}
                        minRows={6}
                        classNames={{
                            label: 'text-white/35 text-xs tracking-wide',
                            input: 'bg-transparent text-white/75 placeholder:text-white/12 leading-relaxed',
                            inputWrapper: 'bg-white/4 border border-white/8 hover:border-white/20 focus-within:!border-glow-violet/50',
                        }}
                    />

                    {/* Mood */}
                    <div>
                        <p className="text-white/35 text-xs tracking-widest uppercase mb-3">Mood</p>
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(MOODS) as MoodKey[]).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMood(m)}
                                    className="transition-all duration-200"
                                >
                                    <span
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all"
                                        style={{
                                            background: mood === m ? `${MOODS[m].glow}22` : 'rgba(255,255,255,0.04)',
                                            border: `1px solid ${mood === m ? MOODS[m].glow + '66' : 'rgba(255,255,255,0.08)'}`,
                                            color: mood === m ? MOODS[m].glow : 'rgba(255,255,255,0.35)',
                                            boxShadow: mood === m ? `0 0 12px ${MOODS[m].glow}22` : 'none',
                                        }}
                                    >
                                        {MOODS[m].emoji} {MOODS[m].label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Glow color */}
                    <div>
                        <p className="text-white/35 text-xs tracking-widest uppercase mb-3">Glow Color</p>
                        <div className="flex gap-3">
                            {GLOW_PRESETS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setGlow(c)}
                                    className="w-7 h-7 rounded-full transition-all duration-200"
                                    style={{
                                        background: c,
                                        boxShadow: glow === c ? `0 0 16px ${c}99` : 'none',
                                        transform: glow === c ? 'scale(1.25)' : 'scale(1)',
                                        outline: glow === c ? `2px solid ${c}66` : 'none',
                                        outlineOffset: '2px',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Song (optional) */}
                    <Input
                        label="Attach a song (optional)"
                        placeholder="song name or link..."
                        value={song}
                        onValueChange={setSong}
                        startContent={<span className="text-white/30 text-sm">♪</span>}
                        classNames={{
                            label: 'text-white/35 text-xs tracking-wide',
                            input: 'bg-transparent text-white/70 placeholder:text-white/15',
                            inputWrapper: 'bg-white/4 border border-white/8 hover:border-white/20 focus-within:!border-glow-violet/50',
                        }}
                    />

                    {error && <p className="text-pink-400/80 text-xs">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <NeonButton onClick={handleSave} isLoading={saving} color="primary" glowColor={glow} className="flex-1">
                            Save Fragment
                        </NeonButton>
                        <NeonButton onClick={() => router.back()} variant="bordered" glowColor="#ffffff22" className="px-6">
                            Discard
                        </NeonButton>
                    </div>
                </GlassCard>
            </motion.div>
        </AppShell>
    );
}