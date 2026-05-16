export type BackgroundMode =
    | 'starfield'        // current default — slow twinkling stars
    | 'shooting'         // shooting stars across the sky
    | 'glitter'          // dense fast-twinkling glitter field
    | 'aurora'           // slow drifting northern-lights waves
    | 'void'             // pure dark, no animation — maximum focus

export interface BackgroundOption {
    id: BackgroundMode;
    label: string;
    emoji: string;
    desc: string;          // shown as tooltip / subtitle
    vibe: string;          // message shown when user picks it
}

export const BACKGROUNDS: BackgroundOption[] = [
    {
        id: 'starfield',
        label: 'Quiet Sky',
        emoji: '✦',
        desc: 'slow twinkling stars',
        vibe: 'The night breathes slowly around you.',
    },
    {
        id: 'shooting',
        label: 'Passing Through',
        emoji: '☄',
        desc: 'shooting stars',
        vibe: 'Everything is fleeting. Even the brightest things.',
    },
    {
        id: 'glitter',
        label: 'Glittering',
        emoji: '✧',
        desc: 'glittering star field',
        vibe: 'A thousand tiny lights, all awake like you.',
    },
    {
        id: 'aurora',
        label: 'Aurora',
        emoji: '◈',
        desc: 'drifting northern lights',
        vibe: 'Some things are too quiet to name.',
    },
    {
        id: 'void',
        label: 'The Void',
        emoji: '○',
        desc: 'pure darkness',
        vibe: 'Just you, and the silence.',
    },
];

export const DEFAULT_BACKGROUND: BackgroundMode = 'starfield';
export const BACKGROUND_STORAGE_KEY = '317am_bg';