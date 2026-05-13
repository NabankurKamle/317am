
export const MOODS = {
    lonely: { label: 'Lonely', glow: '#7DD3FC', gradient: 'from-blue-900/30 to-slate-900/60', emoji: '🌧' },
    nostalgic: { label: 'Nostalgic', glow: '#A855F7', gradient: 'from-purple-900/30 to-night-900/60', emoji: '🌙' },
    calm: { label: 'Calm', glow: '#6EE7B7', gradient: 'from-emerald-900/20 to-night-900/60', emoji: '🌿' },
    hopeful: { label: 'Hopeful', glow: '#FCD34D', gradient: 'from-amber-900/20 to-night-900/60', emoji: '✨' },
    chaotic: { label: 'Chaotic', glow: '#EC4899', gradient: 'from-pink-900/30 to-night-900/60', emoji: '⚡' },
    dreamy: { label: 'Dreamy', glow: '#8B5CF6', gradient: 'from-violet-900/30 to-night-900/60', emoji: '💫' },
} as const;

export type MoodKey = keyof typeof MOODS;