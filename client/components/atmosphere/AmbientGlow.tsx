'use client';
import { motion } from 'framer-motion';
import { useMood } from '@/providers/MoodProvider';

export function AmbientGlow() {
    const { current } = useMood();

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <motion.div
                animate={{ background: `radial-gradient(circle at 30% 30%, ${current.glow}12 0%, transparent 60%)` }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                className="absolute inset-0"
            />
            <motion.div
                animate={{ background: `radial-gradient(circle at 75% 70%, ${current.glow}08 0%, transparent 50%)` }}
                transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.3 }}
                className="absolute inset-0"
            />
            {/* Static accent blobs */}
            <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-glow-violet/8 blur-[110px]" />
            <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full bg-glow-pink/6 blur-[90px]" />
        </div>
    );
}