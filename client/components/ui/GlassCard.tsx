
import { motion } from 'framer-motion';
import { cn } from '@nextui-org/react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    glow?: string;
    onClick?: () => void;
}

export function GlassCard({ children, className, glow, onClick }: GlassCardProps) {
    return (
        <motion.div
            whileHover={{ y: -2, scale: 1.005 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={cn('glass rounded-2xl p-6 cursor-default', className)}
            style={glow ? { boxShadow: `0 0 30px ${glow}22` } : undefined}
        >
            {children}
        </motion.div>
    );
}