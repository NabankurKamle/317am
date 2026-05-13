'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@nextui-org/react';
import { NeonButton } from '@/components/ui/NeonButton';
import { useAuth } from '@/hooks/useAuth';
import { StarField } from '@/components/atmosphere/StarField';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RegisterPage() {
    const { register } = useAuth();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async () => {
        if (!form.username || !form.email || !form.password) {
            toast.error('Incomplete', { description: 'Fill in all the fragments before continuing.' });
            return;
        }
        if (form.password.length < 6) {
            toast.error('Password too short', { description: 'Needs at least 6 characters.' });
            return;
        }
        setLoading(true);
        try {
            await register(form);
            toast.success('Archive created', { description: 'Your first fragment is ready to be written.' });
        } catch (e: any) {
            toast.error(
                'Couldn\'t create your archive',
                { description: e?.response?.data?.message || 'Something broke in the night.' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-night-900 flex items-center justify-center overflow-hidden relative">
            <StarField />
            <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-glow-violet/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-56 h-56 rounded-full bg-glow-pink/8 blur-[90px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="glass rounded-3xl p-10 w-full max-w-md relative z-10"
            >
                <p className="text-white/30 tracking-[0.3em] text-[10px] uppercase mb-2">3:17 AM</p>
                <h1 className="font-display text-4xl text-white/85 mb-1">Leave Your First Fragment</h1>
                <p className="text-white/30 text-sm mb-8">Begin your midnight archive.</p>

                <div className="flex flex-col gap-4">
                    {[
                        { label: 'What do they call you?', key: 'username', type: 'text' },
                        { label: 'Email', key: 'email', type: 'email' },
                        { label: 'Password', key: 'password', type: 'password' },
                    ].map(({ label, key, type }, i) => (
                        <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                            <Input
                                label={label} type={type}
                                value={form[key as keyof typeof form]}
                                onValueChange={set(key)}
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
                        Already here?{' '}
                        <Link href="/login" className="text-glow-violet hover:text-glow-purple transition-colors">
                            Return to night
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}