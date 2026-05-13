'use client';
import { useEffect, useRef } from 'react';

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    size: number; alpha: number;
    color: string;
}

const COLORS = ['#8B5CF6', '#A855F7', '#EC4899', '#7DD3FC'];

export function FloatingParticles({ count = 30 }: { count?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        const particles: Particle[] = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -Math.random() * 0.4 - 0.1,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.5 + 0.1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }));

        let frame: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
                ctx.fill();
            });
            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
    }, [count]);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}