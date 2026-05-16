'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { NightCanvas } from '@/components/atmosphere/NightCanvas';
import { GrainOverlay } from '@/components/atmosphere/GrainOverlay';

interface AppShellProps {
    children: React.ReactNode;
    topBarTitle?: string;
    topBarSubtitle?: string;
}

export function AppShell({ children, topBarTitle, topBarSubtitle }: AppShellProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-night-900 flex">
            <NightCanvas />    {/* single canvas, mode-aware */}
            <GrainOverlay />

            <Sidebar
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <div className="lg:ml-56 flex-1 flex flex-col relative z-10 min-w-0 h-screen">
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
                    className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-h-0"
                >
                    {children}
                </motion.main>
            </div>
        </div>
    );
}