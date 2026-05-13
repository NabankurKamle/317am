'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Textarea } from '@nextui-org/react';
import { DatePicker } from '@nextui-org/react';
import { parseDate, today, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { capsulesService } from '@/services/capsules.service';
import { MOODS, type MoodKey } from '@/config/moods';
import { toast } from 'sonner';

// ─── Capsule Card ─────────────────────────────────────────────────────────────
function CapsuleCard({
    capsule,
    onRelease,
    onOpen,
}: {
    capsule: any;
    onRelease: (id: string) => void;
    onOpen: (capsule: any) => void;
}) {
    const [confirming, setConfirming] = useState(false);
    const [releasing, setReleasing] = useState(false);

    const now = Date.now();
    const unlockTime = new Date(capsule.unlockAt).getTime();
    const isUnlocked = now >= unlockTime;
    const daysLeft = Math.ceil((unlockTime - now) / 86400000);
    const unlockLabel = new Date(capsule.unlockAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
    const glow = isUnlocked
        ? '#7DD3FC'
        : capsule.mood
            ? MOODS[capsule.mood as MoodKey]?.glow ?? '#ffffff22'
            : '#ffffff22';

    const handleRelease = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirming) {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 3000);
            return;
        }
        setReleasing(true);
        await onRelease(capsule._id);
        setReleasing(false);
        setConfirming(false);
    };

    const cancelConfirm = (e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirming(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        >
            <GlassCard
                glow={glow}
                className="group relative h-full min-h-[200px] flex flex-col gap-3"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl text-white/75 leading-tight">
                        {capsule.title || "Unnamed Capsule"}
                    </h3>

                    {/* Status badge */}
                    <span
                        className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 ${isUnlocked
                            ? "bg-sky-400/15 border border-sky-400/35 text-sky-400"
                            : "bg-white/5 border border-white/10 text-white/30"
                            }`}
                    >
                        {isUnlocked ? "⟁ Open" : `⟁ ${daysLeft}d`}
                    </span>
                </div>

                {/* CONTENT (fixed-height block → prevents layout shift) */}
                <div className={`flex-1 min-h-[80px] flex flex-col ${isUnlocked ? "justify-start" : "justify-center"} `}>
                    {isUnlocked ? (
                        <p className="text-white/45 text-sm leading-relaxed line-clamp-3">
                            {capsule.content}
                        </p>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2 select-none">
                            <p className="text-white/10 text-3xl">⟁</p>
                            <p className="text-white/15 text-xs text-center italic">
                                Sealed until {unlockLabel}
                            </p>

                            {daysLeft <= 7 && (
                                <p className="text-white/25 text-[11px]">
                                    Opens in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Mood badge */}
                {capsule.mood && (
                    <span
                        className="text-xs flex items-center gap-1.5 w-fit"
                        style={{
                            color: `${MOODS[capsule.mood as MoodKey]?.glow}88`,
                        }}
                    >
                        {MOODS[capsule.mood as MoodKey]?.emoji}{" "}
                        {MOODS[capsule.mood as MoodKey]?.label}
                    </span>
                )}

                {/* Song */}
                {capsule.song && isUnlocked && (
                    <p className="text-white/25 text-xs flex items-center gap-1.5">
                        <span>♪</span> {capsule.song}
                    </p>
                )}

                {/* Footer (pinned) */}
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-white/20 text-[11px]">{unlockLabel}</span>

                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Open */}
                        {isUnlocked && (
                            <button
                                onClick={() => onOpen(capsule)}
                                className="text-[11px] text-white/25 hover:text-white/55 transition-colors"
                            >
                                Open
                            </button>
                        )}

                        {/* Release with confirmation */}
                        {isUnlocked && (
                            <AnimatePresence mode="wait">
                                {confirming ? (
                                    <motion.div
                                        key="confirm"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center gap-1.5"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span className="text-[11px] text-white/30">sure?</span>

                                        <button
                                            onClick={handleRelease}
                                            disabled={releasing}
                                            className="text-[11px] px-2 py-0.5 rounded-full transition-all"
                                            style={{
                                                background: "rgba(236,72,153,0.15)",
                                                border: "1px solid rgba(236,72,153,0.35)",
                                                color: "#EC4899",
                                            }}
                                        >
                                            {releasing ? "..." : "Yes"}
                                        </button>

                                        <button
                                            onClick={cancelConfirm}
                                            className="text-[11px] text-white/25 hover:text-white/50 transition-colors"
                                        >
                                            No
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="default"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={handleRelease}
                                        className="text-[11px] text-white/20 hover:text-pink-400/60 transition-colors"
                                    >
                                        Let Go
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}

// ─── Capsule Modal ────────────────────────────────────────────────────────────
function CapsuleModal({
    capsule,
    onClose,
}: {
    capsule: any;
    onClose: () => void;
}) {
    const glow = capsule.mood
        ? MOODS[capsule.mood as MoodKey]?.glow ?? '#7DD3FC'
        : '#7DD3FC';

    const unlockLabel = new Date(capsule.unlockAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const createdLabel = new Date(capsule.createdAt).toLocaleDateString('en-US', {
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

            {/* Panel */}
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
                        border: `1px solid ${glow}30`,
                        boxShadow: `0 0 60px ${glow}18`,
                    }}
                >
                    {/* Glow top edge */}
                    <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${glow}80, transparent)`,
                        }}
                    />

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
                        <div className="min-w-0 flex-1">
                            {/* Unsealed badge */}
                            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full mb-3 bg-sky-400/15 border border-sky-400/35 text-sky-400">
                                ⟁ Unsealed · {unlockLabel}
                            </span>

                            <h2 className="font-display text-2xl sm:text-3xl text-white/85 leading-tight mb-2">
                                {capsule.title || 'Unnamed Capsule'}
                            </h2>

                            <div className="flex items-center flex-wrap gap-2">
                                {/* Mood badge */}
                                {capsule.mood && (
                                    <span
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                                        style={{
                                            background: `${glow}18`,
                                            border: `1px solid ${glow}44`,
                                            color: glow,
                                        }}
                                    >
                                        {MOODS[capsule.mood as MoodKey]?.emoji}{' '}
                                        {MOODS[capsule.mood as MoodKey]?.label}
                                    </span>
                                )}
                                <span className="text-white/20 text-xs">{createdLabel}</span>
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
                            {capsule.content}
                        </p>

                        {/* Song */}
                        {capsule.song && (
                            <div
                                className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl"
                                style={{
                                    background: `${glow}10`,
                                    border: `1px solid ${glow}25`,
                                }}
                            >
                                <span className="text-white/40">♪</span>
                                <span className="text-white/50 text-sm">{capsule.song}</span>
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CapsulesPage() {
    const [capsules, setCapsules] = useState<any[]>([]);
    const [composing, setComposing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeCapsule, setActiveCapsule] = useState<any | null>(null);
    const [form, setForm] = useState<{
        title: string;
        content: string;
        unlockAt: CalendarDate | null;
        mood: MoodKey | '';
    }>({
        title: '', content: '', unlockAt: null, mood: '',
    });

    const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

    useEffect(() => {
        capsulesService.getAll()
            .then(setCapsules)
            .catch(() => toast.error('Could not load capsules', { description: 'Try refreshing.' }))
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async () => {
        if (!form.content.trim()) {
            toast.error('Empty capsule', { description: 'Your capsule needs a message.' });
            return;
        }
        if (!form.unlockAt) {
            toast.error('No unlock date', { description: 'Choose when to open this capsule.' });
            return;
        }
        setSaving(true);
        try {
            const payload = {
                title: form.title || undefined,
                content: form.content,
                unlockAt: form.unlockAt.toString(),   // "2026-12-25" — server accepts this
                mood: form.mood || undefined,
            };
            const c = await capsulesService.create(payload);
            setCapsules(prev => [c, ...prev]);
            setComposing(false);
            setForm({ title: '', content: '', unlockAt: null, mood: '' });
            toast.success('Capsule sealed', { description: 'It will open when the time comes.' });
        } catch (e: any) {
            toast.error(
                'Could not seal capsule',
                { description: e?.response?.data?.message || 'Something went wrong.' }
            );
        } finally {
            setSaving(false);
        }
    };

    const handleRelease = async (id: string) => {
        try {
            await capsulesService.release(id);
            setCapsules(prev => prev.filter(c => c._id !== id));
            toast.success('Capsule released', { description: 'It faded into the night.' });
        } catch {
            toast.error('Could not release', { description: 'Try again.' });
        }
    };

    const sealed = capsules.filter(c => new Date(c.unlockAt).getTime() > Date.now());
    const unlocked = capsules.filter(c => new Date(c.unlockAt).getTime() <= Date.now());

    return (
        <AppShell>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-4xl text-white/80">Time Capsules</h1>
                    <p className="text-white/30 text-sm mt-1">
                        Letters to your future self, sealed until the right moment.
                    </p>
                </div>
                <NeonButton
                    onClick={() => setComposing(c => !c)}
                    glowColor="#7DD3FC"
                    variant="bordered"
                    size="sm"
                    className="flex-shrink-0"
                >
                    {composing ? 'Cancel' : '+ Seal a Capsule'}
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
                        <GlassCard glow="#7DD3FC" className="flex flex-col gap-4">
                            <p className="text-white/35 text-xs tracking-widest uppercase">New Time Capsule</p>

                            <Input
                                label="Title (optional)"
                                placeholder="a note to your future self..."
                                value={form.title}
                                variant='bordered'
                                onValueChange={set('title')}
                                classNames={{
                                    label: 'text-white/35 text-xs',
                                    input: 'bg-transparent text-white/75 placeholder:text-white/15',
                                    inputWrapper: 'bg-white/4 border border-white/8 focus-within:!border-sky-400/50',
                                }}
                            />

                            <Textarea
                                label="Your message"
                                placeholder="write to who you'll become..."
                                value={form.content}
                                variant='bordered'
                                onValueChange={set('content')}
                                minRows={6}
                                classNames={{
                                    label: 'text-white/35 text-xs',
                                    input: 'bg-transparent text-white/70 placeholder:text-white/12 leading-relaxed',
                                    inputWrapper: 'bg-white/4 border border-white/8 focus-within:!border-sky-400/50',
                                }}
                            />

                            {/* Mood picker */}
                            <div>
                                <p className="text-white/35 text-xs tracking-widest uppercase mb-2">
                                    Mood (optional)
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {(Object.keys(MOODS) as MoodKey[]).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setForm(f => ({ ...f, mood: f.mood === m ? '' : m }))}
                                            className="text-xs px-3 py-1.5 rounded-full transition-all"
                                            style={{
                                                background: form.mood === m ? `${MOODS[m].glow}20` : 'rgba(255,255,255,0.04)',
                                                border: `1px solid ${form.mood === m ? MOODS[m].glow + '50' : 'rgba(255,255,255,0.08)'}`,
                                                color: form.mood === m ? MOODS[m].glow : 'rgba(255,255,255,0.35)',
                                            }}
                                        >
                                            {MOODS[m].emoji} {MOODS[m].label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <p className="text-white/35 text-xs tracking-widest uppercase px-1">
                                    Unlock Date
                                </p>
                                <DatePicker
                                    aria-label="Unlock date"
                                    value={form.unlockAt}
                                    onChange={(date) => setForm(f => ({ ...f, unlockAt: date }))}
                                    minValue={today(getLocalTimeZone()).add({ days: 1 })}
                                    showMonthAndYearPickers
                                    size='lg'
                                    variant='bordered'
                                    classNames={{
                                        base: 'w-full',
                                        inputWrapper: [
                                            'bg-white/4',
                                            'border border-white/8',
                                            'hover:border-white/20',
                                            'focus-within:!border-sky-400/50',
                                            'rounded-xl',
                                            'shadow-none',
                                            '!transition-colors',
                                        ].join(' '),
                                        input: 'text-white/70',
                                        innerWrapper: 'bg-transparent',
                                        segment: 'text-white/70 data-[placeholder]:text-white/20',
                                        selectorButton: [
                                            'text-white/30',
                                            'hover:text-sky-400/70',
                                            'hover:bg-white/5',
                                            'transition-colors',
                                            'data-[pressed]:bg-white/8',
                                        ].join(' '),
                                        selectorIcon: 'text-white/30',
                                        popoverContent: [
                                            'bg-[#0B1020]',
                                            'border border-white/10',
                                            'backdrop-blur-xl',
                                            'rounded-2xl',
                                            'shadow-xl',
                                            'shadow-black/40',
                                            'text-white/80',
                                        ].join(' '),
                                        calendar: 'bg-transparent',
                                        calendarContent: 'bg-transparent',
                                    }}
                                />
                            </div>

                            <NeonButton
                                onClick={handleCreate}
                                isLoading={saving}
                                glowColor="#7DD3FC"
                                style={{ borderColor: '#7DD3FC44', color: '#7DD3FC', background: '#7DD3FC11' }}
                            >
                                Seal the Capsule
                            </NeonButton>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty state */}
            {!loading && capsules.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24"
                >
                    <p className="font-display text-5xl text-white/10 mb-4">⟁</p>
                    <p className="text-white/25 text-sm">No capsules sealed yet.</p>
                    <p className="text-white/15 text-xs mt-1">Write a letter to who you'll become.</p>
                </motion.div>
            )}

            {/* Loading skeleton */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="glass rounded-2xl h-48 animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            )}

            {/* ── Unsealed / opened capsules ── */}
            {!loading && unlocked.length > 0 && (
                <div className="mb-8">
                    <p className="text-[10px] text-sky-400/50 tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                        <span className="inline-block w-1 h-1 rounded-full bg-sky-400/50" />
                        Opened · {unlocked.length}
                    </p>
                    <AnimatePresence>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {unlocked.map(c => (
                                <CapsuleCard key={c._id} capsule={c} onRelease={handleRelease} onOpen={setActiveCapsule} />
                            ))}
                        </div>
                    </AnimatePresence>
                </div>
            )}

            {/* ── Sealed capsules ── */}
            {!loading && sealed.length > 0 && (
                <div>
                    <p className="text-[10px] text-white/25 tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                        <span className="inline-block w-1 h-1 rounded-full bg-white/20" />
                        Sealed · {sealed.length}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {sealed.map(c => (
                            <CapsuleCard key={c._id} capsule={c} onRelease={handleRelease} onOpen={setActiveCapsule} />
                        ))}
                    </div>
                </div>
            )}
            {activeCapsule && (
                <CapsuleModal
                    capsule={activeCapsule}
                    onClose={() => setActiveCapsule(null)}
                />
            )}
        </AppShell>
    );
}