import { MOODS, type MoodKey } from '@/config/moods';

export function MoodBadge({ mood }: { mood: MoodKey }) {
    const m = MOODS[mood];
    return (
        <span
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
            style={{
                background: `${m.glow}18`,
                border: `1px solid ${m.glow}44`,
                color: m.glow,
            }}
        >
            {m.emoji} {m.label}
        </span>
    );
}