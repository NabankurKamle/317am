'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@nextui-org/react';
import { NeonButton } from '@/components/ui/NeonButton';
import { useAuth } from '@/hooks/useAuth';
import { StarField } from '@/components/atmosphere/StarField';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) {
            toast.error('Fill in both fields', { description: 'The night needs to know who you are.' });
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back', { description: 'The archive remembers you.' });
        } catch (e: any) {
            toast.error(
                'The night doesn\'t recognize you',
                { description: e?.response?.data?.message || 'Check your credentials and try again.' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-night-900 flex items-center justify-center overflow-hidden relative">
            <StarField />
            <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-glow-violet/10 blur-[110px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass rounded-3xl p-10 w-full max-w-md relative z-10"
            >
                <p className="text-white/30 tracking-[0.3em] text-[10px] uppercase mb-2">3:17 AM</p>
                <h1 className="font-display text-4xl text-white/85 mb-1">Return to Night</h1>
                <p className="text-white/30 text-sm mb-8">Your archive awaits.</p>

                <div className="flex flex-col gap-4">
                    {[
                        { label: 'Email', key: 'email', type: 'email', val: email, set: setEmail },
                        { label: 'Password', key: 'password', type: 'password', val: password, set: setPassword },
                    ].map(({ label, key, type, val, set }, i) => (
                        <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                            <Input label={label} type={type} value={val} onValueChange={set}
                                classNames={{
                                    label: 'text-white/40 text-xs',
                                    input: 'bg-transparent text-white/80 placeholder:text-white/15',
                                    inputWrapper: 'bg-white/5 border border-white/10 hover:border-glow-violet/40 focus-within:border-glow-violet/60 transition-colors',
                                }}
                            />
                        </motion.div>
                    ))}

                    <NeonButton onClick={handleSubmit} isLoading={loading} color="primary" fullWidth className="mt-2" glowColor="#8B5CF6">
                        Enter the Archive
                    </NeonButton>

                    <p className="text-center text-white/25 text-xs">
                        New here?{' '}
                        <Link href="/register" className="text-glow-violet hover:text-glow-purple transition-colors">
                            Leave your first fragment
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}