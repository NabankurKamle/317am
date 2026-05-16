'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { NightCanvas } from '@/components/atmosphere/NightCanvas';
import { NeonButton } from '@/components/ui/NeonButton';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-night-900">
      <NightCanvas />
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-glow-violet/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-glow-pink/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-2xl">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-white/30 tracking-[0.4em] text-xs uppercase mb-6"
        >
          3:17 AM
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display text-5xl sm:text-6xl md:text-8xl text-white/90 leading-none mb-6"
        >
          Some thoughts only exist at night.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="text-white/40 text-lg mb-10"
        >
          A midnight archive for thoughts, memories, and emotions.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <NeonButton as={Link} href="/register" color="primary" glowColor="#8B5CF6">
            Enter the Archive
          </NeonButton>
          <NeonButton as={Link} href="/login" variant="bordered" glowColor="#EC4899">
            Return to Night
          </NeonButton>
        </motion.div>
      </div>
    </main>
  );
}