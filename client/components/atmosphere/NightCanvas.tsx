'use client';
import { useEffect, useRef } from 'react';
import { useBackground } from '@/providers/BackgroundProvider';
import type { BackgroundMode } from '@/config/backgrounds';

export function NightCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { mode } = useBackground();

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        let cleanup: (() => void) | undefined;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        switch (mode as BackgroundMode) {
            case 'starfield': cleanup = drawStarfield(canvas, ctx); break;
            case 'shooting': cleanup = drawShooting(canvas, ctx); break;
            case 'glitter': cleanup = drawGlitter(canvas, ctx); break;
            case 'aurora': cleanup = drawAurora(canvas, ctx); break;
            case 'void':
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                break;
        }

        return () => {
            window.removeEventListener('resize', resize);
            cleanup?.();
        };
    }, [mode]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Convert a 6-digit hex color + 0–1 alpha → rgba() string — no parsing issues
function hexAlpha(hex: string, alpha: number): string {
    const a = Math.max(0, Math.min(1, alpha));   // clamp [0,1]
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

// ─── Starfield ────────────────────────────────────────────────────────────────
function drawStarfield(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.004 + 0.002,
    }));

    let frame: number;
    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.a += s.speed;
            const alpha = (Math.sin(s.a) + 1) / 2;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(229,221,255,${(alpha * 0.7).toFixed(3)})`;
            ctx.fill();
        });
        frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
}

// ─── Shooting stars ───────────────────────────────────────────────────────────
function drawShooting(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 0.9 + 0.2,
        a: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.003 + 0.001,
    }));

    type Meteor = {
        x: number; y: number;
        vx: number; vy: number;
        len: number; life: number; maxLife: number;
        color: string;
    };

    const meteors: Meteor[] = [];
    // Plain hex colors — parsed by hexAlpha helper, never concatenated raw
    const COLORS = ['#E9D5FF', '#7DD3FC', '#F9A8D4', '#C4B5FD'];

    const spawnMeteor = () => {
        const angle = (Math.random() * 20 + 15) * (Math.PI / 180);
        const speed = Math.random() * 8 + 6;
        const maxLife = Math.random() * 40 + 30;
        meteors.push({
            x: Math.random() * canvas.width * 1.2 - canvas.width * 0.1,
            y: Math.random() * canvas.height * 0.4,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            len: Math.random() * 80 + 60,
            life: 0,
            maxLife,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
    };

    let spawnTimer = 0;
    let frame: number;

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Static background stars
        stars.forEach(s => {
            s.a += s.speed;
            const alpha = (Math.sin(s.a) + 1) / 2;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(229,221,255,${(alpha * 0.5).toFixed(3)})`;
            ctx.fill();
        });

        // Spawn
        spawnTimer++;
        if (spawnTimer > 60 + Math.random() * 45) {
            spawnMeteor();
            spawnTimer = 0;
        }

        // Draw meteors
        for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            m.life++;
            m.x += m.vx;
            m.y += m.vy;

            const progress = m.life / m.maxLife;

            // Fade in over first 20%, hold, fade out over last 30%
            const alpha = Math.max(0, progress < 0.2
                ? progress / 0.2
                : progress > 0.7
                    ? (1 - progress) / 0.3
                    : 1);

            const tailX = m.x - m.vx * (m.len / 8);
            const tailY = m.y - m.vy * (m.len / 8);

            const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
            // Use hexAlpha helper — no string concatenation of hex + raw numbers
            grad.addColorStop(0, hexAlpha(m.color, alpha * 0.86));
            grad.addColorStop(1, hexAlpha(m.color, 0));

            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = Math.max(0.5, (1 - progress) * 1.8);
            ctx.stroke();

            if (m.life >= m.maxLife) meteors.splice(i, 1);
        }

        frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
}

// ─── Glitter ──────────────────────────────────────────────────────────────────
function drawGlitter(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const COLORS = ['#E9D5FF', '#7DD3FC', '#F9A8D4', '#C4B5FD', '#FDE68A', '#ffffff'];

    const particles = Array.from({ length: 320 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.004,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let frame: number;
    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.a += p.speed;
            const raw = (Math.sin(p.a) + 1) / 2;
            // Sharp glitter flash — below threshold = invisible
            const alpha = raw > 0.6 ? Math.pow((raw - 0.6) / 0.4, 0.5) * 0.9 : 0;
            if (alpha < 0.02) return;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = hexAlpha(p.color, alpha);
            ctx.fill();

            // Cross sparkle on bright larger particles
            if (alpha > 0.5 && p.r > 0.9) {
                ctx.strokeStyle = hexAlpha(p.color, alpha * 0.47);
                ctx.lineWidth = 0.5;
                const s = p.r * 3;
                ctx.beginPath();
                ctx.moveTo(p.x - s, p.y);
                ctx.lineTo(p.x + s, p.y);
                ctx.moveTo(p.x, p.y - s);
                ctx.lineTo(p.x, p.y + s);
                ctx.stroke();
            }
        });
        frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
}

// ─── Aurora ───────────────────────────────────────────────────────────────────
function drawAurora(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 0.8 + 0.2,
        a: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.002 + 0.001,
    }));

    // Aurora bands defined with rgba strings — no hex parsing needed here
    type Band = {
        y: number; amp: number; freq: number;
        phase: number; speed: number; width: number;
        c1: string; c2: string; c3: string;
    };

    const bands: Band[] = [
        { c1: 'rgba(76,29,149,0.13)', c2: 'rgba(124,58,237,0.20)', c3: 'rgba(139,92,246,0.13)' },
        { c1: 'rgba(12,74,110,0.10)', c2: 'rgba(3,105,161,0.16)', c3: 'rgba(6,182,212,0.13)' },
        { c1: 'rgba(131,24,67,0.10)', c2: 'rgba(190,24,93,0.17)', c3: 'rgba(236,72,153,0.13)' },
    ].map((colors, i) => ({
        ...colors,
        y: canvas.height * (0.15 + i * 0.18),
        amp: 40 + Math.random() * 30,
        freq: 0.003 + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.002,
        width: 120 + Math.random() * 80,
    }));

    let t = 0;
    let frame: number;

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        t += 0.008;

        // Stars underneath
        stars.forEach(s => {
            s.a += s.speed;
            const alpha = (Math.sin(s.a) + 1) / 2;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(229,221,255,${(alpha * 0.4).toFixed(3)})`;
            ctx.fill();
        });

        // Aurora ribbons
        bands.forEach(band => {
            band.phase += band.speed;
            const slices = 60;
            const sw = canvas.width / slices;

            for (let i = 0; i < slices; i++) {
                const x = i * sw;
                const wave = Math.sin(x * band.freq + band.phase) * band.amp;
                const cy = band.y + wave;

                const grad = ctx.createLinearGradient(x, cy - band.width / 2, x, cy + band.width / 2);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(0.3, band.c1);
                grad.addColorStop(0.5, band.c2);
                grad.addColorStop(0.7, band.c3);
                grad.addColorStop(1, 'transparent');

                const shimmer = (Math.sin(x * 0.02 + t * 2 + band.phase) + 1) / 2;
                ctx.globalAlpha = 0.3 + shimmer * 0.4;
                ctx.fillStyle = grad;
                ctx.fillRect(x, cy - band.width / 2, sw + 1, band.width);
            }
        });

        ctx.globalAlpha = 1;
        frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
}