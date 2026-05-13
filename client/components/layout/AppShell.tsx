'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { StarField } from '@/components/atmosphere/StarField';
import { AmbientGlow } from '@/components/atmosphere/AmbientGlow';
import { GrainOverlay } from '@/components/atmosphere/GrainOverlay';

interface AppShellProps {
    children: React.ReactNode;
    topBarTitle?: string;
    topBarSubtitle?: string;
}

export function AppShell({ children, topBarTitle, topBarSubtitle }: AppShellProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-night-900 flex">
            {/* Atmosphere */}
            <StarField />
            <AmbientGlow />
            <GrainOverlay />

            {/* Sidebar — manages its own desktop/mobile rendering */}
            <Sidebar
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col relative z-10 lg:ml-56 min-w-0">
                <TopBar
                    title={topBarTitle}
                    subtitle={topBarSubtitle}
                    onMenuToggle={() => setMobileOpen(o => !o)}
                    menuOpen={mobileOpen}
                />

                <motion.main
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
                >
                    {children}
                </motion.main>
            </div>
        </div>
    );
}